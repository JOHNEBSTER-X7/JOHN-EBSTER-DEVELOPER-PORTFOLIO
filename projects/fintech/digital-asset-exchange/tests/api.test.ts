import {describe,it,expect} from "vitest";
import request from "supertest";
import {createApp} from "../src/app";
describe("Exchange API",()=>{
 it("serves health and market metadata",async()=>{const app=createApp();expect((await request(app).get("/health")).status).toBe(200);expect((await request(app).get("/markets")).body).toHaveLength(1);});
 it("funds an account and submits an order",async()=>{
  const app=createApp();await request(app).post("/accounts/alice/fund").send({base:0,quote:100});
  const r=await request(app).post("/orders").send({accountId:"alice",symbol:"NSTAR-USD",side:"buy",type:"limit",quantity:1,price:10});
  expect(r.status).toBe(201);expect(r.body.order.status).toBe("open");
 });
 it("validates malformed orders",async()=>{const r=await request(createApp()).post("/orders").send({side:"buy"});expect(r.status).toBe(400);});
});
