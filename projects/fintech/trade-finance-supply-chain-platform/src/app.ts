import express from "express";
import {z} from "zod";
import {TradeFinance} from "./trade-finance";
const partyRole=z.enum(["importer","exporter","lender","logistics_provider"]);
const financeType=z.enum(["letter_of_credit","invoice_finance","purchase_order_finance"]);
const currency=z.enum(["GBP","USD","EUR"]);
const documentType=z.enum(["commercial_invoice","purchase_order","bill_of_lading","packing_list","insurance_certificate","letter_of_credit"]);
const message=(e:unknown)=>(e as Error).message;
export function createApp(service=new TradeFinance()){
 const app=express();app.use(express.json({limit:"64kb"}));
 app.get("/health",(_q,r)=>r.json({status:"ok",service:"northstar-trade-finance-platform"}));
 app.get("/dashboard",(_q,r)=>r.json(service.dashboard()));
 app.get("/parties",(_q,r)=>r.json(service.listParties()));
 app.post("/parties",(q,r)=>{const s=z.object({name:z.string().min(2),role:partyRole,country:z.string().min(2)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid party",details:s.error.flatten()});return r.status(201).json({party:service.onboard(s.data)});});
 app.post("/parties/:id/verification",(q,r)=>{const s=z.object({reviewer:z.string().min(1),decision:z.enum(["verify","reject"])}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid review"});try{return r.json({party:service.verifyParty(q.params.id,s.data.reviewer,s.data.decision)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.get("/lenders",(_q,r)=>r.json(service.listLenders()));
 app.get("/applications",(_q,r)=>r.json(service.listApplications()));
 app.post("/applications",(q,r)=>{const s=z.object({type:financeType,applicantId:z.string().min(1),counterpartyId:z.string().min(1),currency,amountMinor:z.number().int().positive(),description:z.string().min(5)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid application",details:s.error.flatten()});try{return r.status(201).json({application:service.createApplication(s.data)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.get("/applications/:id",(q,r)=>{const a=service.getApplication(q.params.id);return a?r.json(a):r.status(404).json({error:"Application not found"});});
 app.post("/applications/:id/documents",(q,r)=>{const s=z.object({type:documentType,reference:z.string().min(1),actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid document"});try{return r.status(201).json({application:service.addDocument(q.params.id,s.data,s.data.actor)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.post("/applications/:id/documents/:documentId/verification",(q,r)=>{const s=z.object({reviewer:z.string().min(1),decision:z.enum(["verify","reject"])}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid document review"});try{return r.json({application:service.verifyDocument(q.params.id,q.params.documentId,s.data.reviewer,s.data.decision)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.post("/applications/:id/submit",(q,r)=>{const s=z.object({actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Actor required"});try{return r.json({application:service.submit(q.params.id,s.data.actor)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.post("/applications/:id/decision",(q,r)=>{const s=z.object({reviewer:z.string().min(1),decision:z.enum(["approve","reject"]),lenderId:z.string().optional()}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid credit decision"});try{return r.json({application:service.decide(q.params.id,s.data.reviewer,s.data.decision,s.data.lenderId)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.post("/applications/:id/fund",(q,r)=>{const s=z.object({operator:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Operator required"});try{return r.json({application:service.fund(q.params.id,s.data.operator)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.post("/applications/:id/settle",(q,r)=>{const s=z.object({operator:z.string().min(1),settlementReference:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid settlement"});try{return r.json({application:service.settle(q.params.id,s.data.operator,s.data.settlementReference)});}catch(e){return r.status(422).json({error:message(e)});}});
 app.get("/audit",(q,r)=>r.json(service.listAudit(typeof q.query.entityId==="string"?q.query.entityId:undefined)));
 return app;
}
