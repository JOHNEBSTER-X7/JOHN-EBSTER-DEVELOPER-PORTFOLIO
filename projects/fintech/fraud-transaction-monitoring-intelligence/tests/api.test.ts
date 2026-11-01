import {afterEach,describe,it,expect} from "vitest";
import request from "supertest";
import {app,service} from "../src/app";
afterEach(()=>{service.transactions.length=0;service.cases.length=0;service.audit.length=0;});
const payload={reference:"api-tx-1",customerId:"customer-1",accountId:"account-1",amountMinor:700000,currency:"GBP",direction:"debit",counterpartyId:"cp-1",counterpartyName:"Demo Counterparty",country:"GB",channel:"web",occurredAt:"2026-10-01T10:00:00.000Z"};
describe("Fraud intelligence REST API",()=>{
 it("exposes service health and synthetic-data mode",async()=>{const r=await request(app).get("/health");expect(r.status).toBe(200);expect(r.body.mode).toBe("synthetic-data");});
 it("ingests a transaction and returns an explainable risk score",async()=>{const r=await request(app).post("/transactions").send(payload);expect(r.status).toBe(201);expect(r.body.riskScore).toBeGreaterThan(0);expect(r.body.signals[0].code).toBe("LARGE_VALUE");});
 it("returns the existing transaction for a repeated reference",async()=>{await request(app).post("/transactions").send(payload);const r=await request(app).post("/transactions").send(payload);expect(r.status).toBe(200);expect(service.transactions).toHaveLength(1);});
 it("validates malformed transaction payloads",async()=>{const r=await request(app).post("/transactions").send({...payload,amountMinor:-10});expect(r.status).toBe(400);});
 it("lists alerts, cases and dashboard metrics",async()=>{await request(app).post("/transactions").send({...payload,country:"IR"});const [a,c,d]=await Promise.all([request(app).get("/alerts"),request(app).get("/cases"),request(app).get("/dashboard")]);expect(a.body).toHaveLength(1);expect(c.body).toHaveLength(1);expect(d.body.transactionCount).toBe(1);});
 it("supports assignment, analyst notes and disposition through API",async()=>{await request(app).post("/transactions").send({...payload,country:"IR"});const id=service.cases[0].id;expect((await request(app).post("/cases/"+id+"/assign").send({analyst:"analyst-1"})).body.status).toBe("investigating");expect((await request(app).post("/cases/"+id+"/notes").send({actor:"analyst-1",note:"Customer callback requested"})).body.notes).toHaveLength(1);expect((await request(app).post("/cases/"+id+"/close").send({actor:"reviewer",disposition:"false_positive",rationale:"Customer verified transaction"})).body.status).toBe("closed");});
 it("exposes shared counterparty network and audit endpoints",async()=>{await request(app).post("/transactions").send({...payload,country:"IR"});const n=await request(app).get("/network/shared-counterparties");const a=await request(app).get("/audit");expect(n.status).toBe(200);expect(a.body.length).toBeGreaterThan(0);});
});
