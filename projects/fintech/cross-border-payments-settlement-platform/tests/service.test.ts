import { describe,it,expect,beforeEach } from "vitest";
import { PaymentsService } from "../src/service";

describe("Northstar cross-border payments service",()=>{
 let s:PaymentsService;
 beforeEach(()=>{s=new PaymentsService();});
 const domestic=()=>s.createPayment({idempotencyKey:"p-001",sourceAccountId:"acc-gbp-001",beneficiaryId:"ben-001",amountMinor:12500,currency:"GBP"});
 const settle=(id:string)=>{s.screen(id);s.approve(id,"independent-checker");s.dispatch(id);s.settle(id);};
 it("creates a payment and returns the same record for an identical idempotent request",()=>{const a=domestic(),b=domestic();expect(a.id).toBe(b.id);expect(s.payments).toHaveLength(1);});
 it("rejects reuse of an idempotency key with a different payload",()=>{domestic();expect(()=>s.createPayment({idempotencyKey:"p-001",sourceAccountId:"acc-gbp-001",beneficiaryId:"ben-001",amountMinor:12501,currency:"GBP"})).toThrow(/different payment payload/);});
 it("requires source account currency to match the payment currency",()=>expect(()=>s.createPayment({idempotencyKey:"x",sourceAccountId:"acc-usd-001",beneficiaryId:"ben-001",amountMinor:100,currency:"GBP"})).toThrow(/match source account/));
 it("requires an accepted FX quote and calculates target minor units",()=>{const q=s.createQuote("GBP","USD",1.25);s.acceptQuote(q.id);const p=s.createPayment({idempotencyKey:"fx-1",sourceAccountId:"acc-gbp-001",beneficiaryId:"ben-002",amountMinor:10001,currency:"GBP",fxQuoteId:q.id});expect(p.targetAmountMinor).toBe(12501);});
 it("rejects an expired FX quote",()=>{const q=s.createQuote("GBP","USD",1.2);q.expiresAt=new Date(Date.now()-1000).toISOString();expect(()=>s.acceptQuote(q.id)).toThrow(/expired/);});
 it("holds a payment when the synthetic destination-country rule matches",()=>{const p=s.createPayment({idempotencyKey:"risk",sourceAccountId:"acc-gbp-001",beneficiaryId:"ben-001",amountMinor:100,currency:"GBP"});s.beneficiaries[0].country="IR";expect(s.screen(p.id).status).toBe("held");});
 it("prevents approval before screening and maker approval",()=>{const p=domestic();expect(()=>s.approve(p.id,"checker")).toThrow(/pass screening/);s.screen(p.id);expect(()=>s.approve(p.id,"payments-api")).toThrow(/independent approver/);});
 it("reserves liquidity on approval and releases it on settlement",()=>{const p=domestic();s.screen(p.id);const before=s.accounts[0].balanceMinor;s.approve(p.id,"checker");expect(s.accounts[0].reservedMinor).toBe(12500);s.dispatch(p.id);s.settle(p.id);expect(s.accounts[0].balanceMinor).toBe(before-12500);expect(s.accounts[0].reservedMinor).toBe(0);});
 it("blocks dispatch and settlement out of sequence",()=>{const p=domestic();expect(()=>s.dispatch(p.id)).toThrow(/queued/);s.screen(p.id);s.approve(p.id,"checker");expect(()=>s.settle(p.id)).toThrow(/in transit/);});
 it("rejects a payment when available liquidity is insufficient",()=>{const p=s.createPayment({idempotencyKey:"large",sourceAccountId:"acc-gbp-001",beneficiaryId:"ben-001",amountMinor:99_000_000,currency:"GBP"});s.screen(p.id);expect(()=>s.approve(p.id,"checker")).toThrow(/Insufficient/);});
 it("supports return after settlement and restores source funds",()=>{const p=domestic();settle(p.id);const balance=s.accounts[0].balanceMinor;s.returnPayment(p.id,"Beneficiary bank returned funds");expect(p.status).toBe("returned");expect(s.accounts[0].balanceMinor).toBe(balance+12500);});
 it("generates an ISO 20022-style XML payment message",()=>{const p=domestic();expect(s.message(p.id)).toContain("pacs.008.001.08");expect(s.message(p.id)).toContain("Harbour Components Ltd");});
 it("matches statement lines and reports unmatched and missing items",()=>{const p=domestic();settle(p.id);const result=s.importStatement([{reference:p.messageReference,amountMinor:p.targetAmountMinor,currency:"GBP"},{reference:"UNKNOWN",amountMinor:50,currency:"USD"}]);expect(result.matched).toContain(p.messageReference);expect(result.unmatched).toContain("UNKNOWN");expect(result.missing).toEqual([]);});
 it("records operational actions in the audit trail",()=>{const p=domestic();s.screen(p.id);expect(s.audit.map(a=>a.action)).toContain("payment.screened");});
});
