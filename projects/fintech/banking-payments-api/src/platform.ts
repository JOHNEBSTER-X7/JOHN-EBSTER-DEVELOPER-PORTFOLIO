import { randomUUID } from "node:crypto";
import type { ComplianceAlert, Dispute, KycStatus, Party, PartyKind, Payment, PaymentStatus, Refund, RiskLevel } from "./types";

export class PlatformError extends Error {
  constructor(message: string, public statusCode = 400) { super(message); this.name = "PlatformError"; }
}

export class BankingPlatform {
  private parties = new Map<string, Party>();
  private payments = new Map<string, Payment>();
  private refunds = new Map<string, Refund>();
  private disputes = new Map<string, Dispute>();
  private alerts = new Map<string, ComplianceAlert>();
  private idempotency = new Map<string, Payment>();

  createParty(input: {kind: PartyKind; legalName: string; email: string; country: string}): Party {
    const email = input.email.trim().toLowerCase();
    if ([...this.parties.values()].some(p => p.email === email)) throw new PlatformError("An entity with this email already exists.", 409);
    const party: Party = { id: randomUUID(), ...input, email, country: input.country.toUpperCase(), kycStatus: "pending", createdAt: new Date().toISOString() };
    this.parties.set(party.id, party);
    return party;
  }

  listParties() { return [...this.parties.values()]; }
  getParty(id: string) { return this.parties.get(id); }

  reviewKyc(id: string, decision: Exclude<KycStatus, "pending">, reviewerRef: string): Party {
    const party = this.parties.get(id);
    if (!party) throw new PlatformError("Entity not found.", 404);
    if (party.kycStatus !== "pending") throw new PlatformError("Only pending onboarding cases can be reviewed.", 409);
    party.kycStatus = decision;
    party.reviewedAt = new Date().toISOString();
    party.reviewerRef = reviewerRef;
    if (decision === "rejected") this.addAlert("kyc_rejection", "medium", id, "Onboarding review was rejected; investigate and follow internal policy.");
    return party;
  }

  private scoreRisk(amountCents: number, customer: Party, merchant: Party): {score:number; level:RiskLevel; reasons:string[]} {
    let score = 5;
    const reasons: string[] = [];
    if (amountCents >= 1_000_000) { score += 55; reasons.push("High-value transaction threshold reached."); }
    if (customer.country !== merchant.country) { score += 25; reasons.push("Cross-border transaction."); }
    if (amountCents >= 500_000 && amountCents < 1_000_000) { score += 20; reasons.push("Elevated transaction value."); }
    score = Math.min(score, 100);
    return { score, level: score >= 70 ? "high" : score >= 30 ? "medium" : "low", reasons };
  }

