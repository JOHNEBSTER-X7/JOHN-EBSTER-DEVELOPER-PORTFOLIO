import { randomUUID } from "node:crypto";

export type TxnInput={reference:string;customerId:string;accountId:string;amountMinor:number;currency:"GBP"|"USD"|"EUR";direction:"debit"|"credit";counterpartyId:string;counterpartyName:string;country:string;channel:"mobile"|"web"|"branch"|"api"|"card";deviceId?:string;ipCountry?:string;occurredAt:string;memo?:string};
export type Signal={code:string;label:string;points:number;explanation:string};
export type Transaction=TxnInput & {id:string;riskScore:number;riskBand:"low"|"medium"|"high"|"critical";signals:Signal[];monitoringStatus:"clear"|"alerted"|"under_review"|"closed"};
export type CaseRecord={id:string;transactionId:string;customerId:string;priority:"medium"|"high"|"critical";status:"open"|"investigating"|"escalated"|"closed";assignedTo?:string;disposition?:string;notes:{at:string;actor:string;text:string}[];createdAt:string;updatedAt:string};
const highRiskCountries=["IR","KP","SY"];
const scoreBand=(n:number):Transaction["riskBand"]=>n>=80?"critical":n>=60?"high":n>=35?"medium":"low";
export class FraudIntelligenceService {
 transactions:Transaction[]=[];
 cases:CaseRecord[]=[];
 audit:{id:string;at:string;actor:string;action:string;entityId:string;detail?:string}[]=[];
 private record(actor:string,action:string,entityId:string,detail?:string){this.audit.push({id:randomUUID(),at:new Date().toISOString(),actor,action,entityId,detail});}
 ingest(input:TxnInput){
  if(this.transactions.some(t=>t.reference===input.reference))return this.transactions.find(t=>t.reference===input.reference)!;
  if(!input.reference.trim()||!input.customerId.trim()||!Number.isSafeInteger(input.amountMinor)||input.amountMinor<=0)throw new Error("Invalid transaction: reference, customer and positive integer minor-unit amount are required");
  if(Number.isNaN(Date.parse(input.occurredAt)))throw new Error("Invalid transaction timestamp");
  const signals:Signal[]=[];
  const add=(code:string,label:string,points:number,explanation:string)=>signals.push({code,label,points,explanation});
  const occurred=Date.parse(input.occurredAt),hourAgo=occurred-60*60*1000;
  const recent=this.transactions.filter(t=>t.customerId===input.customerId&&Date.parse(t.occurredAt)>=hourAgo&&Date.parse(t.occurredAt)<=occurred);
  if(recent.length>=4)add("VELOCITY_HIGH","High transaction velocity",25,`${recent.length} earlier transactions for this customer in the preceding hour`);
  if(input.amountMinor>=500_000)add("LARGE_VALUE","Large transaction value",18,"Amount exceeds the synthetic GBP/USD/EUR 5,000-equivalent threshold");
  if(highRiskCountries.includes(input.country.toUpperCase()))add("COUNTRY_RISK","High-risk destination indicator",35,"Destination is on the prototype's synthetic country-risk list");
  if(input.ipCountry&&input.ipCountry.toUpperCase()!==input.country.toUpperCase())add("GEO_MISMATCH","Geographic inconsistency",18,"IP country differs from the counterparty country");
  if(input.deviceId&&recent.some(t=>t.deviceId&&t.deviceId!==input.deviceId))add("DEVICE_CHANGE","New device during recent activity",12,"Device differs from recent customer transaction activity");
  const shared=this.transactions.filter(t=>t.counterpartyId===input.counterpartyId&&t.customerId!==input.customerId);
  if(shared.length>=2)add("SHARED_COUNTERPARTY","Shared counterparty network",20,`Counterparty has prior activity from ${new Set(shared.map(t=>t.customerId)).size} other customers`);
  if(input.amountMinor%100_000===0)add("ROUND_AMOUNT","Round-value transfer",5,"Amount is an exact multiple of 1,000 major currency units");
  if(input.direction==="debit"&&recent.filter(t=>t.direction==="debit").length>=3)add("DEBIT_BURST","Repeated outgoing payments",15,"Three or more earlier outgoing payments occurred within one hour");
  const riskScore=Math.min(100,signals.reduce((sum,s)=>sum+s.points,0)),riskBand=scoreBand(riskScore);
  const tx:Transaction={...input,id:randomUUID(),riskScore,riskBand,signals,monitoringStatus:riskScore>=35?"alerted":"clear"};
  this.transactions.push(tx);this.record("transaction-monitor","transaction.scored",tx.id,`score=${riskScore};band=${riskBand}`);
  if(riskScore>=35){const priority=riskBand==="critical"?"critical":riskBand==="high"?"high":"medium";const c:CaseRecord={id:randomUUID(),transactionId:tx.id,customerId:tx.customerId,priority,status:"open",notes:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};this.cases.push(c);this.record("case-manager","case.created",c.id,priority);}
  return tx;
 }
 getTransaction(id:string){const x=this.transactions.find(t=>t.id===id);if(!x)throw new Error("Transaction not found");return x;}
 getCase(id:string){const x=this.cases.find(c=>c.id===id);if(!x)throw new Error("Case not found");return x;}
 assignCase(id:string,analyst:string){const c=this.getCase(id);if(c.status==="closed")throw new Error("Closed case cannot be assigned");if(!analyst.trim())throw new Error("Analyst is required");c.assignedTo=analyst;c.status="investigating";c.updatedAt=new Date().toISOString();this.record(analyst,"case.assigned",id);return c;}
 addNote(id:string,actor:string,note:string){const c=this.getCase(id);if(c.status==="closed")throw new Error("Cannot add notes to a closed case");if(!actor.trim()||note.trim().length<3)throw new Error("Actor and a meaningful note are required");c.notes.push({at:new Date().toISOString(),actor,text:note});c.updatedAt=new Date().toISOString();this.record(actor,"case.note.added",id);return c;}
 escalateCase(id:string,actor:string,reason:string){const c=this.getCase(id);if(c.status==="closed")throw new Error("Closed case cannot be escalated");if(!reason.trim())throw new Error("Escalation reason is required");c.status="escalated";c.updatedAt=new Date().toISOString();c.notes.push({at:c.updatedAt,actor,text:`Escalated: ${reason}`});this.record(actor,"case.escalated",id,reason);return c;}
 closeCase(id:string,actor:string,disposition:"fraud_confirmed"|"suspicious_unconfirmed"|"false_positive"|"no_action",rationale:string){const c=this.getCase(id);if(c.status==="closed")throw new Error("Case is already closed");if(!rationale.trim())throw new Error("Closure rationale is required");c.status="closed";c.disposition=disposition;c.updatedAt=new Date().toISOString();c.notes.push({at:c.updatedAt,actor,text:`Closed as ${disposition}: ${rationale}`});const t=this.getTransaction(c.transactionId);t.monitoringStatus="closed";this.record(actor,"case.closed",id,disposition);return c;}
 dashboard(){const count=(band:string)=>this.transactions.filter(t=>t.riskBand===band).length;return {transactionCount:this.transactions.length,caseCount:this.cases.length,openCases:this.cases.filter(c=>c.status!=="closed").length,byRiskBand:{low:count("low"),medium:count("medium"),high:count("high"),critical:count("critical")},byCaseStatus:this.cases.reduce((o,c)=>({...o,[c.status]:(o[c.status]??0)+1}),{} as Record<string,number>),alertRate:this.transactions.length?Number((this.transactions.filter(t=>t.riskScore>=35).length/this.transactions.length).toFixed(4)):0,topSignalCodes:Object.entries(this.transactions.flatMap(t=>t.signals.map(s=>s.code)).reduce((o,k)=>({...o,[k]:(o[k]??0)+1}),{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([code,count])=>({code,count}))};}
 network(){const groups=new Map<string,Set<string>>();for(const t of this.transactions){if(!groups.has(t.counterpartyId))groups.set(t.counterpartyId,new Set());groups.get(t.counterpartyId)!.add(t.customerId);}return [...groups.entries()].filter(([,customers])=>customers.size>1).map(([counterpartyId,customers])=>({counterpartyId,customerCount:customers.size,customerIds:[...customers]})).sort((a,b)=>b.customerCount-a.customerCount);}
}
