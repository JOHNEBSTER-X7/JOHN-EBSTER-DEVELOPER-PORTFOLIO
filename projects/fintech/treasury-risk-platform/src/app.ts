import express from "express";
import {z} from "zod";
import {Treasury} from "./treasury";
const currency=z.enum(["GBP","USD","EUR","JPY"]);
export function createApp(treasury=new Treasury()){
 const app=express();app.use(express.json({limit:"32kb"}));
 app.get("/health",(_req,res)=>res.json({status:"ok",service:"northstar-treasury-risk-platform"}));
 app.get("/dashboard",(_req,res)=>res.json(treasury.dashboard()));
 app.get("/positions",(req,res)=>res.json(treasury.getPositions(typeof req.query.accountId==="string"?req.query.accountId:"treasury-demo")));
 app.get("/forecast",(req,res)=>res.json(treasury.forecast(typeof req.query.accountId==="string"?req.query.accountId:"treasury-demo")));
 app.post("/forecast/flows",(req,res)=>{const schema=z.object({date:z.string(),currency,amountMinor:z.number().int().positive(),kind:z.enum(["inflow","outflow"]),description:z.string().min(1)});const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Invalid flow",details:p.error.flatten()});try{return res.status(201).json({flow:treasury.addFlow(p.data)});}catch(e){return res.status(422).json({error:(e as Error).message});}});
 app.get("/fx/exposure",(_req,res)=>res.json(treasury.fxExposure()));
 app.post("/risk/stress-test",(req,res)=>{const schema=z.object({shocks:z.record(z.string(),z.number())});const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Invalid shocks"});try{return res.json(treasury.stressTest(p.data.shocks as Record<string,number>));}catch(e){return res.status(422).json({error:(e as Error).message});}});
 app.get("/counterparties",(_req,res)=>res.json(treasury.listCounterparties()));
 app.get("/transactions",(_req,res)=>res.json(treasury.listTransactions()));
 app.post("/transactions",(req,res)=>{const schema=z.object({accountId:z.string().min(1),currency,amountMinor:z.number().int().positive(),direction:z.enum(["inflow","outflow"]),description:z.string().min(1)});const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Invalid transaction",details:p.error.flatten()});try{return res.status(201).json({transaction:treasury.propose(p.data)});}catch(e){return res.status(422).json({error:(e as Error).message});}});
 app.post("/transactions/:id/decision",(req,res)=>{const schema=z.object({reviewerId:z.string().min(1),decision:z.enum(["approve","reject"])});const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Invalid decision"});try{return res.json({transaction:treasury.decide(req.params.id,p.data.reviewerId,p.data.decision)});}catch(e){return res.status(422).json({error:(e as Error).message});}});
 app.post("/transactions/:id/complete",(req,res)=>{try{return res.json({transaction:treasury.complete(req.params.id)});}catch(e){return res.status(422).json({error:(e as Error).message});}});
 return app;
}
