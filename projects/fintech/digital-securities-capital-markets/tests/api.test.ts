import {describe,it,expect} from "vitest";import request from "supertest";import {createApp} from "../src/app";
describe("Capital markets REST API",()=>{
it("serves health and dashboard",async()=>{const a=createApp();expect((await request(a).get("/health")).status).toBe(200);expect((await request(a).get("/dashboard")).body.securities).toBe(0);});
it("validates investor onboarding",async()=>{expect((await request(createApp()).post("/investors").send({name:"x"})).status).toBe(400);});
it("creates investor and issuer records",async()=>{const a=createApp();expect((await request(a).post("/investors").send({name:"Investor",type:"individual",jurisdiction:"GB"})).status).toBe(201);expect((await request(a).post("/issuers").send({name:"Issuer",jurisdiction:"GB"})).status).toBe(201);});
it("exposes custody, trade and audit registers",async()=>{const a=createApp();expect((await request(a).get("/holdings")).body).toEqual([]);expect((await request(a).get("/trades")).body).toEqual([]);expect((await request(a).get("/audit")).body).toEqual([]);});
});
