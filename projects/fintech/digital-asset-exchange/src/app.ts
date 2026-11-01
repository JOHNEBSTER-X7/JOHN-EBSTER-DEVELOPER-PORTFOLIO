import express from "express";
import {z} from "zod";
import {Exchange} from "./exchange";
export function createApp(exchange=new Exchange()){
 const app=express();app.use(express.json({limit:"32kb"}));
 app.get("/health",(_req,res)=>res.json({status:"ok",service:"northstar-digital-asset-exchange"}));
 app.get("/markets",(req,res)=>res.json([{symbol:"NSTAR-USD",baseAsset:"NSTAR",quoteAsset:"USD",tickSize:0.01,lotSize:0.0001}]));
 app.post("/accounts/:accountId/fund",(req,res)=>{
  const schema=z.object({base:z.number().nonnegative(),quote:z.number().nonnegative()});const p=schema.safeParse(req.body);
  if(!p.success)return res.status(400).json({error:"Invalid funding",details:p.error.flatten()});
  try{exchange.fund(req.params.accountId,p.data.base,p.data.quote);return res.status(200).json({accountId:req.params.accountId,balance:exchange.balance(req.params.accountId)});}catch(e){return res.status(400).json({error:(e as Error).message});}
 });
 app.get("/accounts/:accountId/balance",(req,res)=>res.json({accountId:req.params.accountId,balance:exchange.balance(req.params.accountId)}));
 app.post("/orders",(req,res)=>{
  const schema=z.object({accountId:z.string().min(1),symbol:z.string().min(1),side:z.enum(["buy","sell"]),type:z.enum(["limit","market"]),quantity:z.number().positive(),price:z.number().positive().optional()});
  const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Invalid order",details:p.error.flatten()});
  try{return res.status(201).json({order:exchange.submit(p.data)});}catch(e){return res.status(422).json({error:(e as Error).message});}
 });
 app.delete("/orders/:id",(req,res)=>{const schema=z.object({accountId:z.string().min(1)});const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"accountId required"});
  try{return res.json({order:exchange.cancel(req.params.id,p.data.accountId)});}catch(e){return res.status(404).json({error:(e as Error).message});}
 });
 app.get("/orders",(req,res)=>res.json(exchange.listOrders(typeof req.query.accountId==="string"?req.query.accountId:undefined)));
 app.get("/order-book/:symbol",(req,res)=>{try{return res.json(exchange.book(req.params.symbol));}catch(e){return res.status(404).json({error:(e as Error).message});}});
 app.get("/trades",(req,res)=>res.json(exchange.listTrades(typeof req.query.symbol==="string"?req.query.symbol:undefined)));
 return app;
}
