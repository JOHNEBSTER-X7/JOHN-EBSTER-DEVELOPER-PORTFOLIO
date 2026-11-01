import {randomUUID} from "node:crypto";
export type Currency="GBP"|"USD"|"EUR";
export type InstrumentType="equity"|"bond";
export type InvestorStatus="pending"|"eligible"|"rejected";
export type OrderSide="buy"|"sell";
export type OrderStatus="open"|"partially_filled"|"filled"|"cancelled";
export interface Investor{id:string;name:string;type:"individual"|"institutional";jurisdiction:string;status:InvestorStatus;createdAt:string}
export interface Issuer{id:string;name:string;jurisdiction:string;verified:boolean;createdAt:string}
export interface Security{id:string;issuerId:string;name:string;isin:string;type:InstrumentType;currency:Currency;totalUnits:number;issuedUnits:number;nominalValueMinor:number;issuePriceMinor:number;couponBps:number;maturityDate?:string;status:"draft"|"issued"|"suspended";createdAt:string}
export interface Holding{id:string;investorId:string;securityId:string;units:number;updatedAt:string}
export interface Order{id:string;investorId:string;securityId:string;side:OrderSide;units:number;limitPriceMinor:number;remainingUnits:number;status:OrderStatus;createdAt:string}
export interface Trade{id:string;securityId:string;buyerId:string;sellerId:string;units:number;priceMinor:number;status:"pending_settlement"|"settled"|"failed";createdAt:string;settledAt?:string}
export interface CorporateAction{id:string;securityId:string;kind:"cash_distribution"|"stock_split";recordDate:string;paymentDate:string;amountPerUnitMinor?:number;splitNumerator?:number;splitDenominator?:number;status:"announced"|"processed";createdAt:string}
export interface Distribution{id:string;actionId:string;investorId:string;units:number;amountMinor:number;currency:Currency;status:"recorded";createdAt:string}
export interface AuditEvent{id:string;entity:string;entityId:string;action:string;actor:string;at:string;details:Record<string,string|number|boolean>}
export class CapitalMarkets{
 private investors=new Map<string,Investor>();private issuers=new Map<string,Issuer>();private securities=new Map<string,Security>();private holdings=new Map<string,Holding>();private orders=new Map<string,Order>();private trades=new Map<string,Trade>();private actions=new Map<string,CorporateAction>();private distributions=new Map<string,Distribution>();private audit:AuditEvent[]=[];
 private event(entity:string,entityId:string,action:string,actor:string,details:Record<string,string|number|boolean>={}){this.audit.push({id:randomUUID(),entity,entityId,action,actor,at:new Date().toISOString(),details});}
 createInvestor(input:{name:string;type:"individual"|"institutional";jurisdiction:string}){if(!input.name.trim()||input.jurisdiction.length!==2)throw new Error("Valid investor details required");const x:Investor={...input,id:randomUUID(),status:"pending",createdAt:new Date().toISOString()};this.investors.set(x.id,x);this.event("investor",x.id,"onboarded","system");return {...x};}
 reviewInvestor(id:string,reviewer:string,decision:"eligible"|"reject"){const x=this.investors.get(id);if(!x)throw new Error("Investor not found");if(!reviewer||reviewer===id)throw new Error("Independent reviewer required");if(x.status!=="pending")throw new Error("Investor already reviewed");x.status=decision==="reject"?"rejected":"eligible";this.event("investor",id,"eligibility_"+decision,reviewer);return {...x};}
 createIssuer(input:{name:string;jurisdiction:string}){if(!input.name.trim()||input.jurisdiction.length!==2)throw new Error("Valid issuer details required");const x:Issuer={...input,id:randomUUID(),verified:false,createdAt:new Date().toISOString()};this.issuers.set(x.id,x);this.event("issuer",x.id,"created","system");return {...x};}
 verifyIssuer(id:string,reviewer:string){const x=this.issuers.get(id);if(!x)throw new Error("Issuer not found");if(!reviewer||reviewer===id)throw new Error("Independent reviewer required");x.verified=true;this.event("issuer",id,"verified",reviewer);return {...x};}
 issueSecurity(input:{issuerId:string;name:string;isin:string;type:InstrumentType;currency:Currency;totalUnits:number;nominalValueMinor:number;issuePriceMinor:number;couponBps?:number;maturityDate?:string},actor:string){
  const issuer=this.issuers.get(input.issuerId);if(!issuer?.verified)throw new Error("Verified issuer required");
  if(!input.name.trim()||!/^[A-Z]{2}[A-Z0-9]{10}$/.test(input.isin)||![input.totalUnits,input.nominalValueMinor,input.issuePriceMinor].every(Number.isSafeInteger)||input.totalUnits<=0||input.nominalValueMinor<=0||input.issuePriceMinor<=0)throw new Error("Invalid security terms");
  if([...this.securities.values()].some(s=>s.isin===input.isin))throw new Error("ISIN already registered");
  if(input.type==="bond"&&(!input.maturityDate||!Number.isInteger(input.couponBps)||input.couponBps!<0))throw new Error("Bond requires maturity date and non-negative coupon");
  const s:Security={...input,id:randomUUID(),issuedUnits:0,couponBps:input.couponBps??0,status:"issued",createdAt:new Date().toISOString()};this.securities.set(s.id,s);this.event("security",s.id,"issued",actor,{isin:s.isin,type:s.type,totalUnits:s.totalUnits});return {...s};
 }
 listInvestors(){return [...this.investors.values()].map(x=>({...x}));}
 listIssuers(){return [...this.issuers.values()].map(x=>({...x}));}
 listSecurities(){return [...this.securities.values()].map(x=>({...x}));}
 getSecurity(id:string){const x=this.securities.get(id);return x?{...x}:undefined;}
 private holdingKey(investorId:string,securityId:string){return investorId+":"+securityId;}
 private changeHolding(investorId:string,securityId:string,delta:number){const key=this.holdingKey(investorId,securityId);let h=this.holdings.get(key);if(!h){h={id:randomUUID(),investorId,securityId,units:0,updatedAt:new Date().toISOString()};this.holdings.set(key,h);}h.units+=delta;if(h.units<0)throw new Error("Insufficient securities holding");h.updatedAt=new Date().toISOString();return h;}
 allocatePrimary(input:{investorId:string;securityId:string;units:number;actor:string}){
  const i=this.investors.get(input.investorId),s=this.securities.get(input.securityId);if(!i||i.status!=="eligible")throw new Error("Eligible investor required");if(!s||s.status!=="issued")throw new Error("Issued security required");if(!Number.isSafeInteger(input.units)||input.units<=0||s.issuedUnits+input.units>s.totalUnits)throw new Error("Invalid allocation or issue capacity exceeded");
  s.issuedUnits+=input.units;const h=this.changeHolding(i.id,s.id,input.units);this.event("holding",h.id,"primary_allocation",input.actor,{units:input.units,securityId:s.id});return {...h};
 }
 listHoldings(){return [...this.holdings.values()].map(h=>({...h}));}
 placeOrder(input:{investorId:string;securityId:string;side:OrderSide;units:number;limitPriceMinor:number;actor:string}){
  const i=this.investors.get(input.investorId),s=this.securities.get(input.securityId);if(!i||i.status!=="eligible")throw new Error("Eligible investor required");if(!s||s.status!=="issued")throw new Error("Issued security required");if(!Number.isSafeInteger(input.units)||input.units<=0||!Number.isSafeInteger(input.limitPriceMinor)||input.limitPriceMinor<=0)throw new Error("Invalid order terms");
  if(input.side==="sell"&&(this.holdings.get(this.holdingKey(i.id,s.id))?.units??0)<input.units)throw new Error("Insufficient securities holding");
  const o:Order={...input,id:randomUUID(),remainingUnits:input.units,status:"open",createdAt:new Date().toISOString()};this.orders.set(o.id,o);this.event("order",o.id,"placed",input.actor,{side:o.side,units:o.units});this.match(o);return {...o};
 }
 private match(incoming:Order){
  const opposite=[...this.orders.values()].filter(o=>o.securityId===incoming.securityId&&o.side!==(incoming.side)&&["open","partially_filled"].includes(o.status)&&o.investorId!==incoming.investorId&&o.remainingUnits>0&& (incoming.side==="buy"?incoming.limitPriceMinor>=o.limitPriceMinor:incoming.limitPriceMinor<=o.limitPriceMinor)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  for(const resting of opposite){if(incoming.remainingUnits===0)break;const units=Math.min(incoming.remainingUnits,resting.remainingUnits);const buyer=incoming.side==="buy"?incoming:resting,seller=incoming.side==="sell"?incoming:resting;
   const trade:Trade={id:randomUUID(),securityId:incoming.securityId,buyerId:buyer.investorId,sellerId:seller.investorId,units,priceMinor:resting.limitPriceMinor,status:"pending_settlement",createdAt:new Date().toISOString()};this.trades.set(trade.id,trade);incoming.remainingUnits-=units;resting.remainingUnits-=units;incoming.status=incoming.remainingUnits===0?"filled":"partially_filled";resting.status=resting.remainingUnits===0?"filled":"partially_filled";this.event("trade",trade.id,"matched","matching-engine",{units,priceMinor:trade.priceMinor});
  }
 }
 settleTrade(id:string,operator:string){const t=this.trades.get(id);if(!t)throw new Error("Trade not found");if(t.status!=="pending_settlement")throw new Error("Trade is not pending settlement");const key=this.holdingKey(t.sellerId,t.securityId),seller=this.holdings.get(key);if(!seller||seller.units<t.units){t.status="failed";this.event("trade",id,"settlement_failed",operator);return {...t};}
  this.changeHolding(t.sellerId,t.securityId,-t.units);this.changeHolding(t.buyerId,t.securityId,t.units);t.status="settled";t.settledAt=new Date().toISOString();this.event("trade",id,"settled",operator,{units:t.units});return {...t};
 }
 listOrders(){return [...this.orders.values()].map(o=>({...o}));}listTrades(){return [...this.trades.values()].map(t=>({...t}));}
 announceAction(input:{securityId:string;kind:"cash_distribution"|"stock_split";recordDate:string;paymentDate:string;amountPerUnitMinor?:number;splitNumerator?:number;splitDenominator?:number;actor:string}){
  const s=this.securities.get(input.securityId);if(!s||s.status!=="issued")throw new Error("Issued security required");if(!input.recordDate||!input.paymentDate||input.paymentDate<input.recordDate)throw new Error("Invalid corporate action dates");
  if(input.kind==="cash_distribution"&&(!Number.isSafeInteger(input.amountPerUnitMinor)||input.amountPerUnitMinor!<=0))throw new Error("Positive distribution amount required");
  if(input.kind==="stock_split"&&(!Number.isSafeInteger(input.splitNumerator)||!Number.isSafeInteger(input.splitDenominator)||input.splitNumerator!<=0||input.splitDenominator!<=0))throw new Error("Valid split ratio required");
  const a:CorporateAction={...input,id:randomUUID(),status:"announced",createdAt:new Date().toISOString()};this.actions.set(a.id,a);this.event("corporate_action",a.id,"announced",input.actor,{kind:a.kind,securityId:s.id});return {...a};
 }
 processAction(id:string,operator:string){const a=this.actions.get(id);if(!a)throw new Error("Corporate action not found");if(a.status!=="announced")throw new Error("Corporate action already processed");if(a.kind!=="cash_distribution")throw new Error("Stock split processing is not implemented in this prototype");
  const s=this.securities.get(a.securityId)!;const created:Distribution[]=[];for(const h of this.holdings.values()){if(h.securityId!==s.id||h.units<=0)continue;const d:Distribution={id:randomUUID(),actionId:a.id,investorId:h.investorId,units:h.units,amountMinor:h.units*a.amountPerUnitMinor!,currency:s.currency,status:"recorded",createdAt:new Date().toISOString()};this.distributions.set(d.id,d);created.push({...d});}
  a.status="processed";this.event("corporate_action",id,"distribution_recorded",operator,{beneficiaries:created.length});return created;
 }
 listActions(){return [...this.actions.values()].map(a=>({...a}));}listDistributions(){return [...this.distributions.values()].map(d=>({...d}));}
 listAudit(){return this.audit.map(e=>({...e,details:{...e.details}}));}
 dashboard(){return {investors:this.investors.size,eligibleInvestors:[...this.investors.values()].filter(i=>i.status==="eligible").length,issuers:this.issuers.size,securities:this.securities.size,issuedUnits:[...this.securities.values()].reduce((n,s)=>n+s.issuedUnits,0),openOrders:[...this.orders.values()].filter(o=>["open","partially_filled"].includes(o.status)).length,pendingSettlement:[...this.trades.values()].filter(t=>t.status==="pending_settlement").length,settledTrades:[...this.trades.values()].filter(t=>t.status==="settled").length,corporateActions:this.actions.size};}
}
