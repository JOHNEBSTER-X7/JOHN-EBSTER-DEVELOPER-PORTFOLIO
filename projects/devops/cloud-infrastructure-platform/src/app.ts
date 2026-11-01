import express from "express";
import helmet from "helmet";
import {rateLimit} from "express-rate-limit";
import {z} from "zod";
import {getDeployment,getDeployments,getEvents,getService,getServices,createDeployment,updateDeployment,markDeployed,dashboard} from "./store";
import {readinessChecks} from "./deployment";
import type {Environment} from "./types";
export const app=express();app.use(helmet());app.use(express.json({limit:"16kb"}));app.use(express.static("public"));
const limiter=rateLimit({windowMs:60000,limit:25,standardHeaders:"draft-8",legacyHeaders:false});
const schema=z.object({serviceId:z.string().min(2),environment:z.enum(["development","staging","production"]),version:z.string().min(1).max(50),requestedBy:z.string().trim().min(2).max(80)});
app.get("/api/health",(_req,res)=>res.json({status:"ok",service:"northstar-cloud-platform",timestamp:new Date().toISOString()}));
app.get("/api/metrics",(_req,res)=>{const m=dashboard();res.type("text/plain; version=0.0.4; charset=utf-8").send([
 "# HELP northstar_services_total Number of registered services",
 "# TYPE northstar_services_total gauge",
 "northstar_services_total "+m.services,
 "# HELP northstar_services_healthy Number of healthy services",
 "# TYPE northstar_services_healthy gauge",
 "northstar_services_healthy "+m.healthy,
 "# HELP northstar_services_degraded Number of degraded services",
 "# TYPE northstar_services_degraded gauge",
 "northstar_services_degraded "+m.degraded,
 "# HELP northstar_deployments_pending_approval Number of releases awaiting approval",
 "# TYPE northstar_deployments_pending_approval gauge",
 "northstar_deployments_pending_approval "+m.pending,
 "# HELP northstar_deployments_completed_total Number of simulated deployments completed",
 "# TYPE northstar_deployments_completed_total counter",
 "northstar_deployments_completed_total "+m.deployed,
 "# HELP northstar_operational_events_total Number of retained operational events",
 "# TYPE northstar_operational_events_total gauge",
 "northstar_operational_events_total "+m.events
 ].join(String.fromCharCode(10))+String.fromCharCode(10));});
app.get("/api/dashboard",(_req,res)=>res.json({metrics:dashboard(),services:getServices(),recentEvents:getEvents()}));
app.get("/api/services",(_req,res)=>res.json(getServices()));
app.get("/api/deployments",(_req,res)=>res.json(getDeployments()));
app.post("/api/deployments",limiter,(req,res)=>{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid deployment request.",details:parsed.error.flatten()});const service=getService(parsed.data.serviceId);if(!service)return res.status(404).json({error:"Service not found."});const checks=readinessChecks(service,parsed.data.environment as Environment,parsed.data.version);if(checks.length)return res.status(422).json({error:"Deployment readiness checks failed.",checks});return res.status(201).json(createDeployment(parsed.data));});
app.post("/api/deployments/:id/approval",(req,res)=>{const parsed=z.object({decision:z.enum(["approved","rejected"]),note:z.string().max(500).optional()}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Provide approved or rejected decision."});try{const item=updateDeployment(req.params.id,parsed.data.decision,parsed.data.note);return item?res.json(item):res.status(404).json({error:"Deployment request not found."});}catch(e){if(e instanceof Error&&e.message==="INVALID_TRANSITION")return res.status(409).json({error:"Deployment request already decided."});throw e;}});
app.post("/api/deployments/:id/execute",(req,res)=>{const item=getDeployment(req.params.id);if(!item)return res.status(404).json({error:"Deployment request not found."});const service=getService(item.serviceId)!;const checks=readinessChecks(service,item.environment,item.version);if(checks.length)return res.status(422).json({error:"Readiness checks failed.",checks});try{return res.json(markDeployed(item.id,["Version format valid","Service registered","Readiness policy passed","Human approval recorded"]));}catch(e){if(e instanceof Error&&e.message==="APPROVAL_REQUIRED")return res.status(409).json({error:"Human approval is required before execution."});throw e;}});
app.get("/api/deployments/:id",(req,res)=>{const item=getDeployment(req.params.id);return item?res.json(item):res.status(404).json({error:"Deployment request not found."});});
