import { randomUUID } from "node:crypto";
import type { Account, AccountType, JournalEntry, JournalLine, ReconciliationResult, StatementLine } from "./types";

export class LedgerError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message);
    this.name = "LedgerError";
  }
}

export class LedgerStore {
  private accounts = new Map<string, Account>();
  private entries: JournalEntry[] = [];
  private idempotency = new Map<string, JournalEntry>();

  constructor(seed = true) {
    if (seed) this.seed();
  }

  private seed() {
    this.createAccount({ id: "wallet-customer", name: "Customer Wallet Liability", type: "liability", currency: "GBP" });
    this.createAccount({ id: "cash-clearing", name: "Cash Clearing Asset", type: "asset", currency: "GBP" });
    this.createAccount({ id: "merchant-payable", name: "Merchant Payable", type: "liability", currency: "GBP" });
    this.createAccount({ id: "fee-revenue", name: "Fee Revenue", type: "revenue", currency: "GBP" });
    this.postEntry({
      reference: "SEED-OPENING-001",
      description: "Illustrative opening position",
      currency: "GBP",
      idempotencyKey: "seed-opening",
      lines: [
        { accountId: "cash-clearing", debitCents: 100000, creditCents: 0 },
        { accountId: "wallet-customer", debitCents: 0, creditCents: 100000 }
      ]
    });
  }

  createAccount(input: { id?: string; name: string; type: AccountType; currency: string }): Account {
    const id = input.id ?? randomUUID();
    if (this.accounts.has(id)) throw new LedgerError("Account ID already exists.", 409);
    if ([...this.accounts.values()].some(a => a.name === input.name && a.currency === input.currency)) {
      throw new LedgerError("An account with this name and currency already exists.", 409);
    }
    const account: Account = { ...input, id, currency: input.currency.toUpperCase(), createdAt: new Date().toISOString() };
    this.accounts.set(id, account);
    return account;
  }

  listAccounts() { return [...this.accounts.values()]; }
  listEntries() { return [...this.entries].reverse(); }
  getEntry(id: string) { return this.entries.find(entry => entry.id === id); }

  balance(accountId: string): number {
    const account = this.accounts.get(accountId);
    if (!account) throw new LedgerError("Account not found.", 404);
    const totals = this.entries.flatMap(entry => entry.lines.map(line => ({ entry, line })))
      .filter(item => item.line.accountId === accountId)
      .reduce((sum, item) => sum + item.line.debitCents - item.line.creditCents, 0);
    return ["asset", "expense"].includes(account.type) ? totals : -totals;
  }

  postEntry(input: { reference: string; description: string; currency: string; idempotencyKey: string; lines: JournalLine[] }): JournalEntry {
    const prior = this.idempotency.get(input.idempotencyKey);
    if (prior) return prior;
    if (input.lines.length < 2) throw new LedgerError("A journal entry requires at least two lines.");
    const currency = input.currency.toUpperCase();
    let debits = 0;
    let credits = 0;
    const seen = new Set<string>();
    for (const line of input.lines) {
      if (!Number.isSafeInteger(line.debitCents) || !Number.isSafeInteger(line.creditCents) || line.debitCents < 0 || line.creditCents < 0) {
        throw new LedgerError("Journal amounts must be non-negative integer minor units.");
      }
      if ((line.debitCents > 0) === (line.creditCents > 0)) throw new LedgerError("Each line must contain either a debit or a credit, not both or neither.");
      const account = this.accounts.get(line.accountId);
      if (!account) throw new LedgerError(`Account not found: ${line.accountId}`, 404);
      if (account.currency !== currency) throw new LedgerError("All accounts must use the journal currency.");
      if (seen.has(line.accountId)) throw new LedgerError("An account may appear only once per journal entry.");
      seen.add(line.accountId);
      debits += line.debitCents;
      credits += line.creditCents;
    }
    if (debits <= 0 || debits !== credits) throw new LedgerError("Journal entry is unbalanced: total debits must equal total credits.");
    const entry: JournalEntry = {
      id: randomUUID(), reference: input.reference, description: input.description,
      currency, lines: input.lines.map(line => ({ ...line })),
      idempotencyKey: input.idempotencyKey, createdAt: new Date().toISOString()
    };
    this.entries.push(entry);
    this.idempotency.set(input.idempotencyKey, entry);
    return entry;
  }

  reconcile(statement: StatementLine[]): ReconciliationResult {
    const references = new Set(this.entries.map(entry => entry.reference));
    const seen = new Set<string>();
    const matched: string[] = [];
    const unmatched: string[] = [];
    for (const line of statement) {
      if (seen.has(line.externalRef)) {
        unmatched.push(line.externalRef);
      } else if (references.has(line.externalRef)) {
        matched.push(line.externalRef);
        seen.add(line.externalRef);
      } else {
        unmatched.push(line.externalRef);
      }
    }
    const statementRefs = new Set(statement.map(line => line.externalRef));
    const missingFromLedger = [...references].filter(reference => !statementRefs.has(reference));
    return { matched, unmatched, missingFromLedger };
  }

  metrics() {
    return {
      accountCount: this.accounts.size,
      journalEntryCount: this.entries.length,
      totalDebitsCents: this.entries.reduce((sum, entry) => sum + entry.lines.reduce((n, line) => n + line.debitCents, 0), 0),
      totalCreditsCents: this.entries.reduce((sum, entry) => sum + entry.lines.reduce((n, line) => n + line.creditCents, 0), 0)
    };
  }
}
