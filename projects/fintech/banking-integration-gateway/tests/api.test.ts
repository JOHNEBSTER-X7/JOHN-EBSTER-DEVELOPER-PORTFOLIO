import {beforeAll,describe,it,expect} from "vitest";
import request from "supertest";
import {app,service} from "../src/app";
const sample={eventId:"event-api-0001",eventType:"payments.payment.created",schemaVersion:"1.0",source:"payments",occurredAt:"2026-11-01T10:00:00.000Z",correlationId:"corr-api-001",subjectId:"payment-api-001",payload:{amountMinor:2500,currency:"GBP"}};
beforeAll(()=>{process.env.INTEGRATION_API_KEYS="payments:testkey,treasury:treasurykey";});
describe("Integration gateway API",()=>{
 it("reports gateway health",async()=>{const r=await request(app).get("/api/health");expect(r.status).toBe(200);expect(r.body.mode).toBe("simulated-adapters");});
 it("returns routing summary",async()=>{const r=await request(app).get("/api/summary");expect(r.status).toBe(200);expect(r.body.domains).toHaveLength(6);});
 it("rejects ingestion without credentials",async()=>{const r=await request(app).post("/api/events").send(sample);expect(r.status).toBe(401);});
 it("rejects invalid credentials",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer payments:wrong").send(sample);expect(r.status).toBe(401);});
 it("rejects mismatched domain credentials",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer treasury:treasurykey").send(sample);expect(r.status).toBe(400);});
 it("accepts a valid authenticated event",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer payments:testkey").send(sample);expect(r.status).toBe(202);expect(r.body.deliveries).toHaveLength(3);});
 it("deduplicates repeated event identifiers",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer payments:testkey").send(sample);expect(r.status).toBe(200);expect(r.body.duplicate).toBe(true);});
 it("scopes delivery retries to the event producer domain",async()=>{const d=service.deliveries.find(x=>x.eventId===sample.eventId)!;d.status="failed";const denied=await request(app).post("/api/deliveries/"+d.id+"/retry").set("Authorization","Bearer treasury:treasurykey").send({});expect(denied.status).toBe(400);const accepted=await request(app).post("/api/deliveries/"+d.id+"/retry").set("Authorization","Bearer payments:testkey").send({});expect(accepted.status).toBe(200);expect(accepted.body.status).toBe("delivered");});
});
