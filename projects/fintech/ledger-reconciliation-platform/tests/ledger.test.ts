import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { LedgerStore } from "../src/store";

describe("Northstar Ledger API", () => {
  let store: LedgerStore;
  let app: ReturnType<typeof createApp>;
  beforeEach(() => { store = new LedgerStore(); app = createApp(store); });

  it("reports service health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
  it("seeds accounts and balanced opening ledger", async () => {
    const response = await request(app).get("/api/accounts");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body.find((a: {id:string}) => a.id === "cash-clearing").balanceCents).toBe(100000);
    expect(response.body.find((a: {id:string}) => a.id === "wallet-customer").balanceCents).toBe(100000);
  });
  it("posts a balanced journal entry", async () => {
    const response = await request(app).post("/api/journals").send({
      reference: "PAY-1001", description: "Customer wallet funding", currency: "GBP", idempotencyKey: "funding-1001",
      lines: [{accountId:"cash-clearing",debitCents:2500,creditCents:0},{accountId:"wallet-customer",debitCents:0,creditCents:2500}]
    });
    expect(response.status).toBe(201);
    expect(response.body.reference).toBe("PAY-1001");
  });
  it("rejects an unbalanced journal", async () => {
    const response = await request(app).post("/api/journals").send({
      reference:"BAD-1",description:"Unbalanced",currency:"GBP",idempotencyKey:"unbalanced-1",
      lines:[{accountId:"cash-clearing",debitCents:500,creditCents:0},{accountId:"wallet-customer",debitCents:0,creditCents:400}]
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain("unbalanced");
  });
  it("returns the original journal for a repeated idempotency key", async () => {
    const payload = {reference:"IDEMP-1",description:"Repeat safe",currency:"GBP",idempotencyKey:"repeat-key-001",
      lines:[{accountId:"cash-clearing",debitCents:100,creditCents:0},{accountId:"wallet-customer",debitCents:0,creditCents:100}]};
    const first = await request(app).post("/api/journals").send(payload);
    const second = await request(app).post("/api/journals").send({...payload,reference:"DIFFERENT-REF"});
    expect(second.body.id).toBe(first.body.id);
    expect(store.listEntries()).toHaveLength(2);
  });
  it("rejects mixed currencies", async () => {
    const response = await request(app).post("/api/journals").send({
      reference:"USD-1",description:"Wrong currency",currency:"USD",idempotencyKey:"wrong-currency-1",
      lines:[{accountId:"cash-clearing",debitCents:100,creditCents:0},{accountId:"wallet-customer",debitCents:0,creditCents:100}]
    });
    expect(response.status).toBe(400);
  });
  it("rejects invalid debit and credit on the same line", async () => {
    const response = await request(app).post("/api/journals").send({
      reference:"BOTH-1",description:"Both sides",currency:"GBP",idempotencyKey:"both-sides-001",
      lines:[{accountId:"cash-clearing",debitCents:100,creditCents:100},{accountId:"wallet-customer",debitCents:0,creditCents:100}]
    });
    expect(response.status).toBe(400);
  });
  it("reconciles statement references and reports missing ledger entries", async () => {
    const response = await request(app).post("/api/reconciliation").send([
      {externalRef:"SEED-OPENING-001",amountCents:100000,currency:"GBP"},
      {externalRef:"BANK-ONLY-1",amountCents:500,currency:"GBP"}
    ]);
    expect(response.status).toBe(200);
    expect(response.body.matched).toContain("SEED-OPENING-001");
    expect(response.body.unmatched).toContain("BANK-ONLY-1");
  });
  it("rejects non-GBP reconciliation statement rows", async () => {
    const response = await request(app).post("/api/reconciliation").send([
      {externalRef:"USD-ROW",amountCents:100,currency:"USD"}
    ]);
    expect(response.status).toBe(400);
  });
  it("exposes balanced ledger metrics", async () => {
    const response = await request(app).get("/api/metrics");
    expect(response.body.totalDebitsCents).toBe(response.body.totalCreditsCents);
    expect(response.body.journalEntryCount).toBe(1);
  });
  it("prevents duplicate account identifiers", async () => {
    const response = await request(app).post("/api/accounts").send({name:"Customer Wallet Liability",type:"liability",currency:"GBP"});
    expect(response.status).toBe(409);
  });
});
