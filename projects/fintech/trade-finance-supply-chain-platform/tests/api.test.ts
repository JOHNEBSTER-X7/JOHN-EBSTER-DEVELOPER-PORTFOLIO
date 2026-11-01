import {describe,it,expect} from "vitest";
import request from "supertest";
import {createApp} from "../src/app";
describe("Trade finance API",()=>{
 it("serves health and dashboard",async()=>{const app=createApp();expect((await request(app).get("/health")).status).toBe(200);expect((await request(app).get("/dashboard")).body.applications).toBe(0);});
 it("creates and lists trade parties",async()=>{const app=createApp();const r=await request(app).post("/parties").send({name:"Importer Limited",role:"importer",country:"GB"});expect(r.status).toBe(201);expect((await request(app).get("/parties")).body).toHaveLength(1);});
 it("rejects malformed application payload",async()=>{expect((await request(createApp()).post("/applications").send({type:"bad"})).status).toBe(400);});
});
