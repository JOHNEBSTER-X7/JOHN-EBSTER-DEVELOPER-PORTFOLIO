import {randomUUID} from "node:crypto";
import type {Deployment,Environment,Event,Service} from "./types";
const services=new Map<string,Service>([
 ["api-gateway",{id:"api-gateway",name:"API Gateway",description:"Public application API entry point",owner:"Platform team",health:"healthy",version:"1.4.2"}],
 ["research-api",{id:"research-api",name:"Research Intelligence API",description:"Research and evidence retrieval service",owner:"AI engineering",health:"healthy",version:"0.8.0"}],
 ["crm-web",{id:"crm-web",name:"Business Operations Web",description:"CRM and workflow dashboard",owner:"Product engineering",health:"degraded",version:"1.2.1"}]
]);
const deployments=new Map<string,Deployment>(),events:Event[]=[];
export function reset(){deployments.clear();events.splice(0);}
function log(type:string,message:string){events.unshift({id:randomUUID(),type,message,createdAt:new Date().toISOString()});}
export function getServices(){return [...services.values()];}
export function getService(id:string){return services.get(id);}
export function getDeployments(){return [...deployments.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function getDeployment(id:string){return deployments.get(id);}
export function getEvents(){return events.slice(0,40);}
export function createDeployment(data:{serviceId:string;environment:Environment;version:string;requestedBy:string}){
 if(!services.has(data.serviceId))throw new Error("SERVICE_NOT_FOUND");
 const now=new Date().toISOString(),item:Deployment={id:randomUUID(),...data,status:"pending_approval",checks:[],createdAt:now,updatedAt:now};
 deployments.set(item.id,item);log("deployment.requested","Deployment requested: "+item.serviceId+" "+item.version+" to "+item.environment);return item;
}
export function updateDeployment(id:string,decision:"approved"|"rejected",note=""){
 const item=deployments.get(id);if(!item)return undefined;if(item.status!=="pending_approval")throw new Error("INVALID_TRANSITION");
 item.status=decision;item.note=note;item.updatedAt=new Date().toISOString();deployments.set(id,item);log("deployment."+decision,"Deployment "+decision+": "+item.id);return item;
}
export function markDeployed(id:string,checks:string[]){
 const item=deployments.get(id);if(!item)return undefined;if(item.status!=="approved")throw new Error("APPROVAL_REQUIRED");
 item.status="deployed";item.checks=checks;item.updatedAt=new Date().toISOString();deployments.set(id,item);
 const service=services.get(item.serviceId)!;service.version=item.version;service.health="healthy";services.set(service.id,service);
 log("deployment.deployed","Simulated deployment completed for "+service.name+" ("+item.environment+")");return item;
}
export function dashboard(){const all=getDeployments();return {services:services.size,healthy:[...services.values()].filter(s=>s.health==="healthy").length,degraded:[...services.values()].filter(s=>s.health==="degraded").length,pending:all.filter(d=>d.status==="pending_approval").length,deployed:all.filter(d=>d.status==="deployed").length,events:events.length};}
