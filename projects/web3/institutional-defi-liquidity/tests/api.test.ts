import {describe,it,expect} from "vitest";
import request from "supertest";
import {createIndexerApp} from "../src/indexer";
describe("DeFi event indexer",()=>{
 const app=createIndexerApp();
 const event={chainId:31337,contractAddress:"0x"+"1".repeat(40),transactionHash:"0x"+"b".repeat(64),blockNumber:22,eventName:"Swap",payload:{amountIn:"100",amountOut:"95"}};
 it("accepts an event",async()=>{const r=await request(app).post("/events").send(event);expect(r.status).toBe(201);});
 it("deduplicates the same chain event",async()=>{const r=await request(app).post("/events").send(event);expect(r.body.duplicate).toBe(true);});
 it("filters by chain id",async()=>{const r=await request(app).get("/events?chainId=31337");expect(r.body).toHaveLength(1);});
 it("rejects invalid event hashes",async()=>{const r=await request(app).post("/events").send({...event,transactionHash:"bad"});expect(r.status).toBe(400);});
});
