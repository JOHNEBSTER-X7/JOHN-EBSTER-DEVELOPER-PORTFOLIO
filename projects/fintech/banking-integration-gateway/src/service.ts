import {createHash,randomUUID} from "node:crypto";
export const domains=["payments","treasury","fraud","aml","reconciliation","operations"] as const;
export type Domain=typeof domains[number];
export type DeliveryStatus="delivered"|"failed"|"dead_letter";
export type IntegrationEvent={eventId:string;eventType:string;schemaVersion:"1.0";source:Domain;occurredAt:string;correlationId:string;subjectId:string;payload:Record<string,unknown>};
export type Delivery={id:string;eventId:string;consumer:string;status:DeliveryStatus;attempts:number;lastAttemptAt:string;error?:string};
export class IntegrationGatewayService{
 events:IntegrationEvent[]=[];
 deliveries:Delivery[]=[];
 audit:{id:string;at:string;actor:string;action:string;entityId:string;detail?:string}[]=[];
 readonly consumers:Record<Domain,string[]>={payments:["operations-command-centre","treasury-read-model","fraud-monitoring"],treasury:["operations-command-centre","payments-read-model"],fraud:["operations-command-centre","compliance-workbench"],aml:["operations-command-centre","compliance-workbench"],reconciliation:["operations-command-centre","treasury-read-model"],operations:["operations-command-centre"]};
 private eventIds=new Set<string>();
 private log(actor:string,action:string,id:string,detail?:string){this.audit.unshift({id:randomUUID(),at:new Date().toISOString(),actor,action,entityId:id,detail});}
 publish(input:IntegrationEvent,actor:string){
  if(this.eventIds.has(input.eventId))return {event:this.events.find(e=>e.eventId===input.eventId)!,duplicate:true,deliveries:this.deliveries.filter(d=>d.eventId===input.eventId)};
  this.eventIds.add(input.eventId);this.events.unshift(input);
  const deliveries=this.consumers[input.source].map(consumer=>{const d:Delivery={id:randomUUID(),eventId:input.eventId,consumer,status:"delivered",attempts:1,lastAttemptAt:new Date().toISOString()};this.deliveries.unshift(d);return d;});
  this.log(actor,"event.published",input.eventId,input.eventType);
  for(const d of deliveries)this.log("gateway-router","delivery.simulated",d.id,d.consumer);
  return {event:input,duplicate:false,deliveries};
 }
 retry(deliveryId:string,actor:string){
  const d=this.deliveries.find(x=>x.id===deliveryId);if(!d)throw new Error("Delivery not found");
  if(d.status==="delivered")throw new Error("Successful delivery cannot be retried");
  if(d.status==="dead_letter")throw new Error("Dead-letter delivery requires operator intervention");
  d.attempts++;d.lastAttemptAt=new Date().toISOString();
  if(d.attempts>=3){d.status="dead_letter";d.error="Retry limit reached";}
  else {d.status="delivered";delete d.error;}
  this.log(actor,"delivery.retry",d.id,d.status);return d;
 }
 summary(){return {eventsAccepted:this.events.length,deliveries:this.deliveries.length,delivered:this.deliveries.filter(d=>d.status==="delivered").length,failed:this.deliveries.filter(d=>d.status==="failed").length,deadLetter:this.deliveries.filter(d=>d.status==="dead_letter").length,domains:domains.map(domain=>({domain,consumers:this.consumers[domain],adapterMode:"simulated"}))};}
 getEvent(id:string){const e=this.events.find(x=>x.eventId===id);if(!e)throw new Error("Event not found");return e;}
}
export function stablePayloadHash(payload:Record<string,unknown>){return createHash("sha256").update(JSON.stringify(payload,Object.keys(payload).sort())).digest("hex");}
