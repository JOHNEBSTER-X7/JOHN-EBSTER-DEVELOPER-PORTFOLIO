import express from "express";
import {z} from "zod";
import {FinancialCrime} from "./compliance";
const error=(e:unknown)=>(e as Error).message;
const currency=z.enum(["GBP","USD","EUR"]);
export function createApp(service=new FinancialCrime()){
 const app=express();app.use(express.json({limit:"64kb"}));
 app.get("/health",(_q,r)=>r.json({status:"ok",service:"northstar-financial-crime-aml-platform"}));
 app.get("/dashboard",(_q,r)=>r.json(service.dashboard()));
 app.get("/customers",(_q,r)=>r.json(service.listCustomers()));
 app.post("/customers",(q,r)=>{const s=z.object({name:z.string().min(2),kind:z.enum(["individual","business"]),country:z.string().length(2),occupationOrIndustry:z.string().min(2),actor:z.string().optional()}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid customer",details:s.error.flatten()});try{return r.status(201).json({customer:service.onboard(s.data,s.data.actor)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/customers/:id/verification",(q,r)=>{const s=z.object({reviewer:z.string().min(1),decision:z.enum(["verify","reject"])}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid KYC decision"});try{return r.json({customer:service.verifyCustomer(q.params.id,s.data.reviewer,s.data.decision)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/customers/:id/screening",(q,r)=>{const s=z.object({actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Actor required"});try{return r.json({results:service.screenCustomer(q.params.id,s.data.actor)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/screening/:id/review",(q,r)=>{const s=z.object({reviewer:z.string().min(1),decision:z.enum(["clear","confirm_match"])}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid screening review"});try{return r.json({result:service.reviewScreening(q.params.id,s.data.reviewer,s.data.decision)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/transactions/monitor",(q,r)=>{const s=z.object({customerId:z.string().min(1),amountMinor:z.number().int().positive(),currency,direction:z.enum(["inbound","outbound"]),counterparty:z.string().min(1),country:z.string().length(2),reference:z.string().min(1),occurredAt:z.string().optional()}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid transaction",details:s.error.flatten()});try{return r.status(201).json(service.monitorTransaction(s.data));}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/transactions",(_q,r)=>r.json(service.listTransactions()));
 app.get("/alerts",(_q,r)=>r.json(service.listAlerts()));
 app.post("/alerts/:id/cases",(q,r)=>{const s=z.object({actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Actor required"});try{return r.status(201).json({case:service.createCase(q.params.id,s.data.actor)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/cases",(_q,r)=>r.json(service.listCases()));
 app.post("/cases/:id/assign",(q,r)=>{const s=z.object({analyst:z.string().min(1),actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid assignment"});try{return r.json({case:service.assignCase(q.params.id,s.data.analyst,s.data.actor)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/cases/:id/notes",(q,r)=>{const s=z.object({note:z.string().min(1),actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid note"});try{return r.json({case:service.addCaseNote(q.params.id,s.data.note,s.data.actor)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/cases/:id/close",(q,r)=>{const s=z.object({actor:z.string().min(1),disposition:z.enum(["no_issue","false_positive","suspicious_activity","sanctions_match"])}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid disposition"});try{return r.json({case:service.closeCase(q.params.id,s.data.actor,s.data.disposition)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/cases/:id/report-drafts",(q,r)=>{const s=z.object({actor:z.string().min(1),summary:z.string().min(10)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid report summary"});try{return r.status(201).json({report:service.createReportDraft(q.params.id,s.data.actor,s.data.summary)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/reports",(_q,r)=>r.json(service.listReports()));
 app.post("/reports/:id/review",(q,r)=>{const s=z.object({reviewer:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Reviewer required"});try{return r.json({report:service.reviewReport(q.params.id,s.data.reviewer)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/audit",(_q,r)=>r.json(service.listAudit()));
 return app;
}
