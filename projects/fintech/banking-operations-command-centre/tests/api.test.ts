import {afterEach,describe,it,expect} from "vitest";
import request from "supertest";
import {app,service} from "../src/app";
afterEach(()=>{service.audit.length=0;});
describe("Command centre API",()=>{
 it("reports synthetic demo health",async()=>{const r=await request(app).get("/api/health");expect(r.status).toBe(200);expect(r.body.mode).toBe("synthetic-demo");});
 it("serves the dashboard UI",async()=>{const r=await request(app).get("/");expect(r.status).toBe(200);expect(r.text).toContain("Banking Operations Command Centre");});
 it("returns consolidated dashboard metrics",async()=>{const r=await request(app).get("/api/dashboard");expect(r.status).toBe(200);expect(r.body.kpis.paymentsToday).toBe(5);});
 it("lists payments, alerts, liquidity and work items",async()=>{const [p,a,l,w]=await Promise.all([request(app).get("/api/payments"),request(app).get("/api/alerts"),request(app).get("/api/liquidity"),request(app).get("/api/work-items")]);expect(p.body).toHaveLength(5);expect(a.body).toHaveLength(5);expect(l.body).toHaveLength(4);expect(w.body).toHaveLength(4);});
 it("acknowledges an alert over HTTP",async()=>{const r=await request(app).post("/api/alerts/al-001/actions").send({action:"acknowledge",actor:"ops-analyst"});expect(r.status).toBe(200);expect(r.body.status).toBe("acknowledged");});
 it("validates action payloads",async()=>{const r=await request(app).post("/api/alerts/al-001/actions").send({action:"delete",actor:"x"});expect(r.status).toBe(400);});
 it("updates a work item over HTTP",async()=>{const r=await request(app).post("/api/work-items/wi-001/status").send({status:"completed",actor:"ops-user"});expect(r.status).toBe(200);expect(r.body.status).toBe("completed");});
 it("exposes activity and audit endpoints",async()=>{const a=await request(app).get("/api/activity");const b=await request(app).get("/api/audit");expect(a.body.length).toBeGreaterThan(0);expect(b.status).toBe(200);});
});
