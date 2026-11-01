import {randomUUID} from "node:crypto";

export type PartyRole="importer"|"exporter"|"lender"|"logistics_provider";
export type FinanceType="letter_of_credit"|"invoice_finance"|"purchase_order_finance";
export type ApplicationStatus="draft"|"submitted"|"approved"|"rejected"|"funded"|"settled";
export type DocumentType="commercial_invoice"|"purchase_order"|"bill_of_lading"|"packing_list"|"insurance_certificate"|"letter_of_credit";
export interface Party {id:string;name:string;role:PartyRole;country:string;status:"pending"|"verified"|"rejected";createdAt:string}
export interface TradeDocument {id:string;type:DocumentType;reference:string;verified:boolean;uploadedAt:string}
export interface Application {id:string;type:FinanceType;applicantId:string;counterpartyId:string;currency:"GBP"|"USD"|"EUR";amountMinor:number;description:string;status:ApplicationStatus;documents:TradeDocument[];riskScore:number;riskBand:"low"|"moderate"|"high";riskFactors:string[];lenderId?:string;approvedBy?:string;createdAt:string}
export interface AuditEvent {id:string;entityType:string;entityId:string;action:string;actor:string;timestamp:string;details:Record<string,string|number|boolean>}
const required:Record<FinanceType,DocumentType[]>={letter_of_credit:["commercial_invoice","purchase_order","insurance_certificate"],invoice_finance:["commercial_invoice","bill_of_lading"],purchase_order_finance:["purchase_order","commercial_invoice"]};
export class TradeFinance {
 private parties=new Map<string,Party>();
 private applications=new Map<string,Application>();
 private audit:AuditEvent[]=[];
 private lenders=new Map<string,{id:string;name:string;availableLimitMinor:number;currency:"GBP"|"USD"|"EUR"}>();
 constructor(){
  this.lenders.set("lender-demo",{id:"lender-demo",name:"Northstar Demonstration Funding Desk",availableLimitMinor:50_000_000,currency:"GBP"});
  this.lenders.set("lender-small",{id:"lender-small",name:"Example Limited Facility",availableLimitMinor:50_000,currency:"GBP"});
 }
 private event(entityType:string,entityId:string,action:string,actor:string,details:Record<string,string|number|boolean>={}){this.audit.push({id:randomUUID(),entityType,entityId,action,actor,timestamp:new Date().toISOString(),details});}
 onboard(input:{name:string;role:PartyRole;country:string},actor="system"){
  if(!input.name.trim()||!input.country.trim())throw new Error("Name and country are required");
  const p:Party={...input,id:randomUUID(),status:"pending",createdAt:new Date().toISOString()};this.parties.set(p.id,p);this.event("party",p.id,"created",actor,{role:p.role});return {...p};
 }
 verifyParty(id:string,reviewer:string,decision:"verify"|"reject"){
  const p=this.parties.get(id);if(!p)throw new Error("Party not found");if(!reviewer)throw new Error("Reviewer required");
  if(p.status!=="pending")throw new Error("Party review already completed");
  p.status=decision==="verify"?"verified":"rejected";this.event("party",id,decision,reviewer);return {...p};
 }
 listParties(){return [...this.parties.values()].map(p=>({...p}));}
 private risk(input:{type:FinanceType;amountMinor:number;applicant:Party;counterparty:Party;documents:TradeDocument[]}){
  let score=15;const factors:string[]=[];
  if(input.amountMinor>10_000_000){score+=25;factors.push("Large requested facility");}
  else if(input.amountMinor>2_500_000){score+=12;factors.push("Medium-sized requested facility");}
  if(input.applicant.country!==input.counterparty.country){score+=10;factors.push("Cross-border transaction");}
  if(input.applicant.role==="importer"&&input.counterparty.role!=="exporter"){score+=20;factors.push("Counterparty role does not match importer trade flow");}
  if(input.applicant.role==="exporter"&&input.counterparty.role!=="importer"){score+=20;factors.push("Counterparty role does not match exporter trade flow");}
  const missing=required[input.type].filter(t=>!input.documents.some(d=>d.type===t&&d.verified));
  if(missing.length){score+=missing.length*12;factors.push(`Missing or unverified documents: ${missing.join(", ")}`);}
  score=Math.min(100,score);return {riskScore:score,riskBand:score<35?"low" as const:score<65?"moderate" as const:"high" as const,riskFactors:factors};
 }
 createApplication(input:{type:FinanceType;applicantId:string;counterpartyId:string;currency:"GBP"|"USD"|"EUR";amountMinor:number;description:string}){
  if(!Number.isSafeInteger(input.amountMinor)||input.amountMinor<=0||!input.description.trim())throw new Error("Invalid application amount or description");
  const applicant=this.parties.get(input.applicantId),counterparty=this.parties.get(input.counterpartyId);
  if(!applicant||!counterparty)throw new Error("Applicant and counterparty must exist");
  if(applicant.status!=="verified"||counterparty.status!=="verified")throw new Error("Both parties must be verified before applying");
  if(applicant.id===counterparty.id)throw new Error("Applicant and counterparty must be different");
  if(!((applicant.role==="importer"&&counterparty.role==="exporter")||(applicant.role==="exporter"&&counterparty.role==="importer")))throw new Error("Trade parties must be importer and exporter");
  const r=this.risk({type:input.type,amountMinor:input.amountMinor,applicant,counterparty,documents:[]});
  const a:Application={...input,id:randomUUID(),status:"draft",documents:[],...r,createdAt:new Date().toISOString()};this.applications.set(a.id,a);this.event("application",a.id,"created",applicant.id,{type:a.type,amountMinor:a.amountMinor});return this.copy(a);
 }
 addDocument(applicationId:string,input:{type:DocumentType;reference:string},actor:string){
  const a=this.applications.get(applicationId);if(!a)throw new Error("Application not found");if(a.status!=="draft")throw new Error("Documents can only be added to draft applications");
  if(!input.reference.trim())throw new Error("Document reference required");
  if(a.documents.some(d=>d.type===input.type))throw new Error("Document type already registered");
  const d:TradeDocument={...input,id:randomUUID(),verified:false,uploadedAt:new Date().toISOString()};a.documents.push(d);this.refreshRisk(a);this.event("application",a.id,"document_registered",actor,{documentType:d.type,reference:d.reference});return this.copy(a);
 }
 verifyDocument(applicationId:string,documentId:string,reviewer:string,decision:"verify"|"reject"){
  const a=this.applications.get(applicationId);if(!a)throw new Error("Application not found");if(a.status!=="draft")throw new Error("Application is not in document review");
  const d=a.documents.find(x=>x.id===documentId);if(!d)throw new Error("Document not found");if(!reviewer||reviewer===a.applicantId)throw new Error("Independent document reviewer required");
  d.verified=decision==="verify";this.refreshRisk(a);this.event("application",a.id,"document_"+decision,reviewer,{documentType:d.type});return this.copy(a);
 }
 submit(applicationId:string,actor:string){
  const a=this.applications.get(applicationId);if(!a)throw new Error("Application not found");if(a.status!=="draft")throw new Error("Application is not a draft");
  const missing=required[a.type].filter(t=>!a.documents.some(d=>d.type===t&&d.verified));if(missing.length)throw new Error("Required verified documents missing: "+missing.join(", "));
  a.status="submitted";this.event("application",a.id,"submitted",actor);return this.copy(a);
 }
 decide(applicationId:string,reviewer:string,decision:"approve"|"reject",lenderId="lender-demo"){
  const a=this.applications.get(applicationId);if(!a)throw new Error("Application not found");if(a.status!=="submitted")throw new Error("Application must be submitted before decision");
  if(!reviewer||reviewer===a.applicantId)throw new Error("Independent credit reviewer required");
  if(decision==="approve"){
   const lender=this.lenders.get(lenderId);if(!lender)throw new Error("Lender not found");
   if(lender.currency!==a.currency)throw new Error("Lender currency does not match facility currency");
   if(a.riskBand==="high")throw new Error("High-risk application requires further due diligence");
   if(lender.availableLimitMinor<a.amountMinor)throw new Error("Insufficient lender facility limit");
   lender.availableLimitMinor-=a.amountMinor;a.lenderId=lenderId;a.approvedBy=reviewer;a.status="approved";
  }else a.status="rejected";
  this.event("application",a.id,decision,reviewer,{riskScore:a.riskScore});return this.copy(a);
 }
 fund(applicationId:string,operator:string){
  const a=this.applications.get(applicationId);if(!a)throw new Error("Application not found");if(a.status!=="approved")throw new Error("Only approved applications can be funded");
  if(!operator||operator===a.applicantId||operator===a.approvedBy)throw new Error("Independent funding operator required");
  a.status="funded";this.event("application",a.id,"funded",operator,{amountMinor:a.amountMinor,currency:a.currency,simulation:true});return this.copy(a);
 }
 settle(applicationId:string,operator:string,settlementReference:string){
  const a=this.applications.get(applicationId);if(!a)throw new Error("Application not found");if(a.status!=="funded")throw new Error("Only funded applications can be settled");
  if(!operator||!settlementReference.trim())throw new Error("Operator and settlement reference required");
  a.status="settled";this.event("application",a.id,"settled",operator,{settlementReference,simulation:true});return this.copy(a);
 }
 private refreshRisk(a:Application){const applicant=this.parties.get(a.applicantId)!,counterparty=this.parties.get(a.counterpartyId)!;Object.assign(a,this.risk({type:a.type,amountMinor:a.amountMinor,applicant,counterparty,documents:a.documents}));}
 private copy(a:Application):Application{return {...a,documents:a.documents.map(d=>({...d})),riskFactors:[...a.riskFactors]};}
 getApplication(id:string){const a=this.applications.get(id);return a?this.copy(a):undefined;}
 listApplications(){return [...this.applications.values()].map(a=>this.copy(a));}
 listAudit(entityId?:string){return this.audit.filter(e=>!entityId||e.entityId===entityId).map(e=>({...e,details:{...e.details}}));}
 listLenders(){return [...this.lenders.values()].map(l=>({...l}));}
 dashboard(){const apps=this.listApplications();return {parties:this.parties.size,applications:apps.length,submitted:apps.filter(a=>a.status==="submitted").length,approved:apps.filter(a=>a.status==="approved").length,funded:apps.filter(a=>a.status==="funded").length,settled:apps.filter(a=>a.status==="settled").length,totalRequestedMinor:apps.reduce((s,a)=>s+a.amountMinor,0),highRisk:apps.filter(a=>a.riskBand==="high").length};}
}
