import express from "express";
import { z } from "zod";
import { randomUUID } from "node:crypto";

export interface IndexedEvent {
  id: string; chainId: number; contractAddress: string; transactionHash: string;
  blockNumber: number; eventName: string; payload: Record<string, unknown>; indexedAt: string;
}
const eventSchema = z.object({
  chainId: z.number().int().positive(),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  blockNumber: z.number().int().nonnegative(),
  eventName: z.enum(["AssetRegistered","InvestorAllowlistUpdated","Issuance","Transfer","DistributionCreated","DistributionClaimed"]),
  payload: z.record(z.string(), z.unknown())
});
export function createIndexerApp() {
  const app = express();
  const events = new Map<string, IndexedEvent>();
  app.use(express.json({limit:"64kb"}));
  app.get("/health",(_req,res)=>res.json({status:"ok",service:"northstar-chain-event-indexer"}));
  app.post("/events",(req,res)=>{
    const parsed=eventSchema.safeParse(req.body);
    if(!parsed.success) return res.status(400).json({error:"Invalid event",details:parsed.error.flatten()});
    const key=parsed.data.transactionHash.toLowerCase()+":"+parsed.data.eventName+":"+parsed.data.blockNumber;
    const prior=events.get(key);
    if(prior) return res.status(200).json({event:prior,duplicate:true});
    const event:IndexedEvent={id:randomUUID(),...parsed.data,indexedAt:new Date().toISOString()};
    events.set(key,event);
    return res.status(201).json({event,duplicate:false});
  });
  app.get("/events",(req,res)=>{
    const chainId=req.query.chainId ? Number(req.query.chainId) : undefined;
    return res.json([...events.values()].filter(e=>chainId===undefined||e.chainId===chainId).sort((a,b)=>a.blockNumber-b.blockNumber));
  });
  return app;
}
