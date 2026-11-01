import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { BankingPlatform } from "../src/platform";

describe("Northstar Banking & Payments API", () => {
  let platform: BankingPlatform;
  let app: ReturnType<typeof createApp>;
  let customerId: string;
  let merchantId: string;
  beforeEach(async () => {
    platform = new BankingPlatform(); app = createApp(platform);
    const customer = await request(app).post("/api/parties").send({kind:"customer",legalName:"Sample Customer Ltd",email:"customer@example.test",country:"GB"});
    const merchant = await request(app).post("/api/parties").send({kind:"merchant",legalName:"Sample Merchant Ltd",email:"merchant@example.test",country:"GB"});
    customerId = customer.body.id; merchantId = merchant.body.id;
    await request(app).post(`/api/parties/${customerId}/kyc-review`).send({decision:"approved",reviewerRef:"reviewer-001"});
    await request(app).post(`/api/parties/${merchantId}/kyc-review`).send({decision:"approved",reviewerRef:"reviewer-002"});
  });
  const paymentPayload = (customerId:string,merchantId:string,key="payment-key-001",amount=2500) => ({
    reference:"PAY-1001",customerId,merchantId,amountCents:amount,currency:"GBP",idempotencyKey:key
  });

  it("reports health and metrics", async () => {
    expect((await request(app).get("/api/health")).body.status).toBe("ok");
    expect((await request(app).get("/api/metrics")).body.parties).toBe(2);
  });
  it("creates pending customer and merchant onboarding records", async () => {
    const p = await request(app).post("/api/parties").send({kind:"customer",legalName:"Third Customer",email:"third@example.test",country:"GB"});
    expect(p.status).toBe(201); expect(p.body.kycStatus).toBe("pending");
  });
  it("blocks payment until both parties are approved", async () => {
    const pending = await request(app).post("/api/parties").send({kind:"customer",legalName:"Pending Person",email:"pending@example.test",country:"GB"});
    const response = await request(app).post("/api/payments").send(paymentPayload(pending.body.id,merchantId));
    expect(response.status).toBe(409);
  });
  it("requires a manual simulated review decision", async () => {
    const p = await request(app).post("/api/parties").send({kind:"customer",legalName:"Rejected Applicant",email:"reject@example.test",country:"GB"});
    const r = await request(app).post(`/api/parties/${p.body.id}/kyc-review`).send({decision:"rejected",reviewerRef:"analyst-1"});
    expect(r.body.kycStatus).toBe("rejected");
    expect(platform.listAlerts()).toHaveLength(1);
  });
  it("creates a settled low-risk payment", async () => {
    const r = await request(app).post("/api/payments").send(paymentPayload(customerId,merchantId));
    expect(r.status).toBe(201); expect(r.body.status).toBe("settled"); expect(r.body.riskLevel).toBe("low");
  });
  it("returns the original payment for a repeated idempotency key", async () => {
    const payload = paymentPayload(customerId,merchantId);
    const first = await request(app).post("/api/payments").send(payload);
    const second = await request(app).post("/api/payments").send({...payload,reference:"RETRY"});
    expect(second.body.id).toBe(first.body.id);
    expect(platform.listPayments()).toHaveLength(1);
  });
  it("flags high-value payment for review before settlement", async () => {
    const r = await request(app).post("/api/payments").send(paymentPayload(customerId,merchantId,"high-value-001",1_500_000));
    expect(r.body.status).toBe("authorised"); expect(r.body.riskLevel).toBe("high");
    expect(platform.listAlerts()).toHaveLength(1);
    const settled = await request(app).post(`/api/payments/${r.body.id}/settle`);
    expect(settled.body.status).toBe("settled");
  });
  it("supports a full refund and blocks a second refund", async () => {
    const p = await request(app).post("/api/payments").send(paymentPayload(customerId,merchantId));
    const refund = await request(app).post(`/api/payments/${p.body.id}/refunds`).send({amountCents:2500,reason:"Customer cancellation"});
    expect(refund.status).toBe(201);
    const again = await request(app).post(`/api/payments/${p.body.id}/refunds`).send({amountCents:2500,reason:"Duplicate"});
    expect(again.status).toBe(409);
  });
  it("opens a dispute and records its reviewed outcome", async () => {
    const p = await request(app).post("/api/payments").send(paymentPayload(customerId,merchantId));
    const d = await request(app).post(`/api/payments/${p.body.id}/disputes`).send({reason:"Service not received"});
    expect(d.status).toBe(201); expect(d.body.status).toBe("open");
    const reviewed = await request(app).post(`/api/disputes/${d.body.id}/review`).send({outcome:"won"});
    expect(reviewed.body.status).toBe("won");
    expect(platform.getPayment(p.body.id)?.status).toBe("settled");
  });
  it("allows compliance alerts to be reviewed", async () => {
    const p = await request(app).post("/api/payments").send(paymentPayload(customerId,merchantId,"high-risk-002",1_200_000));
    const alert = platform.listAlerts()[0];
    const reviewed = await request(app).post(`/api/compliance/alerts/${alert.id}/review`);
    expect(reviewed.body.status).toBe("reviewed");
    expect(p.body.riskLevel).toBe("high");
  });
  it("rejects malformed onboarding and non-positive payments", async () => {
    const badParty = await request(app).post("/api/parties").send({kind:"customer",legalName:"x",email:"not-email",country:"United Kingdom"});
    expect(badParty.status).toBe(400);
    const badPayment = await request(app).post("/api/payments").send(paymentPayload(customerId,merchantId,"bad-amount-001",0));
    expect(badPayment.status).toBe(400);
  });
  it("prevents duplicate entity emails", async () => {
    const duplicate = await request(app).post("/api/parties").send({kind:"customer",legalName:"Duplicate Customer",email:"customer@example.test",country:"GB"});
    expect(duplicate.status).toBe(409);
  });
});
