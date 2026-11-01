import express from "express";
import { z } from "zod";
import { randomUUID } from "node:crypto";
const schema=z.object({
 chainId:z.number().int().positive(),
 contractAddress:z.string().regex(/^0x[a-fA-F0-9]{40}$/),
 transactionHash:z.string().regex(/^0x[a-fA-F0-9]{64}$/),
 blockNumber:z.number().int().nonnegative(),
 eventName:z.enum(["Swap","LiquidityAdded","LiquidityRemoved","Borrowed","Repaid","Liquidated"]),
 payload:z.record(z.string(),z.unknown())
});
export function createIndexerApp(){
 const app=express(); const records=new Map<string,Record<string,unknown>>();
 app.use(express.json({limit:"64kb"}));
 app.get("/health",(_req,res)=>res.json({status:"ok",service:"northstar-defi-indexer"}));
 app.post("/events",(req,res)=>{
  const parsed=schema.safeParse(req.body);
  if(!parsed.success)return res.status(400).json({error:"Invalid event",details:parsed.error.flatten()});
  const key=parsed.data.transactionHash.toLowerCase()+":"+parsed.data.eventName+":"+parsed.data.blockNumber;
  const existing=records.get(key);
  if(existing)return res.status(200).json({event:existing,duplicate:true});
  const event={id:randomUUID(),...parsed.data,indexedAt:new Date().toISOString()};
  records.set(key,event);return res.status(201).json({event,duplicate:false});
 });
 app.get("/events",(req,res)=>{
  const chainId=req.query.chainId?Number(req.query.chainId):undefined;
  return res.json([...records.values()].filter(e=>chainId===undefined||e.chainId===chainId).sort((a,b)=>Number(a.blockNumber)-Number(b.blockNumber)));
 });
 return app;
}
