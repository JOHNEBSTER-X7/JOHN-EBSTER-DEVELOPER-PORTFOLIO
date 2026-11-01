import {describe,it,expect} from "vitest";
import request from "supertest";
import {createApp} from "../src/app";
describe("Open Banking REST API",()=>{
 it("serves health and dashboard",async()=>{const app=createApp();expect((await request(app).get("/health")).status).toBe(200);expect((await request(app).get("/dashboard")).body.accounts).toBe(3);});
 it("creates consent and aggregates account information",async()=>{const app=createApp();const c=await request(app).post("/consents").send({clientId:"client-a",userId:"customer-001",accountIds:["acc-gbp-001"],scopes:["accounts:read"],durationDays:30});expect(c.status).toBe(201);const result=await request(app).get("/aggregated/accounts").set("x-consent-id",c.body.consent.id).set("x-client-id","client-a");expect(result.status).toBe(200);expect(result.body).toHaveLength(1);});
 it("rejects malformed payment payload",async()=>{expect((await request(createApp()).post("/payments").send({amountMinor:-1})).status).toBe(400);});
 it("requires consent headers for aggregated data",async()=>{expect((await request(createApp()).get("/aggregated/accounts")).status).toBe(403);});
});
