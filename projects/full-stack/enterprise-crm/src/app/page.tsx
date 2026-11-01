"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Status = "LEAD" | "QUALIFIED" | "CUSTOMER" | "INACTIVE";
type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  phone: string | null;
  status: Status;
  notes: string | null;
  createdAt: string;
};

const statusLabels: Record<Status, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  CUSTOMER: "Customer",
  INACTIVE: "Inactive",
};

export default function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (status !== "ALL") params.set("status", status);
      const response = await fetch(`/api/contacts?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load contacts. Check the database connection.");
      setContacts(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(() => void loadContacts(), 250);
    return () => clearTimeout(timer);
  }, [loadContacts]);

  const counts = useMemo(() => ({
    total: contacts.length,
    leads: contacts.filter((contact) => contact.status === "LEAD").length,
    qualified: contacts.filter((contact) => contact.status === "QUALIFIED").length,
    customers: contacts.filter((contact) => contact.status === "CUSTOMER").length,
  }), [contacts]);

  async function createContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not create contact");
      form.reset();
      await loadContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(contact: Contact, nextStatus: Status) {
    const response = await fetch(`/api/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "Could not update contact");
      return;
    }
    await loadContacts();
  }

  async function removeContact(contact: Contact) {
    if (!window.confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) return;
    const response = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not delete contact");
      return;
    }
    await loadContacts();
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>northstar<span className="brand-muted">.crm</span></span></div>
        <p className="nav-caption">WORKSPACE</p>
        <a className="nav-item active" href="#contacts">◈ <span>Contacts</span></a>
        <a className="nav-item" href="#pipeline">▥ <span>Sales pipeline</span><small>Next</small></a>
        <a className="nav-item" href="#reports">◷ <span>Reports</span><small>Next</small></a>
        <div className="sidebar-bottom"><div className="avatar">JD</div><div><strong>Portfolio demo</strong><small>Local workspace</small></div></div>
      </aside>

      <section className="main-panel" id="contacts">
        <header className="topbar"><span>Workspace / Contacts</span><span className="environment">DEMO ENVIRONMENT</span></header>
        <div className="content">
          <div className="page-heading"><div><p className="eyebrow">CUSTOMER RELATIONSHIP MANAGEMENT</p><h1>Contacts</h1><p className="subheading">Manage relationships and keep your sales pipeline moving.</p></div></div>

          <section className="metrics" aria-label="Contact summary">
            <article className="metric"><span>Total contacts</span><strong>{counts.total}</strong><small>Matching current view</small></article>
            <article className="metric"><span>New leads</span><strong>{counts.leads}</strong><small>Awaiting qualification</small></article>
            <article className="metric"><span>Qualified</span><strong>{counts.qualified}</strong><small>Sales-ready contacts</small></article>
            <article className="metric"><span>Customers</span><strong>{counts.customers}</strong><small>Converted relationships</small></article>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><h2>Contact directory</h2><p>Search, qualify and maintain your relationships.</p></div></div>
            <div className="toolbar">
              <input aria-label="Search contacts" placeholder="Search name, email or company…" value={search} onChange={(event) => setSearch(event.target.value)} />
              <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="ALL">All statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            {error && <p className="error" role="alert">{error}</p>}
            {loading ? <p className="empty">Loading contacts…</p> : contacts.length === 0 ? <p className="empty">No contacts found. Add your first contact using the form below.</p> : (
              <div className="table-wrap"><table><thead><tr><th>CONTACT</th><th>COMPANY</th><th>STATUS</th><th>ADDED</th><th>ACTIONS</th></tr></thead>
                <tbody>{contacts.map((contact) => <tr key={contact.id}>
                  <td><strong>{contact.firstName} {contact.lastName}</strong><small>{contact.email}</small></td>
                  <td>{contact.company || "—"}<small>{contact.jobTitle || ""}</small></td>
                  <td><span className={`status status-${contact.status.toLowerCase()}`}>{statusLabels[contact.status]}</span></td>
                  <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td><select aria-label={`Change status for ${contact.firstName}`} value={contact.status} onChange={(event) => void changeStatus(contact, event.target.value as Status)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="delete" onClick={() => void removeContact(contact)} aria-label={`Delete ${contact.firstName}`}>Delete</button></td>
                </tr>)}</tbody></table></div>
            )}
          </section>

          <section className="panel add-panel">
            <div className="panel-heading"><div><h2>Add a contact</h2><p>Create a new lead or customer record.</p></div></div>
            <form className="contact-form" onSubmit={createContact}>
              <label>First name<input name="firstName" required maxLength={80} /></label>
              <label>Last name<input name="lastName" required maxLength={80} /></label>
              <label>Email address<input name="email" type="email" required maxLength={254} /></label>
              <label>Company<input name="company" maxLength={120} /></label>
              <label>Job title<input name="jobTitle" maxLength={120} /></label>
              <label>Phone<input name="phone" maxLength={40} /></label>
              <label>Status<select name="status" defaultValue="LEAD">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="wide">Notes<textarea name="notes" rows={3} maxLength={4000} /></label>
              <div className="form-actions"><button className="primary" disabled={saving}>{saving ? "Saving…" : "Add contact"}</button></div>
            </form>
          </section>
          <footer>Northstar CRM · Portfolio engineering project · Not for production use</footer>
        </div>
      </section>
    </main>
  );
}
