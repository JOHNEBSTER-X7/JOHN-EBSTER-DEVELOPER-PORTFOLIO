import {describe,it,expect} from "vitest";import request from "supertest";import {createApp} from "../src/app";
describe("Private credit API",()=>{
it("returns health status",async()=>{const r=await request(createApp()).get("/health");expect(r.status).toBe(200);expect(r.body.status).toBe("ok");});
it("validates party input",async()=>{const r=await request(createApp()).post("/parties").send({name:"x"});expect(r.status).toBe(400);});
it("creates a borrower record",async()=>{const r=await request(createApp()).post("/parties").send({name:"Borrower Ltd",kind:"borrower",jurisdiction:"GB"});expect(r.status).toBe(201);});
it("returns empty facilities register",async()=>{const r=await request(createApp()).get("/facilities");expect(r.body).toEqual([]);});
});