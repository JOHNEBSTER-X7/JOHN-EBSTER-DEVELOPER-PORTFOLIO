import {randomUUID} from "node:crypto";
export type Scope="accounts:read"|"transactions:read"|"payments:write";
export type Category="income"|"housing"|"utilities"|"groceries"|"transport"|"shopping"|"financial"|"other";
export interface BankAccount {id:string;provider:string;ownerId:string;currency:"GBP"|"USD"|"EUR";balanceMinor:number;availableMinor:number}
export interface BankTransaction {id:string;accountId:string;amountMinor:number;currency:"GBP"|"USD"|"EUR";direction:"credit"|"debit";description:string;merchant:string;category:Category;bookedAt:string;reference:string}
export interface Consent {id:string;clientId:string;userId:string;accountIds:string[];scopes:Scope[];status:"authorised"|"revoked"|"expired";createdAt:string;expiresAt:string}
export interface Payment {id:string;clientId:string;consentId:string;sourceAccountId:string;beneficiary:string;amountMinor:number;currency:"GBP"|"USD"|"EUR";reference:string;status:"accepted"|"completed"|"rejected";createdAt:string;idempotencyKey:string}
export interface FraudAlert {id:string;transactionId:string;severity:"low"|"medium"|"high";reason:string;status:"open"|"reviewed";createdAt:string}
export class OpenBanking {
 private accounts=new Map<string,BankAccount>();
 private transactions=new Map<string,BankTransaction>();
 private consents=new Map<string,Consent>();
 private payments=new Map<string,Payment>();
 private idempotency=new Map<string,string>();
 private alerts:FraudAlert[]=[];
 private audit:Array<{id:string;action:string;entityId:string;actor:string;at:string;details:Record<string,string|number|boolean>}>= [];
 constructor(){
  const now=new Date();
  const seedAccounts:BankAccount[]=[
   {id:"acc-gbp-001",provider:"Northstar Demo Bank",ownerId:"customer-001",currency:"GBP",balanceMinor:425000,availableMinor:425000},
   {id:"acc-usd-001",provider:"Example Partner Bank",ownerId:"customer-001",currency:"USD",balanceMinor:180000,availableMinor:180000},
   {id:"acc-eur-001",provider:"Northstar Demo Bank",ownerId:"customer-002",currency:"EUR",balanceMinor:95000,availableMinor:95000}
  ];for(const a of seedAccounts)this.accounts.set(a.id,a);
  const samples:Array<Omit<BankTransaction,"id"|"bookedAt">>=[
   {accountId:"acc-gbp-001",amountMinor:250000,currency:"GBP",direction:"credit",description:"Monthly salary",merchant:"Example Employer",category:"income",reference:"SEED-001"},
   {accountId:"acc-gbp-001",amountMinor:95000,currency:"GBP",direction:"debit",description:"Rent payment",merchant:"Example Property",category:"housing",reference:"SEED-002"},
   {accountId:"acc-gbp-001",amountMinor:4250,currency:"GBP",direction:"debit",description:"Supermarket purchase",merchant:"Market Grocer",category:"groceries",reference:"SEED-003"},
   {accountId:"acc-gbp-001",amountMinor:125000,currency:"GBP",direction:"debit",description:"Unusual high-value transfer",merchant:"Unknown Recipient",category:"other",reference:"SEED-004"},
   {accountId:"acc-usd-001",amountMinor:50000,currency:"USD",direction:"credit",description:"Client receipt",merchant:"Example Client",category:"income",reference:"SEED-005"}
  ];
  for(let i=0;i<samples.length;i++){const s=samples[i];const tx:BankTransaction={...s,id:randomUUID(),bookedAt:new Date(now.getTime()-i*86400000).toISOString()};this.transactions.set(tx.id,tx);}
  this.scanTransactions();
 }
 private event(action:string,entityId:string,actor:string,details:Record<string,string|number|boolean>={}){this.audit.push({id:randomUUID(),action,entityId,actor,at:new Date().toISOString(),details});}
 listAccounts(userId:string){return [...this.accounts.values()].filter(a=>a.ownerId===userId).map(a=>({...a}));}
 listAllAccounts(){return [...this.accounts.values()].map(a=>({...a}));}
 createConsent(input:{clientId:string;userId:string;accountIds:string[];scopes:Scope[];durationDays:number}){
  if(!input.clientId||!input.userId||!input.accountIds.length||!input.scopes.length||!Number.isInteger(input.durationDays)||input.durationDays<1||input.durationDays>90)throw new Error("Invalid consent request");
  for(const id of input.accountIds){const a=this.accounts.get(id);if(!a||a.ownerId!==input.userId)throw new Error("Consent can only cover accounts owned by the customer");}
  const now=new Date();const c:Consent={id:randomUUID(),clientId:input.clientId,userId:input.userId,accountIds:[...new Set(input.accountIds)],scopes:[...new Set(input.scopes)],status:"authorised",createdAt:now.toISOString(),expiresAt:new Date(now.getTime()+input.durationDays*86400000).toISOString()};
  this.consents.set(c.id,c);this.event("consent_authorised",c.id,input.clientId,{userId:c.userId,scopeCount:c.scopes.length});return {...c};
 }
 getConsent(id:string){const c=this.consents.get(id);if(!c)return undefined;this.refreshConsent(c);return {...c,accountIds:[...c.accountIds],scopes:[...c.scopes]};}
 private refreshConsent(c:Consent){if(c.status==="authorised"&&Date.now()>=Date.parse(c.expiresAt)){c.status="expired";this.event("consent_expired",c.id,"system");}}
 revokeConsent(id:string,actor:string){const c=this.consents.get(id);if(!c)throw new Error("Consent not found");this.refreshConsent(c);if(c.status!=="authorised")throw new Error("Consent is not active");c.status="revoked";this.event("consent_revoked",id,actor);return {...c};}
 private requireConsent(id:string,clientId:string,scope:Scope,accountId?:string){const c=this.consents.get(id);if(!c)throw new Error("Consent not found");this.refreshConsent(c);if(c.status!=="authorised")throw new Error("Consent is not active");if(c.clientId!==clientId)throw new Error("Consent client mismatch");if(!c.scopes.includes(scope))throw new Error("Consent scope does not permit this action");if(accountId&&!c.accountIds.includes(accountId))throw new Error("Account is outside consent");return c;}
 listAggregatedAccounts(consentId:string,clientId:string){const c=this.requireConsent(consentId,clientId,"accounts:read");return c.accountIds.map(id=>({...this.accounts.get(id)!}));}
 listTransactions(consentId:string,clientId:string,accountId:string){this.requireConsent(consentId,clientId,"transactions:read",accountId);return [...this.transactions.values()].filter(t=>t.accountId===accountId).sort((a,b)=>b.bookedAt.localeCompare(a.bookedAt)).map(t=>({...t}));}
 private categorise(description:string,merchant:string):Category{const s=(description+" "+merchant).toLowerCase();if(/salary|payroll|invoice|receipt/.test(s))return "income";if(/rent|mortgage|property/.test(s))return "housing";if(/electric|water|gas|broadband|utility/.test(s))return "utilities";if(/supermarket|grocer|food|market/.test(s))return "groceries";if(/train|bus|taxi|fuel|transport/.test(s))return "transport";if(/shop|retail|online/.test(s))return "shopping";if(/bank|interest|loan|fee/.test(s))return "financial";return "other";}
 recategoriseTransaction(transactionId:string,category:Category,actor:string){const t=this.transactions.get(transactionId);if(!t)throw new Error("Transaction not found");t.category=category;this.event("transaction_recategorised",transactionId,actor,{category});return {...t};}
 initiatePayment(input:{consentId:string;clientId:string;sourceAccountId:string;beneficiary:string;amountMinor:number;currency:"GBP"|"USD"|"EUR";reference:string;idempotencyKey:string}){
  const c=this.requireConsent(input.consentId,input.clientId,"payments:write",input.sourceAccountId);
  if(!Number.isSafeInteger(input.amountMinor)||input.amountMinor<=0||!input.beneficiary.trim()||!input.reference.trim()||!input.idempotencyKey.trim())throw new Error("Invalid payment details");
  const idem=input.clientId+":"+input.idempotencyKey;const prior=this.idempotency.get(idem);if(prior)return {...this.payments.get(prior)!};
  const a=this.accounts.get(input.sourceAccountId)!;if(a.ownerId!==c.userId)throw new Error("Consent owner mismatch");if(a.currency!==input.currency)throw new Error("Payment currency must match source account");
  if(a.availableMinor<input.amountMinor)throw new Error("Insufficient available funds");
  a.availableMinor-=input.amountMinor;
  const p:Payment={id:randomUUID(),clientId:input.clientId,consentId:c.id,sourceAccountId:a.id,beneficiary:input.beneficiary,amountMinor:input.amountMinor,currency:input.currency,reference:input.reference,status:"accepted",createdAt:new Date().toISOString(),idempotencyKey:input.idempotencyKey};
  this.payments.set(p.id,p);this.idempotency.set(idem,p.id);this.event("payment_accepted",p.id,input.clientId,{amountMinor:p.amountMinor,currency:p.currency});return {...p};
 }
 completePayment(id:string,operator:string){const p=this.payments.get(id);if(!p)throw new Error("Payment not found");if(p.status!=="accepted")throw new Error("Payment is not awaiting completion");const a=this.accounts.get(p.sourceAccountId)!;a.balanceMinor-=p.amountMinor;p.status="completed";this.event("payment_completed",id,operator,{amountMinor:p.amountMinor});return {...p};}
 rejectPayment(id:string,operator:string,reason:string){const p=this.payments.get(id);if(!p)throw new Error("Payment not found");if(p.status!=="accepted")throw new Error("Payment is not awaiting decision");const a=this.accounts.get(p.sourceAccountId)!;a.availableMinor+=p.amountMinor;p.status="rejected";this.event("payment_rejected",id,operator,{reason});return {...p};}
 getPayment(id:string){const p=this.payments.get(id);return p?{...p}:undefined;}
 listPayments(){return [...this.payments.values()].map(p=>({...p}));}
 private scanTransactions(){for(const t of this.transactions.values()){const account=this.accounts.get(t.accountId)!;const highValue=t.amountMinor>=Math.round(account.balanceMinor*0.25);const unusual=t.direction==="debit"&&t.amountMinor>=100000&&t.category==="other";if(highValue||unusual)this.alerts.push({id:randomUUID(),transactionId:t.id,severity:unusual?"high":"medium",reason:unusual?"Large debit to an uncategorised recipient":"Transaction exceeds 25% of the account's seeded balance",status:"open",createdAt:new Date().toISOString()});}}
 listAlerts(){return this.alerts.map(a=>({...a}));}
 reviewAlert(id:string,reviewer:string){const a=this.alerts.find(x=>x.id===id);if(!a)throw new Error("Alert not found");if(a.status!=="open")throw new Error("Alert already reviewed");a.status="reviewed";this.event("fraud_alert_reviewed",id,reviewer);return {...a};}
 reconcile(accountId:string,statementReferences:string[]){if(!this.accounts.has(accountId))throw new Error("Account not found");const ledger=[...this.transactions.values()].filter(t=>t.accountId===accountId);const refs=new Set(statementReferences);const matched=ledger.filter(t=>refs.has(t.reference)).map(t=>t.reference);const unmatched=statementReferences.filter(ref=>!ledger.some(t=>t.reference===ref));const missing=ledger.filter(t=>!refs.has(t.reference)).map(t=>t.reference);return {accountId,matched:[...new Set(matched)],unmatched:[...new Set(unmatched)],missing};}
 listAudit(){return this.audit.map(e=>({...e,details:{...e.details}}));}
 dashboard(){return {accounts:this.accounts.size,consents:this.consents.size,activeConsents:[...this.consents.values()].filter(c=>{this.refreshConsent(c);return c.status==="authorised"}).length,payments:this.payments.size,acceptedPayments:[...this.payments.values()].filter(p=>p.status==="accepted").length,openFraudAlerts:this.alerts.filter(a=>a.status==="open").length,transactionCount:this.transactions.size};}
}
