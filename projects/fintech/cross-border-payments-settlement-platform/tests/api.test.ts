import {afterEach,describe,it,expect} from "vitest";
import request from "supertest";
import {app,service} from "../src/server";

afterEach(()=>{service.payments.length=0;service.quotes.length=0;service.audit.length=0;service.accounts.forEach(a=>{a.reservedMinor=0;});});
describe("Payments REST API",()=>{
 it("exposes a health endpoint",async()=>{const r=await request(app).get("/health");expect(r.status).toBe(200);expect(r.body.mode).toBe("simulation");});
 it("creates and screens a payment through HTTP",async()=>{const created=await request(app).post("/payments").send({idempotencyKey:"api-1",sourceAccountId:"acc-gbp-001",beneficiaryId:"ben-001",amountMinor:1000,currency:"GBP"});expect(created.status).toBe(201);const screened=await request(app).post("/payments/"+created.body.id+"/screen");expect(screened.body.status).toBe("approved");});
 it("validates malformed payment input",async()=>{const r=await request(app).post("/payments").send({amountMinor:-1});expect(r.status).toBe(400);});
 it("returns treasury dashboard metrics",async()=>{const r=await request(app).get("/dashboard");expect(r.status).toBe(200);expect(r.body.accounts).toHaveLength(3);});
});
