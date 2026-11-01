import {beforeAll,describe,it,expect} from "vitest";
import request from "supertest";
import {app} from "../src/app";
const event={eventId:"event-api-stream-0001",eventType:"payments.payment.created",schemaVersion:"1.0",source:"payments",occurredAt:"2026-11-01T10:00:00.000Z",correlationId:"corr-api-001",subjectId:"payment-api-001",payload:{currency:"GBP",amountMinor:2500}};
beforeAll(()=>{process.env.STREAM_API_KEYS="payments:pay-key,admin:admin-key,consumer:consumer-key";});
describe("Banking event stream API",()=>{
 it("reports append-only stream health",async()=>{const r=await request(app).get("/api/health");expect(r.status).toBe(200);expect(r.body.storage).toBe("append-only-jsonl");});
 it("rejects event publishing without credentials",async()=>{const r=await request(app).post("/api/events").send(event);expect(r.status).toBe(401);});
 it("accepts domain-authenticated event and returns offset",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer pay-key").send(event);expect(r.status).toBe(201);expect(r.body.event.offset).toBe(1);});
 it("returns duplicate event as HTTP 200",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer pay-key").send(event);expect(r.status).toBe(200);expect(r.body.duplicate).toBe(true);});
 it("rejects credentials that do not match event source",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer admin-key").send({...event,eventId:"event-api-stream-0002"});expect(r.status).toBe(400);});
 it("rejects missing schema payload fields",async()=>{const r=await request(app).post("/api/events").set("Authorization","Bearer pay-key").send({...event,eventId:"event-api-stream-0003",payload:{currency:"GBP"}});expect(r.status).toBe(400);});
 it("requires admin role to register schemas",async()=>{const denied=await request(app).post("/api/schemas").set("Authorization","Bearer pay-key").send({key:"payments.payment.created",domain:"payments",version:"2.0",required:[]});expect(denied.status).toBe(400);const accepted=await request(app).post("/api/schemas").set("Authorization","Bearer admin-key").send({key:"payments.payment.created",domain:"payments",version:"2.0",required:["currency"]});expect(accepted.status).toBe(201);});
 it("registers consumer, polls stream and acknowledges offset",async()=>{const reg=await request(app).post("/api/consumers").set("Authorization","Bearer consumer-key").send({name:"api-dashboard"});expect(reg.status).toBe(201);const poll=await request(app).get("/api/consumers/api-dashboard/poll").set("Authorization","Bearer consumer-key");expect(poll.body.some((x:any)=>x.eventId===event.eventId)).toBe(true);const ack=await request(app).post("/api/consumers/api-dashboard/ack").set("Authorization","Bearer consumer-key").send({offset:1});expect(ack.status).toBe(200);expect(ack.body.offset).toBe(1);});
 it("exposes stream snapshot and event offset query",async()=>{const s=await request(app).get("/api/stream");const e=await request(app).get("/api/events?after=0&limit=10");expect(s.status).toBe(200);expect(s.body.stream.events).toBeGreaterThanOrEqual(1);expect(e.body.some((x:any)=>x.eventId===event.eventId)).toBe(true);});
});
