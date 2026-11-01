import express from "express";
import {timingSafeEqual} from "node:crypto";
import {z} from "zod";
import {domains,IntegrationGatewayService} from "./service";
export const app=express();export const service=new IntegrationGatewayService();
app.use(express.json({limit:"256kb"}));
const safeEqual=(a:string,b:string)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);};
function requireDomainKey(req:express.Request,res:express.Response,next:express.NextFunction){
 const auth=req.header("authorization")??"";const match=auth.match(/^Bearer ([a-z]+):(.+)$/);
 if(!match){res.status(401).json({error:"Bearer domain credential required"});return;}
 const [,domain,key]=match;
 if(!domains.includes(domain as typeof domains[number])){res.status(403).json({error:"Unknown source domain"});return;}
 const configured=(process.env.INTEGRATION_API_KEYS??"").split(",").map(x=>x.trim()).filter(Boolean).map(x=>x.split(":"));
 const allowed=configured.some(([d,k])=>d===domain&&!!k&&safeEqual(k,key));
 if(!allowed){res.status(401).json({error:"Invalid integration credential"});return;}
 res.locals.actor=domain;next();
}
const wrap=(fn:(req:express.Request,res:express.Response)=>unknown)=>(req:express.Request,res:express.Response)=>{try{fn(req,res);}catch(e){res.status(400).json({error:e instanceof Error?e.message:"Request failed"});}};
const eventSchema=z.object({eventId:z.string().min(8).max(128),eventType:z.string().regex(/^[a-z]+\.[a-z0-9_.-]+$/),schemaVersion:z.literal("1.0"),source:z.enum(domains),occurredAt:z.string().datetime(),correlationId:z.string().min(3).max(128),subjectId:z.string().min(1).max(128),payload:z.record(z.unknown())}).strict();
app.get("/api/health",(_req,res)=>res.json({status:"ok",service:"northstar-banking-integration-gateway",mode:"simulated-adapters"}));
app.get("/api/summary",(_req,res)=>res.json(service.summary()));
app.get("/api/events",(_req,res)=>res.json(service.events));
app.get("/api/events/:id",wrap((req,res)=>res.json(service.getEvent(String(req.params.id)))));
app.get("/api/deliveries",(_req,res)=>res.json(service.deliveries));
app.get("/api/dead-letter",(_req,res)=>res.json(service.deliveries.filter(d=>d.status==="dead_letter")));
app.get("/api/audit",(_req,res)=>res.json(service.audit));
app.post("/api/events",requireDomainKey,wrap((req,res)=>{const input=eventSchema.parse(req.body);if(input.source!==res.locals.actor)throw new Error("Credential domain does not match event source");if(!input.eventType.startsWith(input.source+"."))throw new Error("Event type must be namespaced to its source domain");const result=service.publish(input,String(res.locals.actor));res.status(result.duplicate?200:202).json(result);}));
app.post("/api/deliveries/:id/retry",requireDomainKey,wrap((req,res)=>{const body=z.object({operator:z.string().min(2).max(80)}).parse(req.body);res.json(service.retry(String(req.params.id),body.operator));}));