  initiatePayment(input: {reference:string; customerId:string; merchantId:string; amountCents:number; currency:string; idempotencyKey:string}): Payment {
    const existing = this.idempotency.get(input.idempotencyKey);
    if (existing) return existing;
    const customer = this.parties.get(input.customerId);
    const merchant = this.parties.get(input.merchantId);
    if (!customer || customer.kind !== "customer") throw new PlatformError("Approved customer record not found.", 404);
    if (!merchant || merchant.kind !== "merchant") throw new PlatformError("Approved merchant record not found.", 404);
    if (customer.kycStatus !== "approved" || merchant.kycStatus !== "approved") throw new PlatformError("Both customer and merchant must pass the simulated onboarding review.", 409);
    if (input.amountCents <= 0 || !Number.isSafeInteger(input.amountCents)) throw new PlatformError("Payment amount must be a positive integer in minor units.");
    const currency = input.currency.toUpperCase();
    const risk = this.scoreRisk(input.amountCents, customer, merchant);
    const payment: Payment = {
      id: randomUUID(), reference: input.reference, customerId: customer.id, merchantId: merchant.id,
      amountCents: input.amountCents, currency, status: risk.level === "high" ? "authorised" : "settled",
      riskScore: risk.score, riskLevel: risk.level, idempotencyKey: input.idempotencyKey,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    this.payments.set(payment.id, payment);
    this.idempotency.set(input.idempotencyKey, payment);
    if (risk.level !== "low") this.addAlert("payment_risk", risk.level, payment.id, risk.reasons.join(" ") || "Payment flagged by deterministic risk rules.");
    return payment;
  }

  listPayments() { return [...this.payments.values()].reverse(); }
  getPayment(id: string) { return this.payments.get(id); }

  settlePayment(id: string): Payment {
    const payment = this.requirePayment(id);
    if (payment.status !== "authorised") throw new PlatformError("Only authorised payments can be settled.", 409);
    payment.status = "settled"; payment.updatedAt = new Date().toISOString();
    return payment;
  }

  refundPayment(id: string, amountCents: number, reason: string): Refund {
    const payment = this.requirePayment(id);
    if (payment.status !== "settled") throw new PlatformError("Only settled payments can be refunded.", 409);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0 || amountCents !== payment.amountCents) {
      throw new PlatformError("This prototype supports one full refund only; amount must equal the payment amount.");
    }
    if ([...this.refunds.values()].some(r => r.paymentId === id)) throw new PlatformError("Payment has already been refunded.", 409);
    const refund: Refund = { id: randomUUID(), paymentId: id, amountCents, reason, createdAt: new Date().toISOString() };
    this.refunds.set(refund.id, refund);
    payment.status = "refunded"; payment.updatedAt = new Date().toISOString();
    return refund;
  }

  openDispute(id: string, reason: string): Dispute {
    const payment = this.requirePayment(id);
    if (payment.status !== "settled") throw new PlatformError("Only settled payments can be disputed.", 409);
    if ([...this.disputes.values()].some(d => d.paymentId === id && d.status !== "lost" && d.status !== "won")) {
      throw new PlatformError("An active dispute already exists for this payment.", 409);
    }
    const dispute: Dispute = { id: randomUUID(), paymentId: id, reason, status: "open", createdAt: new Date().toISOString() };
    this.disputes.set(dispute.id, dispute);
    payment.status = "disputed"; payment.updatedAt = new Date().toISOString();
    this.addAlert("chargeback_dispute", "medium", payment.id, "A simulated chargeback dispute has been opened.");
    return dispute;
  }

  reviewDispute(id: string, outcome: "won" | "lost"): Dispute {
    const dispute = this.disputes.get(id);
    if (!dispute) throw new PlatformError("Dispute not found.", 404);
    if (dispute.status !== "open" && dispute.status !== "under_review") throw new PlatformError("Dispute is already closed.", 409);
    dispute.status = outcome;
    const payment = this.requirePayment(dispute.paymentId);
    payment.status = outcome === "won" ? "settled" : "refunded";
    payment.updatedAt = new Date().toISOString();
    return dispute;
  }

  private requirePayment(id: string): Payment {
    const payment = this.payments.get(id);
    if (!payment) throw new PlatformError("Payment not found.", 404);
    return payment;
  }
  private addAlert(type: string, severity: RiskLevel, entityId: string, message: string) {
    const alert: ComplianceAlert = { id: randomUUID(), type, severity, entityId, message, status: "open", createdAt: new Date().toISOString() };
    this.alerts.set(alert.id, alert);
  }
  listAlerts() { return [...this.alerts.values()].reverse(); }
  reviewAlert(id: string) {
    const alert = this.alerts.get(id);
    if (!alert) throw new PlatformError("Alert not found.", 404);
    alert.status = "reviewed";
    return alert;
  }
  metrics() {
    return {
      parties: this.parties.size, payments: this.payments.size,
      settledPayments: [...this.payments.values()].filter(p => p.status === "settled").length,
      openDisputes: [...this.disputes.values()].filter(d => d.status === "open" || d.status === "under_review").length,
      openAlerts: [...this.alerts.values()].filter(a => a.status === "open").length,
      totalPaymentValueCents: [...this.payments.values()].reduce((sum,p) => sum + p.amountCents, 0)
    };
  }
}
