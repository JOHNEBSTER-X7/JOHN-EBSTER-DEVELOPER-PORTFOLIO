import {describe,it,expect} from "vitest";
import request from "supertest";
import {createApp} from "../src/app";
describe("Treasury REST API",()=>{
 it("serves health and dashboard",async()=>{const app=createApp();expect((await request(app).get("/health")).status).toBe(200);expect((await request(app).get("/dashboard")).body.baseCurrency).toBe("GBP");});
 it("submits, approves and completes a transaction",async()=>{const app=createApp();const created=await request(app).post("/transactions").send({accountId:"treasury-demo",currency:"GBP",amountMinor:500,direction:"outflow",description:"Test payment"});expect(created.status).toBe(201);const id=created.body.transaction.id;expect((await request(app).post(`/transactions/${id}/decision`).send({reviewerId:"independent-reviewer",decision:"approve"})).body.transaction.status).toBe("approved");expect((await request(app).post(`/transactions/${id}/complete`)).body.transaction.status).toBe("completed");});
 it("validates malformed forecast flow",async()=>{expect((await request(createApp()).post("/forecast/flows").send({currency:"GBP"})).status).toBe(400);});
});
