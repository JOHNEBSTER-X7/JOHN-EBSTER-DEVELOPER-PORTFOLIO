import { describe,it,expect } from "vitest";
import request from "supertest";
import { createIndexerApp } from "../src/indexer";
describe("event indexer",()=>{
 const app=createIndexerApp();
 const event={chainId:31337,contractAddress:"0x"+"1".repeat(40),transactionHash:"0x"+"a".repeat(64),blockNumber:10,eventName:"AssetRegistered",payload:{assetId:1,name:"Sample Asset"}};
 it("accepts and indexes a chain event",async()=>{const r=await request(app).post("/events").send(event);expect(r.status).toBe(201);expect(r.body.event.eventName).toBe("AssetRegistered");});
 it("deduplicates repeated event submissions",async()=>{const r=await request(app).post("/events").send(event);expect(r.body.duplicate).toBe(true);});
 it("filters events by chain",async()=>{const r=await request(app).get("/events?chainId=31337");expect(r.body.length).toBe(1);});
 it("rejects malformed transaction hashes",async()=>{const r=await request(app).post("/events").send({...event,transactionHash:"bad"});expect(r.status).toBe(400);});
});
