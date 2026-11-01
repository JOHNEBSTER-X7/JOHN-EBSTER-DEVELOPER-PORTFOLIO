import {randomUUID} from "node:crypto";
export type Severity="low"|"medium"|"high"|"critical";
export type AlertStatus="new"|"acknowledged"|"investigating"|"escalated"|"resolved";
export type Alert={id:string;source:"fraud"|"aml"|"payments"|"reconciliation"|"treasury";reference:string;title:string;description:string;severity:Severity;status:AlertStatus;createdAt:string;owner?:string};
export type WorkItem={id:string;domain:"payments"|"treasury"|"compliance"|"reconciliation"|"operations";title:string;description:string;priority:Severity;status:"open"|"in_progress"|"blocked"|"completed";owner?:string;createdAt:string};
export class CommandCentreService{
 readonly generatedAt=new Date().toISOString();
 payments=[
  {id:"pay-1001",reference:"NS-2026-1001",counterparty:"Harbour Components Ltd",amountMinor:1250000,currency:"GBP",status:"settled",rail:"Faster Payments",createdAt:"2026-11-01T08:30:00.000Z"},
  {id:"pay-1002",reference:"NS-2026-1002",counterparty:"Atlantic Supply Inc",amountMinor:8200000,currency:"USD",status:"in_transit",rail:"SWIFT simulation",createdAt:"2026-11-01T09:10:00.000Z"},
  {id:"pay-1003",reference:"NS-2026-1003",counterparty:"Euro Parts GmbH",amountMinor:3750000,currency:"EUR",status:"screening_pending",rail:"ISO 20022 simulation",createdAt:"2026-11-01T09:35:00.000Z"},
  {id:"pay-1004",reference:"NS-2026-1004",counterparty:"Northstar Retail Ltd",amountMinor:92500,currency:"GBP",status:"returned",rail:"Internal",createdAt:"2026-11-01T10:05:00.000Z"},
  {id:"pay-1005",reference:"NS-2026-1005",counterparty:"Pacific Machinery Co",amountMinor:15300000,currency:"USD",status:"queued",rail:"SWIFT simulation",createdAt:"2026-11-01T10:20:00.000Z"}
 ];
 liquidity=[
  {account:"UK Operating",currency:"GBP",balanceMinor:85000000,reservedMinor:12000000,thresholdMinor:20000000},
  {account:"US Settlement",currency:"USD",balanceMinor:124000000,reservedMinor:45000000,thresholdMinor:30000000},
  {account:"EU Treasury",currency:"EUR",balanceMinor:48000000,reservedMinor:9000000,thresholdMinor:15000000},
  {account:"Correspondent USD",currency:"USD",balanceMinor:21000000,reservedMinor:18000000,thresholdMinor:10000000}
 ];
 alerts:Alert[]=[
  {id:"al-001",source:"fraud",reference:"TX-88310",title:"Unusual payment velocity",description:"Multiple outgoing payments detected in a short interval.",severity:"high",status:"new",createdAt:"2026-11-01T10:12:00.000Z"},
  {id:"al-002",source:"aml",reference:"TX-88302",title:"Cross-border monitoring indicator",description:"Synthetic country-risk and counterparty pattern requires analyst review.",severity:"critical",status:"investigating",owner:"compliance-analyst",createdAt:"2026-11-01T09:55:00.000Z"},
  {id:"al-003",source:"reconciliation",reference:"REC-2026-044",title:"Unmatched settlement statement line",description:"Statement entry has no matching internal settlement reference.",severity:"medium",status:"new",createdAt:"2026-11-01T09:40:00.000Z"},
  {id:"al-004",source:"treasury",reference:"LIQ-USD-004",title:"Correspondent liquidity below buffer",description:"Available balance is below the configured operating threshold.",severity:"high",status:"acknowledged",owner:"treasury-operator",createdAt:"2026-11-01T09:20:00.000Z"},
  {id:"al-005",source:"payments",reference:"NS-2026-1004",title:"Payment return requires review",description:"Returned payment requires operational follow-up.",severity:"low",status:"resolved",createdAt:"2026-11-01T08:55:00.000Z"}
 ];
 workItems:WorkItem[]=[
  {id:"wi-001",domain:"payments",title:"Review queued international payment",description:"Confirm payment approval and route readiness.",priority:"high",status:"open",createdAt:"2026-11-01T10:20:00.000Z"},
  {id:"wi-002",domain:"compliance",title:"Complete enhanced alert review",description:"Document rationale and evidence for the high-priority monitoring alert.",priority:"critical",status:"in_progress",owner:"compliance-analyst",createdAt:"2026-11-01T09:55:00.000Z"},
  {id:"wi-003",domain:"treasury",title:"Restore USD correspondent buffer",description:"Review funding options for the correspondent settlement account.",priority:"high",status:"open",createdAt:"2026-11-01T09:20:00.000Z"},
  {id:"wi-004",domain:"reconciliation",title:"Investigate unmatched statement line",description:"Compare external statement reference with internal payment records.",priority:"medium",status:"blocked",createdAt:"2026-11-01T09:40:00.000Z"}
 ];
 audit:{id:string;at:string;actor:string;action:string;entityId:string;detail?:string}[]=[];
 private log(actor:string,action:string,id:string,detail?:string){this.audit.unshift({id:randomUUID(),at:new Date().toISOString(),actor,action,entityId:id,detail});}
 dashboard(){
  const count=(xs:any[],field:string,value:string)=>xs.filter(x=>x[field]===value).length;
  const totalMinor=(currency:string)=>this.payments.filter(p=>p.currency===currency&&p.status!=="returned").reduce((n,p)=>n+p.amountMinor,0);
  const available=this.liquidity.map(a=>({...a,availableMinor:a.balanceMinor-a.reservedMinor,belowBuffer:a.balanceMinor-a.reservedMinor<a.thresholdMinor}));
  return {generatedAt:new Date().toISOString(),kpis:{paymentsToday:this.payments.length,paymentsInFlight:count(this.payments,"status","in_transit")+count(this.payments,"status","queued")+count(this.payments,"status","screening_pending"),openAlerts:this.alerts.filter(a=>!["resolved"].includes(a.status)).length,criticalAlerts:count(this.alerts.filter(a=>a.status!=="resolved"),"severity","critical"),openWorkItems:this.workItems.filter(w=>w.status!=="completed").length,liquidityAccountsBelowBuffer:available.filter(a=>a.belowBuffer).length},paymentStatus:{settled:count(this.payments,"status","settled"),inTransit:count(this.payments,"status","in_transit"),queued:count(this.payments,"status","queued"),screening:count(this.payments,"status","screening_pending"),returned:count(this.payments,"status","returned")},paymentVolumeMinor:{GBP:totalMinor("GBP"),USD:totalMinor("USD"),EUR:totalMinor("EUR")},alertsBySeverity:{critical:count(this.alerts.filter(a=>a.status!=="resolved"),"severity","critical"),high:count(this.alerts.filter(a=>a.status!=="resolved"),"severity","high"),medium:count(this.alerts.filter(a=>a.status!=="resolved"),"severity","medium"),low:count(this.alerts.filter(a=>a.status!=="resolved"),"severity","low")},liquidity:available};
 }
 getAlert(id:string){const a=this.alerts.find(x=>x.id===id);if(!a)throw new Error("Alert not found");return a;}
 updateAlert(id:string,action:"acknowledge"|"investigate"|"escalate"|"resolve",actor:string,note?:string){
  const a=this.getAlert(id);if(a.status==="resolved")throw new Error("Resolved alert cannot be changed");if(!actor.trim())throw new Error("Actor is required");
  const next:Record<string,AlertStatus>={acknowledge:"acknowledged",investigate:"investigating",escalate:"escalated",resolve:"resolved"};a.status=next[action];a.owner=actor;this.log(actor,"alert."+action,id,note);return a;
 }
 updateWorkItem(id:string,status:"in_progress"|"blocked"|"completed",actor:string,note?:string){
  const w=this.workItems.find(x=>x.id===id);if(!w)throw new Error("Work item not found");if(!actor.trim())throw new Error("Actor is required");w.status=status;w.owner=actor;this.log(actor,"work-item."+status,id,note);return w;
 }
 activity(){return [...this.audit,...this.alerts.map(a=>({id:a.id,at:a.createdAt,actor:"monitoring-engine",action:"alert.created",entityId:a.id,detail:a.title})),...this.payments.map(p=>({id:p.id,at:p.createdAt,actor:"payments-simulator",action:"payment."+p.status,entityId:p.id,detail:p.reference}))].sort((a,b)=>Date.parse(b.at)-Date.parse(a.at)).slice(0,30);}
}
