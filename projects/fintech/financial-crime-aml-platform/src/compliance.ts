import {randomUUID} from "node:crypto";

export type CustomerKind="individual"|"business";
export type RiskBand="low"|"medium"|"high";
export type CaseStatus="open"|"investigating"|"escalated"|"closed";
export type Disposition="no_issue"|"false_positive"|"suspicious_activity"|"sanctions_match";
export interface Customer {id:string;name:string;kind:CustomerKind;country:string;occupationOrIndustry:string;status:"pending"|"verified"|"rejected";riskScore:number;riskBand:RiskBand;createdAt:string}
export interface ScreeningResult {id:string;customerId:string;provider:"DEMO_WATCHLIST";matchType:"sanctions"|"pep";matchedName:string;similarity:number;status:"potential_match"|"cleared";reviewedBy?:string;createdAt:string}
export interface MonitoredTransaction {id:string;customerId:string;amountMinor:number;currency:"GBP"|"USD"|"EUR";direction:"inbound"|"outbound";counterparty:string;country:string;reference:string;occurredAt:string;score:number;rules:string[]}
export interface Alert {id:string;transactionId:string;customerId:string;score:number;severity:"low"|"medium"|"high";rules:string[];status:"open"|"case_created"|"dismissed";createdAt:string}
export interface InvestigationCase {id:string;alertId:string;customerId:string;status:CaseStatus;assignedTo?:string;notes:string[];disposition?:Disposition;createdAt:string;updatedAt:string}
export interface ReportDraft {id:string;caseId:string;customerId:string;summary:string;indicators:string[];status:"draft"|"reviewed";createdAt:string}
const watchlist:Array<{name:string;type:"sanctions"|"pep"}>=[
 {name:"Example Restricted Entity",type:"sanctions"},
 {name:"Sample Public Official",type:"pep"},
 {name:"Demonstration Export Holdings",type:"sanctions"}
];
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export class FinancialCrime {
 private customers=new Map<string,Customer>();
 private screenings=new Map<string,ScreeningResult>();
 private transactions=new Map<string,MonitoredTransaction>();
 private alerts=new Map<string,Alert>();
 private cases=new Map<string,InvestigationCase>();
 private reports=new Map<string,ReportDraft>();
 private audit:Array<{id:string;entity:string;entityId:string;action:string;actor:string;at:string;details:Record<string,string|number|boolean>}>= [];
 private event(entity:string,entityId:string,action:string,actor:string,details:Record<string,string|number|boolean>={}){this.audit.push({id:randomUUID(),entity,entityId,action,actor,at:new Date().toISOString(),details});}
 onboard(input:{name:string;kind:CustomerKind;country:string;occupationOrIndustry:string},actor="system"){
  if(!input.name.trim()||!input.country.trim()||!input.occupationOrIndustry.trim())throw new Error("Customer details are required");
  const customer:Customer={...input,id:randomUUID(),status:"pending",riskScore:this.customerRisk(input),riskBand:"low",createdAt:new Date().toISOString()};
  customer.riskBand=customer.riskScore>=65?"high":customer.riskScore>=35?"medium":"low";
  this.customers.set(customer.id,customer);this.event("customer",customer.id,"onboarded",actor,{kind:customer.kind,riskScore:customer.riskScore});return {...customer};
 }
 private customerRisk(input:{kind:CustomerKind;country:string;occupationOrIndustry:string}){
  let score=10;const country=input.country.toUpperCase();if(["IR","KP","SY"].includes(country))score+=55;
  if(/crypto|arms|cash intensive|unregulated/.test(input.occupationOrIndustry.toLowerCase()))score+=25;
  if(input.kind==="business")score+=5;return clamp(score);
 }
 getCustomer(id:string){const c=this.customers.get(id);return c?{...c}:undefined;}
 listCustomers(){return [...this.customers.values()].map(c=>({...c}));}
 verifyCustomer(id:string,reviewer:string,decision:"verify"|"reject"){
  const c=this.customers.get(id);if(!c)throw new Error("Customer not found");if(!reviewer||reviewer===id)throw new Error("Independent KYC reviewer required");if(c.status!=="pending")throw new Error("Customer review already completed");
  if(decision==="verify"&&c.riskBand==="high")throw new Error("High-risk customer requires enhanced due diligence");
  c.status=decision==="verify"?"verified":"rejected";this.event("customer",id,"kyc_"+decision,reviewer);return {...c};
 }
 screenCustomer(id:string,actor:string){
  const c=this.customers.get(id);if(!c)throw new Error("Customer not found");
  const results=watchlist.filter(w=>{const a=c.name.toLowerCase().replace(/[^a-z0-9]/g,""),b=w.name.toLowerCase().replace(/[^a-z0-9]/g,"");return a===b||a.includes(b)||b.includes(a);}).map(w=>{
   const r:ScreeningResult={id:randomUUID(),customerId:id,provider:"DEMO_WATCHLIST",matchType:w.type,matchedName:w.name,similarity:100,status:"potential_match",createdAt:new Date().toISOString()};this.screenings.set(r.id,r);return {...r};
  });
  this.event("customer",id,"screened",actor,{matches:results.length});return results;
 }
 reviewScreening(id:string,reviewer:string,decision:"clear"|"confirm_match"){
  const s=this.screenings.get(id);if(!s)throw new Error("Screening result not found");if(!reviewer||reviewer===s.customerId)throw new Error("Independent screening reviewer required");if(s.status!=="potential_match")throw new Error("Screening result already reviewed");
  if(decision==="clear")s.status="cleared";
  this.event("screening",id,decision==="clear"?"potential_match_cleared":"match_confirmed",reviewer);
  if(decision==="confirm_match"){const c=this.customers.get(s.customerId)!;c.riskScore=100;c.riskBand="high";}
  return {...s};
 }
 monitorTransaction(input:{customerId:string;amountMinor:number;currency:"GBP"|"USD"|"EUR";direction:"inbound"|"outbound";counterparty:string;country:string;reference:string;occurredAt?:string},actor="monitoring-engine"){
  const c=this.customers.get(input.customerId);if(!c)throw new Error("Customer not found");if(c.status!=="verified")throw new Error("Customer must be verified before transaction monitoring");
  if(!Number.isSafeInteger(input.amountMinor)||input.amountMinor<=0||!input.counterparty.trim()||!input.reference.trim())throw new Error("Invalid transaction details");
  const rules:string[]=[];let score=0;
  if(input.amountMinor>=5_000_000){rules.push("HIGH_VALUE");score+=35;}
  if(input.amountMinor>=1_000_000&&input.amountMinor<5_000_000){rules.push("ELEVATED_VALUE");score+=15;}
  if(["IR","KP","SY"].includes(input.country.toUpperCase())){rules.push("HIGH_RISK_JURISDICTION");score+=45;}
  if(input.direction==="outbound"&&input.amountMinor>=2_000_000){rules.push("LARGE_OUTBOUND");score+=15;}
  if(c.riskBand==="high"){rules.push("HIGH_RISK_CUSTOMER");score+=30;}
  const tx:MonitoredTransaction={...input,id:randomUUID(),occurredAt:input.occurredAt??new Date().toISOString(),score:clamp(score),rules};this.transactions.set(tx.id,tx);
  if(score>=30){const alert:Alert={id:randomUUID(),transactionId:tx.id,customerId:c.id,score:tx.score,severity:score>=65?"high":score>=45?"medium":"low",rules:[...rules],status:"open",createdAt:new Date().toISOString()};this.alerts.set(alert.id,alert);this.event("alert",alert.id,"created",actor,{score:alert.score,severity:alert.severity});}
  this.event("transaction",tx.id,"monitored",actor,{score:tx.score,ruleCount:rules.length});return {transaction:{...tx},alert:[...this.alerts.values()].find(a=>a.transactionId===tx.id)?{...([...this.alerts.values()].find(a=>a.transactionId===tx.id)!)}:null};
 }
 listTransactions(){return [...this.transactions.values()].map(t=>({...t,rules:[...t.rules]}));}
 listAlerts(){return [...this.alerts.values()].map(a=>({...a,rules:[...a.rules]}));}
 createCase(alertId:string,actor:string){
  const a=this.alerts.get(alertId);if(!a)throw new Error("Alert not found");if(a.status!=="open")throw new Error("Alert is not open");
  const c:InvestigationCase={id:randomUUID(),alertId,customerId:a.customerId,status:"open",notes:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  this.cases.set(c.id,c);a.status="case_created";this.event("case",c.id,"created",actor,{alertId});return {...c,notes:[]};
 }
 assignCase(id:string,analyst:string,actor:string){const c=this.cases.get(id);if(!c)throw new Error("Case not found");if(c.status==="closed")throw new Error("Case is closed");if(!analyst.trim())throw new Error("Analyst required");c.assignedTo=analyst;c.status="investigating";c.updatedAt=new Date().toISOString();this.event("case",id,"assigned",actor,{analyst});return {...c,notes:[...c.notes]};}
 addCaseNote(id:string,note:string,actor:string){const c=this.cases.get(id);if(!c)throw new Error("Case not found");if(c.status==="closed")throw new Error("Case is closed");if(!note.trim())throw new Error("Note required");c.notes.push(note);c.updatedAt=new Date().toISOString();this.event("case",id,"note_added",actor,{noteLength:note.length});return {...c,notes:[...c.notes]};}
 closeCase(id:string,actor:string,disposition:Disposition){
  const c=this.cases.get(id);if(!c)throw new Error("Case not found");if(c.status==="closed")throw new Error("Case already closed");if(!c.assignedTo)throw new Error("Case must be assigned before closure");
  c.status="closed";c.disposition=disposition;c.updatedAt=new Date().toISOString();this.event("case",id,"closed",actor,{disposition});return {...c,notes:[...c.notes]};
 }
 createReportDraft(caseId:string,actor:string,summary:string){
  const c=this.cases.get(caseId);if(!c)throw new Error("Case not found");if(c.status!=="closed"||!["suspicious_activity","sanctions_match"].includes(c.disposition??""))throw new Error("Only closed suspicious cases can generate a report draft");
  if(!summary.trim())throw new Error("Report summary required");
  const tx=[...this.transactions.values()].filter(t=>t.customerId===c.customerId);
  const r:ReportDraft={id:randomUUID(),caseId,customerId:c.customerId,summary,indicators:tx.flatMap(t=>t.rules),status:"draft",createdAt:new Date().toISOString()};
  this.reports.set(r.id,r);this.event("report",r.id,"draft_created",actor,{caseId});return {...r,indicators:[...r.indicators]};
 }
 reviewReport(id:string,reviewer:string){const r=this.reports.get(id);if(!r)throw new Error("Report draft not found");if(!reviewer||reviewer===r.customerId)throw new Error("Independent report reviewer required");if(r.status!=="draft")throw new Error("Report already reviewed");r.status="reviewed";this.event("report",id,"reviewed",reviewer);return {...r,indicators:[...r.indicators]};}
 listCases(){return [...this.cases.values()].map(c=>({...c,notes:[...c.notes]}));}
 listReports(){return [...this.reports.values()].map(r=>({...r,indicators:[...r.indicators]}));}
 listAudit(){return this.audit.map(e=>({...e,details:{...e.details}}));}
 dashboard(){return {customers:this.customers.size,verifiedCustomers:[...this.customers.values()].filter(c=>c.status==="verified").length,highRiskCustomers:[...this.customers.values()].filter(c=>c.riskBand==="high").length,screeningMatches:[...this.screenings.values()].filter(s=>s.status==="potential_match").length,transactions:this.transactions.size,openAlerts:[...this.alerts.values()].filter(a=>a.status==="open").length,openCases:[...this.cases.values()].filter(c=>c.status!=="closed").length,reportDrafts:this.reports.size};}
}
