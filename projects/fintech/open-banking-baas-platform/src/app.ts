import express from "express";
import {z} from "zod";
import {OpenBanking} from "./banking";
const scope=z.enum(["accounts:read","transactions:read","payments:write"]);
const currency=z.enum(["GBP","USD","EUR"]);
const category=z.enum(["income","housing","utilities","groceries","transport","shopping","financial","other"]);
const error=(e:unknown)=>(e as Error).message;
export function createApp(service=new OpenBanking()){
 const app=express();app.use(express.json({limit:"32kb"}));
 app.get("/health",(_q,r)=>r.json({status:"ok",service:"northstar-open-banking-baas-platform"}));
 app.get("/dashboard",(_q,r)=>r.json(service.dashboard()));
 app.get("/accounts",(q,r)=>{const user=typeof q.query.userId==="string"?q.query.userId:"";if(!user)return r.status(400).json({error:"userId required"});return r.json(service.listAccounts(user));});
 app.post("/consents",(q,r)=>{const s=z.object({clientId:z.string().min(1),userId:z.string().min(1),accountIds:z.array(z.string()).min(1),scopes:z.array(scope).min(1),durationDays:z.number().int().min(1).max(90)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid consent",details:s.error.flatten()});try{return r.status(201).json({consent:service.createConsent(s.data)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/consents/:id",(q,r)=>{const c=service.getConsent(q.params.id);return c?r.json(c):r.status(404).json({error:"Consent not found"});});
 app.post("/consents/:id/revoke",(q,r)=>{const s=z.object({actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Actor required"});try{return r.json({consent:service.revokeConsent(q.params.id,s.data.actor)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/aggregated/accounts",(q,r)=>{const consent=String(q.header("x-consent-id")??""),client=String(q.header("x-client-id")??"");try{return r.json(service.listAggregatedAccounts(consent,client));}catch(e){return r.status(403).json({error:error(e)});}});
 app.get("/aggregated/accounts/:accountId/transactions",(q,r)=>{const consent=String(q.header("x-consent-id")??""),client=String(q.header("x-client-id")??"");try{return r.json(service.listTransactions(consent,client,q.params.accountId));}catch(e){return r.status(403).json({error:error(e)});}});
 app.post("/payments",(q,r)=>{const s=z.object({consentId:z.string().min(1),clientId:z.string().min(1),sourceAccountId:z.string().min(1),beneficiary:z.string().min(1),amountMinor:z.number().int().positive(),currency,reference:z.string().min(1),idempotencyKey:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid payment",details:s.error.flatten()});try{return r.status(202).json({payment:service.initiatePayment(s.data)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/payments",(q,r)=>{const client=String(q.header("x-client-id")??"");if(!client)return r.status(400).json({error:"x-client-id required"});return r.json(service.listPayments().filter(p=>p.clientId===client));});
 app.post("/payments/:id/complete",(q,r)=>{const s=z.object({operator:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Operator required"});try{return r.json({payment:service.completePayment(q.params.id,s.data.operator)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/payments/:id/reject",(q,r)=>{const s=z.object({operator:z.string().min(1),reason:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid rejection"});try{return r.json({payment:service.rejectPayment(q.params.id,s.data.operator,s.data.reason)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/transactions/:id/category",(q,r)=>{const s=z.object({category,actor:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid category"});try{return r.json({transaction:service.recategoriseTransaction(q.params.id,s.data.category,s.data.actor)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/fraud/alerts",(_q,r)=>r.json(service.listAlerts()));
 app.post("/fraud/alerts/:id/review",(q,r)=>{const s=z.object({reviewer:z.string().min(1)}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Reviewer required"});try{return r.json({alert:service.reviewAlert(q.params.id,s.data.reviewer)});}catch(e){return r.status(422).json({error:error(e)});}});
 app.post("/reconciliation",(q,r)=>{const s=z.object({accountId:z.string().min(1),statementReferences:z.array(z.string())}).safeParse(q.body);if(!s.success)return r.status(400).json({error:"Invalid reconciliation request"});try{return r.json(service.reconcile(s.data.accountId,s.data.statementReferences));}catch(e){return r.status(422).json({error:error(e)});}});
 app.get("/audit",(_q,r)=>r.json(service.listAudit()));
 return app;
}
