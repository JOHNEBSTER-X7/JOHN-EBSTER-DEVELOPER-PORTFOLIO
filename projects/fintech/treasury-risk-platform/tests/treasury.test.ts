import {describe,it,expect} from "vitest";
import {Treasury} from "../src/treasury";
describe("Treasury and risk domain",()=>{
 it("returns multi-currency positions and GBP FX valuation",()=>{const t=new Treasury();expect(t.getPositions()).toHaveLength(4);expect(t.fxExposure().netGbpMinor).toBeGreaterThan(0);});
 it("builds a dated liquidity forecast",()=>{const t=new Treasury();expect(t.forecast().flows.length).toBe(7);expect(t.forecast().totals).toHaveLength(4);});
 it("adds validated forecast flows",()=>{const t=new Treasury();expect(t.addFlow({date:"2026-12-01",currency:"GBP",amountMinor:1000,kind:"inflow",description:"Invoice"}).amountMinor).toBe(1000);});
 it("calculates FX stress impact",()=>{const t=new Treasury();const r=t.stressTest({USD:-0.1});expect(r.results.find(x=>x.currency==="USD")?.impactGbpMinor).toBeLessThan(0);});
 it("rejects excessive FX shock",()=>{expect(()=>new Treasury().stressTest({EUR:-1.5})).toThrow("FX shock");});
 it("calculates counterparty headroom",()=>{const cp=new Treasury().listCounterparties()[0];expect(cp.headroomGbpMinor).toBe(cp.limitGbpMinor-cp.exposureGbpMinor);});
 it("requires independent approval and completes approved outflow",()=>{const t=new Treasury();const p=t.getPositions()[0];const x=t.propose({accountId:"treasury-demo",currency:"GBP",amountMinor:1000,direction:"outflow",description:"Settlement"});expect(()=>t.decide(x.id,"treasury-demo","approve")).toThrow("Independent reviewer");t.decide(x.id,"reviewer-1","approve");expect(t.complete(x.id).status).toBe("completed");expect(t.getPositions()[0].balanceMinor).toBe(p.balanceMinor-1000);});
 it("releases reserved funds on rejection",()=>{const t=new Treasury();const before=t.getPositions()[0].availableMinor;const x=t.propose({accountId:"treasury-demo",currency:"GBP",amountMinor:1000,direction:"outflow",description:"Vendor payment"});t.decide(x.id,"reviewer","reject");expect(t.getPositions()[0].availableMinor).toBe(before);});
 it("prevents completion before approval",()=>{const t=new Treasury();const x=t.propose({accountId:"treasury-demo",currency:"GBP",amountMinor:1000,direction:"inflow",description:"Receipt"});expect(()=>t.complete(x.id)).toThrow("Only approved");});
 it("reports pending approvals in dashboard",()=>{const t=new Treasury();t.propose({accountId:"treasury-demo",currency:"GBP",amountMinor:1000,direction:"inflow",description:"Receipt"});expect(t.dashboard().pendingApprovals).toBe(1);});
});
