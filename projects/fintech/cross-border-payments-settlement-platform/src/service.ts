import { randomUUID } from "node:crypto";

export type Currency = "GBP" | "USD" | "EUR";
export type PaymentStatus = "screening_pending" | "held" | "approved" | "queued" | "in_transit" | "settled" | "rejected" | "returned" | "cancelled";
type Account = { id:string; name:string; currency:Currency; balanceMinor:number; reservedMinor:number };
type Beneficiary = { id:string; name:string; country:string; accountReference:string; bankBic:string; currency:Currency };
type FxQuote = { id:string; from:Currency; to:Currency; rateScaled:string; expiresAt:string; accepted:boolean };
type Payment = { id:string; idempotencyKey:string; sourceAccountId:string; beneficiaryId:string; sourceAmountMinor:number; sourceCurrency:Currency; targetAmountMinor:number; targetCurrency:Currency; fxQuoteId?:string; rail:"internal"|"swift_simulation"|"iso20022_simulation"; status:PaymentStatus; createdAt:string; approvedBy?:string; route:string[]; screeningReasons:string[]; messageReference:string };
type Audit = { id:string; at:string; actor:string; action:string; entityId:string; detail?:string };
type StatementLine = { reference:string; amountMinor:number; currency:Currency };
const nowIso = () => new Date().toISOString();
const currencies:Currency[] = ["GBP","USD","EUR"];
const roundDiv = (n:bigint,d:bigint) => (n + d/2n) / d;
const escapeXml = (s:string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");

export class PaymentsService {
  accounts:Account[] = [
    {id:"acc-gbp-001",name:"Northstar Operating GBP",currency:"GBP",balanceMinor:25_000_000,reservedMinor:0},
    {id:"acc-usd-001",name:"Northstar Settlement USD",currency:"USD",balanceMinor:40_000_000,reservedMinor:0},
    {id:"acc-eur-001",name:"Northstar Treasury EUR",currency:"EUR",balanceMinor:18_000_000,reservedMinor:0}
  ];
  beneficiaries:Beneficiary[] = [
    {id:"ben-001",name:"Harbour Components Ltd",country:"GB",accountReference:"GB00NSTAR0001",bankBic:"NSTARGB2L",currency:"GBP"},
    {id:"ben-002",name:"Atlantic Supply Inc",country:"US",accountReference:"US00NSTAR0002",bankBic:"NSTARUS33",currency:"USD"},
    {id:"ben-003",name:"Euro Parts GmbH",country:"DE",accountReference:"DE00NSTAR0003",bankBic:"NSTARDEFF",currency:"EUR"}
  ];
  quotes:FxQuote[]=[];
  payments:Payment[]=[];
  audit:Audit[]=[];
  statements:StatementLine[]=[];
  reconciliation:{matched:string[];unmatched:string[];missing:string[]}={matched:[],unmatched:[],missing:[]};
  private record(actor:string,action:string,entityId:string,detail?:string){this.audit.push({id:randomUUID(),at:nowIso(),actor,action,entityId,detail});}
  private account(id:string){const a=this.accounts.find(x=>x.id===id);if(!a)throw new Error("Account not found");return a;}
  private beneficiary(id:string){const b=this.beneficiaries.find(x=>x.id===id);if(!b)throw new Error("Beneficiary not found");return b;}
  private payment(id:string){const p=this.payments.find(x=>x.id===id);if(!p)throw new Error("Payment not found");return p;}
  createQuote(from:Currency,to:Currency,rate:number,ttlSeconds=120){
    if(!currencies.includes(from)||!currencies.includes(to)||from===to||!Number.isFinite(rate)||rate<=0||rate>1000)throw new Error("Invalid FX quote");
    const q:FxQuote={id:randomUUID(),from,to,rateScaled:BigInt(Math.round(rate*1e8)).toString(),expiresAt:new Date(Date.now()+ttlSeconds*1000).toISOString(),accepted:false};
    this.quotes.push(q);this.record("treasury-operator","fx.quote.created",q.id,`${from}/${to}`);return q;
  }
  acceptQuote(id:string){const q=this.quotes.find(x=>x.id===id);if(!q)throw new Error("FX quote not found");if(Date.now()>Date.parse(q.expiresAt))throw new Error("FX quote expired");q.accepted=true;this.record("treasury-operator","fx.quote.accepted",id);return q;}
  createPayment(input:{idempotencyKey:string;sourceAccountId:string;beneficiaryId:string;amountMinor:number;currency:Currency;fxQuoteId?:string;rail?:"internal"|"swift_simulation"|"iso20022_simulation"}){
    if(!input.idempotencyKey.trim())throw new Error("Idempotency key required");
    if(!Number.isSafeInteger(input.amountMinor)||input.amountMinor<=0)throw new Error("Amount must be a positive integer in minor units");
    const prior=this.payments.find(p=>p.idempotencyKey===input.idempotencyKey);
    if(prior){if(prior.sourceAccountId!==input.sourceAccountId||prior.beneficiaryId!==input.beneficiaryId||prior.sourceAmountMinor!==input.amountMinor||prior.sourceCurrency!==input.currency)throw new Error("Idempotency key reused with a different payment payload");return prior;}
    const source=this.account(input.sourceAccountId),ben=this.beneficiary(input.beneficiaryId);
    if(source.currency!==input.currency)throw new Error("Payment currency must match source account currency");
    let targetAmount=input.amountMinor;
    if(ben.currency!==input.currency){
      const q=this.quotes.find(x=>x.id===input.fxQuoteId);
      if(!q||!q.accepted||q.from!==input.currency||q.to!==ben.currency)throw new Error("An accepted matching FX quote is required");
      if(Date.now()>Date.parse(q.expiresAt))throw new Error("FX quote expired");
      targetAmount=Number(roundDiv(BigInt(input.amountMinor)*BigInt(q.rateScaled),100_000_000n));
    } else if(input.fxQuoteId) throw new Error("FX quote not required for same-currency payment");
    if(!Number.isSafeInteger(targetAmount)||targetAmount<=0)throw new Error("Converted amount is invalid");
    const p:Payment={id:randomUUID(),idempotencyKey:input.idempotencyKey,sourceAccountId:source.id,beneficiaryId:ben.id,sourceAmountMinor:input.amountMinor,sourceCurrency:input.currency,targetAmountMinor:targetAmount,targetCurrency:ben.currency,fxQuoteId:input.fxQuoteId,rail:input.rail??"iso20022_simulation",status:"screening_pending",createdAt:nowIso(),route:ben.country==="GB"?["NORTHSTAR-GB-SETTLEMENT"]:["NORTHSTAR-GB-SETTLEMENT",ben.bankBic],screeningReasons:[],messageReference:`NS${Date.now()}`};
    this.payments.push(p);this.record("payments-api","payment.created",p.id,p.rail);return p;
  }
  screen(id:string){
    const p=this.payment(id);if(p.status!=="screening_pending")throw new Error("Payment is not awaiting screening");
    const b=this.beneficiary(p.beneficiaryId),reasons:string[]=[];
    if(["IR","KP","SY"].includes(b.country))reasons.push("Destination country is flagged in the synthetic demo rules");
    if(/watchlist|sanction/i.test(b.name))reasons.push("Synthetic name-screening match");
    p.screeningReasons=reasons;p.status=reasons.length?"held":"approved";this.record("compliance-reviewer","payment.screened",id,reasons.join(";")||"No demo-rule match");return p;
  }
  approve(id:string,actor:string){
    const p=this.payment(id);if(p.status!=="approved")throw new Error("Payment must pass screening before approval");
    if(!actor.trim()||actor==="payments-api")throw new Error("A named independent approver is required");
    if(this.audit.some(a=>a.entityId===id&&a.action==="payment.created"&&a.actor===actor))throw new Error("Maker cannot approve own payment");
    const a=this.account(p.sourceAccountId),available=a.balanceMinor-a.reservedMinor;
    if(available<p.sourceAmountMinor)throw new Error("Insufficient available balance");
    a.reservedMinor+=p.sourceAmountMinor;p.approvedBy=actor;p.status="queued";this.record(actor,"payment.approved",id);return p;
  }
  dispatch(id:string){const p=this.payment(id);if(p.status!=="queued")throw new Error("Payment must be queued before dispatch");p.status="in_transit";this.record("settlement-operator","payment.dispatched",id);return p;}
  settle(id:string){
    const p=this.payment(id);if(p.status!=="in_transit")throw new Error("Payment must be in transit before settlement");
    const source=this.account(p.sourceAccountId);source.reservedMinor-=p.sourceAmountMinor;source.balanceMinor-=p.sourceAmountMinor;
    const internal=this.accounts.find(a=>a.id===p.beneficiaryId);
    if(internal&&internal.currency===p.targetCurrency)internal.balanceMinor+=p.targetAmountMinor;
    p.status="settled";this.record("settlement-operator","payment.settled",id);return p;
  }
  returnPayment(id:string,reason:string){
    const p=this.payment(id);if(p.status!=="settled"&&p.status!=="in_transit"&&p.status!=="queued")throw new Error("Payment cannot be returned from its current state");
    const source=this.account(p.sourceAccountId);
    if(p.status==="queued"||p.status==="in_transit"){source.reservedMinor-=p.sourceAmountMinor;}
    else {source.balanceMinor+=p.sourceAmountMinor;}
    p.status="returned";this.record("settlement-operator","payment.returned",id,reason);return p;
  }
  reject(id:string,reason:string){const p=this.payment(id);if(p.status!=="held"&&p.status!=="approved")throw new Error("Payment cannot be rejected from its current state");p.status="rejected";this.record("compliance-reviewer","payment.rejected",id,reason);return p;}
  cancel(id:string){const p=this.payment(id);if(p.status!=="screening_pending"&&p.status!=="held"&&p.status!=="approved")throw new Error("Payment cannot be cancelled from its current state");p.status="cancelled";this.record("payments-operator","payment.cancelled",id);return p;}
  message(id:string){
    const p=this.payment(id),b=this.beneficiary(p.beneficiaryId);
    if(p.rail==="swift_simulation")return `{1:F01NSTARGB2L0000000000}{2:I103${b.bankBic}N}{4:\n:20:${p.messageReference}\n:32A:${p.targetCurrency}${p.targetAmountMinor}\n:59:${escapeXml(b.name)}\n:70:Portfolio simulation only\n-}`;
    return `<?xml version="1.0" encoding="UTF-8"?>\n<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08"><FIToFICstmrCdtTrf><GrpHdr><MsgId>${p.messageReference}</MsgId><CreDtTm>${p.createdAt}</CreDtTm></GrpHdr><CdtTrfTxInf><PmtId><EndToEndId>${p.id}</EndToEndId></PmtId><IntrBkSttlmAmt Ccy="${p.targetCurrency}">${(p.targetAmountMinor/100).toFixed(2)}</IntrBkSttlmAmt><Cdtr><Nm>${escapeXml(b.name)}</Nm></Cdtr><CdtrAcct><Id><Othr><Id>${escapeXml(b.accountReference)}</Id></Othr></Id></CdtrAcct></CdtTrfTxInf></FIToFICstmrCdtTrf></Document>`;
  }
  importStatement(lines:StatementLine[]){
    this.statements=lines;const settled=this.payments.filter(p=>p.status==="settled");
    const matched:string[]=[],unmatched:string[]=[];
    for(const line of lines){const p=settled.find(x=>x.messageReference===line.reference&&x.targetAmountMinor===line.amountMinor&&x.targetCurrency===line.currency);if(p)matched.push(line.reference);else unmatched.push(line.reference);}
    const missing=settled.filter(p=>!lines.some(l=>l.reference===p.messageReference&&l.amountMinor===p.targetAmountMinor&&l.currency===p.targetCurrency)).map(p=>p.messageReference);
    this.reconciliation={matched,unmatched,missing};this.record("reconciliation-service","statement.imported",randomUUID(),`${lines.length} lines`);return this.reconciliation;
  }
  dashboard(){return {accounts:this.accounts.map(a=>({...a,availableMinor:a.balanceMinor-a.reservedMinor})),paymentsByStatus:this.payments.reduce((o,p)=>({...o,[p.status]:(o[p.status]??0)+1}),{} as Record<string,number>),paymentCount:this.payments.length,reservedLiquidity:this.accounts.reduce((s,a)=>s+a.reservedMinor,0),fxQuotes:this.quotes.length,settledCount:this.payments.filter(p=>p.status==="settled").length,reconciliation:this.reconciliation};}
}
