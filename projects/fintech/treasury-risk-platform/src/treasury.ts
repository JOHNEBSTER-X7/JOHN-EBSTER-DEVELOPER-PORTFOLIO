import {randomUUID} from "node:crypto";

export type Currency="GBP"|"USD"|"EUR"|"JPY";
export type TransactionStatus="pending"|"approved"|"rejected"|"completed";
export interface Position {currency:Currency;balanceMinor:number;availableMinor:number}
export interface Flow {id:string;date:string;currency:Currency;amountMinor:number;kind:"inflow"|"outflow";description:string}
export interface TreasuryTransaction {id:string;accountId:string;currency:Currency;amountMinor:number;direction:"inflow"|"outflow";description:string;status:TransactionStatus;createdAt:string;approvedBy?:string}
export interface Counterparty {id:string;name:string;limitGbpMinor:number;exposureGbpMinor:number}
const currencies:Currency[]=["GBP","USD","EUR","JPY"];
const fxToGbp:Record<Currency,number>={GBP:1,USD:0.79,EUR:0.86,JPY:0.0053};
const round=(n:number)=>Math.round(n);
export class Treasury {
 private positions=new Map<string,Map<Currency,Position>>();
 private flows:Flow[]=[];
 private transactions=new Map<string,TreasuryTransaction>();
 private counterparties=new Map<string,Counterparty>();
 private readonly fx=fxToGbp;
 constructor(){
  this.seed("treasury-demo",{GBP:2_500_000,USD:1_200_000,EUR:800_000,JPY:50_000_000});
  this.counterparties.set("cp-bank-a",{id:"cp-bank-a",name:"Example Settlement Bank A",limitGbpMinor:2_000_000,exposureGbpMinor:850_000});
  this.counterparties.set("cp-bank-b",{id:"cp-bank-b",name:"Example Counterparty B",limitGbpMinor:1_000_000,exposureGbpMinor:620_000});
  const today=new Date();for(let d=0;d<7;d++){const date=new Date(today);date.setUTCDate(today.getUTCDate()+d);const ds=date.toISOString().slice(0,10);
   this.flows.push({id:randomUUID(),date:ds,currency:"GBP",amountMinor:d%2===0?300_000:180_000,kind:d%2===0?"inflow":"outflow",description:d%2===0?"Forecast receivable":"Operating payment"});
  }
 }
 private seed(account:string,balances:Record<Currency,number>){const m=new Map<Currency,Position>();for(const c of currencies){m.set(c,{currency:c,balanceMinor:balances[c],availableMinor:balances[c]});}this.positions.set(account,m);}
 getPositions(account="treasury-demo"){return [...(this.positions.get(account)?.values()??[])].map(p=>({...p}));}
 addFlow(flow:Omit<Flow,"id">){if(!/^\d{4}-\d{2}-\d{2}$/.test(flow.date)||!currencies.includes(flow.currency)||!Number.isSafeInteger(flow.amountMinor)||flow.amountMinor<=0)throw new Error("Invalid forecast flow");const f={...flow,id:randomUUID()};this.flows.push(f);return {...f};}
 forecast(account="treasury-demo"){
  const positions=this.getPositions(account);const start=new Map<Currency,number>(positions.map(p=>[p.currency,p.balanceMinor]));
  const rows=this.flows.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(f=>{const before=start.get(f.currency)??0;const after=before+(f.kind==="inflow"?f.amountMinor:-f.amountMinor);start.set(f.currency,after);return {...f,closingBalanceMinor:after};});
  const totals=currencies.map(currency=>({currency,openingMinor:this.positions.get(account)?.get(currency)?.balanceMinor??0,projectedClosingMinor:start.get(currency)??0}));
  return {accountId:account,flows:rows,totals,baseCurrency:"GBP"};
 }
 fxExposure(account="treasury-demo"){
  const positions=this.getPositions(account).map(p=>({currency:p.currency,balanceMinor:p.balanceMinor,rateToGbp:this.fx[p.currency],valueGbpMinor:round(p.balanceMinor*this.fx[p.currency])}));
  const netGbpMinor=positions.reduce((s,p)=>s+p.valueGbpMinor,0);
  return {baseCurrency:"GBP",positions,netGbpMinor,concentration:positions.map(p=>({currency:p.currency,share:netGbpMinor? p.valueGbpMinor/netGbpMinor:0}))};
 }
 stressTest(shocks:Partial<Record<Currency,number>>){
  const exposure=this.fxExposure();const results=exposure.positions.map(p=>{const shock=shocks[p.currency]??0;if(!Number.isFinite(shock)||shock< -1||shock>1)throw new Error("FX shock must be between -1 and 1");const impact=round(p.valueGbpMinor*shock);return {currency:p.currency,shock,impactGbpMinor:impact,stressedValueGbpMinor:p.valueGbpMinor+impact};});
  return {baseCurrency:"GBP",netImpactGbpMinor:results.reduce((s,r)=>s+r.impactGbpMinor,0),results};
 }
 listCounterparties(){return [...this.counterparties.values()].map(c=>({...c,headroomGbpMinor:c.limitGbpMinor-c.exposureGbpMinor,utilisation:c.limitGbpMinor?c.exposureGbpMinor/c.limitGbpMinor:0}));}
 propose(input:{accountId:string;currency:Currency;amountMinor:number;direction:"inflow"|"outflow";description:string}){
  if(!currencies.includes(input.currency)||!Number.isSafeInteger(input.amountMinor)||input.amountMinor<=0||!input.description.trim())throw new Error("Invalid treasury transaction");
  const p=this.positions.get(input.accountId)?.get(input.currency);if(!p)throw new Error("Treasury account not found");
  if(input.direction==="outflow"&&input.amountMinor>p.availableMinor)throw new Error("Insufficient available balance");
  if(input.direction==="outflow")p.availableMinor-=input.amountMinor;
  const t:TreasuryTransaction={...input,id:randomUUID(),status:"pending",createdAt:new Date().toISOString()};this.transactions.set(t.id,t);return {...t};
 }
 decide(id:string,reviewerId:string,decision:"approve"|"reject"){
  const t=this.transactions.get(id);if(!t)throw new Error("Transaction not found");
  if(t.status!=="pending")throw new Error("Transaction is not pending");
  if(!reviewerId||reviewerId===t.accountId)throw new Error("Independent reviewer required");
  const p=this.positions.get(t.accountId)!.get(t.currency)!;
  if(decision==="reject"){if(t.direction==="outflow")p.availableMinor+=t.amountMinor;t.status="rejected";}
  else{t.status="approved";t.approvedBy=reviewerId;}
  return {...t};
 }
 complete(id:string){
  const t=this.transactions.get(id);if(!t)throw new Error("Transaction not found");
  if(t.status!=="approved")throw new Error("Only approved transactions can be completed");
  const p=this.positions.get(t.accountId)!.get(t.currency)!;
  if(t.direction==="outflow"){p.balanceMinor-=t.amountMinor;}else{p.balanceMinor+=t.amountMinor;p.availableMinor+=t.amountMinor;}
  t.status="completed";return {...t};
 }
 listTransactions(){return [...this.transactions.values()].map(t=>({...t}));}
 dashboard(){const fx=this.fxExposure();const forecast=this.forecast();const risks=this.listCounterparties();return {baseCurrency:"GBP",totalCashGbpMinor:fx.netGbpMinor,projectedCashGbpMinor:forecast.totals.reduce((s,t)=>s+round(t.projectedClosingMinor*this.fx[t.currency]),0),counterpartyLimitUtilisation:risks.map(c=>({counterparty:c.name,utilisation:c.utilisation})),pendingApprovals:[...this.transactions.values()].filter(t=>t.status==="pending").length,fxExposure:fx};}
}
