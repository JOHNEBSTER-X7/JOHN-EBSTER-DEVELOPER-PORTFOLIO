import {describe,it,expect} from "vitest";
import request from "supertest";
import {createApp} from "../src/app";
describe("Financial crime REST API",()=>{
 it("serves health and dashboard",async()=>{const app=createApp();expect((await request(app).get("/health")).status).toBe(200);expect((await request(app).get("/dashboard")).body.customers).toBe(0);});
 it("creates a customer and screens it",async()=>{const app=createApp();const c=await request(app).post("/customers").send({name:"Sample Public Official",kind:"individual",country:"GB",occupationOrIndustry:"Public service"});expect(c.status).toBe(201);const r=await request(app).post(`/customers/${c.body.customer.id}/screening`).send({actor:"screening-engine"});expect(r.body.results).toHaveLength(1);});
 it("validates transaction monitoring input",async()=>{expect((await request(createApp()).post("/transactions/monitor").send({amountMinor:-1})).status).toBe(400);});
 it("returns alerts and audit registers",async()=>{const app=createApp();expect((await request(app).get("/alerts")).body).toEqual([]);expect((await request(app).get("/audit")).body).toEqual([]);});
});
