import express from "express";
import { z } from "zod";
import { LedgerError, LedgerStore } from "./store";

const accountSchema = z.object({
  name: z.string().trim().min(2).max(100),
  type: z.enum(["asset", "liability", "revenue", "expense", "equity"]),
  currency: z.string().regex(/^[A-Za-z]{3}$/)
});
const journalSchema = z.object({
  reference: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(500),
  currency: z.string().regex(/^[A-Za-z]{3}$/),
  idempotencyKey: z.string().trim().min(8).max(120),
  lines: z.array(z.object({
    accountId: z.string().min(1),
    debitCents: z.number().int().nonnegative().safe(),
    creditCents: z.number().int().nonnegative().safe()
  })).min(2).max(50)
});
const statementSchema = z.array(z.object({
  externalRef: z.string().trim().min(1),
  amountCents: z.number().int().safe(),
  currency: z.string().regex(/^[A-Za-z]{3}$/)
})).max(10000);

export function createApp(store = new LedgerStore()) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "256kb" }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "northstar-ledger" }));
  app.get("/api/metrics", (_req, res) => res.json(store.metrics()));
  app.get("/api/accounts", (_req, res) => res.json(store.listAccounts().map(account => ({ ...account, balanceCents: store.balance(account.id) }))));
  app.post("/api/accounts", (req, res) => {
    const parsed = accountSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid account", details: parsed.error.flatten() });
    try { return res.status(201).json(store.createAccount(parsed.data)); }
    catch (error) { return handleError(error, res); }
  });
  app.get("/api/journals", (_req, res) => res.json(store.listEntries()));
  app.get("/api/journals/:id", (req, res) => {
    const entry = store.getEntry(req.params.id);
    return entry ? res.json(entry) : res.status(404).json({ error: "Journal entry not found." });
  });
  app.post("/api/journals", (req, res) => {
    const parsed = journalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid journal entry", details: parsed.error.flatten() });
    try { return res.status(201).json(store.postEntry(parsed.data)); }
    catch (error) { return handleError(error, res); }
  });
  app.post("/api/reconciliation", (req, res) => {
    const parsed = statementSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid statement lines", details: parsed.error.flatten() });
    const currencyMismatch = parsed.data.some(line => line.currency.toUpperCase() !== "GBP");
    if (currencyMismatch) return res.status(400).json({ error: "This demonstration reconciliation accepts GBP statement lines only." });
    return res.json(store.reconcile(parsed.data));
  });
  return app;
}

function handleError(error: unknown, res: express.Response) {
  if (error instanceof LedgerError) return res.status(error.statusCode).json({ error: error.message });
  return res.status(500).json({ error: "Unexpected ledger error." });
}
