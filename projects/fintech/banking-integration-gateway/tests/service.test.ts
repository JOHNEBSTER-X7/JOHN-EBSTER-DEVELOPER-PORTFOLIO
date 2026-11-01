import {describe,it,expect} from "vitest";
import {IntegrationGatewayService,IntegrationEvent} from "../src/service";
const event=(eventId="event-pay-0001"):IntegrationEvent=>({eventId,eventType:"payments.payment.status_changed",schemaVersion:"1.0",source:"payments",occurredAt:"2026-11-01T10:00:00.000Z",correlationId:"corr-001",subjectId:"payment-001",payload:{status:"settled",amountMinor:1200,currency:"GBP"}});
describe("Integration gateway service",()=>{
 it("routes a published event to configured consumers",()=>{const s=new IntegrationGatewayService();const r=s.publish(event(),"payments");expect(r.duplicate).toBe(false);expect(r.deliveries.map(d=>d.consumer)).toEqual(["operations-command-centre","treasury-read-model","fraud-monitoring"]);});
 it("deduplicates repeated event identifiers",()=>{const s=new IntegrationGatewayService();s.publish(event(),"payments");const r=s.publish(event(),"payments");expect(r.duplicate).toBe(true);expect(s.events).toHaveLength(1);expect(s.deliveries).toHaveLength(3);});
 it("tracks published events and delivery totals",()=>{const s=new IntegrationGatewayService();s.publish(event(),"payments");expect(s.summary().eventsAccepted).toBe(1);expect(s.summary().delivered).toBe(3);});
 it("keeps source domains and consumers explicit",()=>{const s=new IntegrationGatewayService();expect(s.summary().domains).toHaveLength(6);expect(s.summary().domains.every(d=>d.adapterMode==="simulated")).toBe(true);});
 it("retrieves an event by its event identifier",()=>{const s=new IntegrationGatewayService();s.publish(event(),"payments");expect(s.getEvent("event-pay-0001").subjectId).toBe("payment-001");});
 it("rejects unknown event identifiers",()=>{const s=new IntegrationGatewayService();expect(()=>s.getEvent("missing")).toThrow(/not found/);});
 it("retries a failed delivery and records an audit event",()=>{const s=new IntegrationGatewayService();const d=s.publish(event(),"payments").deliveries[0];d.status="failed";const result=s.retry(d.id,"gateway-operator");expect(result.status).toBe("delivered");expect(result.attempts).toBe(2);expect(s.audit[0].action).toBe("delivery.retry");});
 it("moves a delivery to dead letter after retry limit",()=>{const s=new IntegrationGatewayService();const d=s.publish(event(),"payments").deliveries[0];d.status="failed";d.attempts=2;expect(s.retry(d.id,"operator").status).toBe("dead_letter");expect(s.summary().deadLetter).toBe(1);});
 it("prevents retrying delivered or dead-letter records",()=>{const s=new IntegrationGatewayService();const d=s.publish(event(),"payments").deliveries[0];expect(()=>s.retry(d.id,"operator")).toThrow(/Successful/);d.status="dead_letter";expect(()=>s.retry(d.id,"operator")).toThrow(/operator intervention/);});
 it("rejects unknown delivery identifiers",()=>{const s=new IntegrationGatewayService();expect(()=>s.retry("missing","operator")).toThrow(/not found/);});
});
