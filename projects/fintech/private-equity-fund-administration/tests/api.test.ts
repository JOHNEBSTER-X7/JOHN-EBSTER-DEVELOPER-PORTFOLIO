import {describe,it,expect} from "vitest";import request from "supertest";import {createApp} from "../src/app";
describe("Fund administration REST API",()=>{
it("serves health and dashboard",async()=>{const a=createApp();expect((await request(a).get("/health")).status).toBe(200);expect((await request(a).get("/dashboard")).body.funds).toBe(0);});
it("validates people and fund creation payloads",async()=>{const a=createApp();expect((await request(a).post("/people").send({name:"x"})).status).toBe(400);expect((await request(a).post("/funds").send({name:"x"})).status).toBe(400);});
it("creates GP and LP records",async()=>{const a=createApp();expect((await request(a).post("/people").send({name:"GP Partner",kind:"gp",jurisdiction:"GB"})).status).toBe(201);expect((await request(a).post("/people").send({name:"LP Partner",kind:"lp",jurisdiction:"GB"})).status).toBe(201);});
it("exposes operational registers",async()=>{const a=createApp();expect((await request(a).get("/funds")).body).toEqual([]);expect((await request(a).get("/capital-calls")).body).toEqual([]);expect((await request(a).get("/investments")).body).toEqual([]);expect((await request(a).get("/audit")).body).toEqual([]);});
});
