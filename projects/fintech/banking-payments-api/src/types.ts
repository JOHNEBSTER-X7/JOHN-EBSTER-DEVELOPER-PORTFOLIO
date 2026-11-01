export type PartyKind = "customer" | "merchant";
export type KycStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "authorised" | "settled" | "failed" | "refunded" | "disputed";
export type RiskLevel = "low" | "medium" | "high";
export interface Party {
  id: string; kind: PartyKind; legalName: string; email: string; country: string;
  kycStatus: KycStatus; createdAt: string; reviewedAt?: string; reviewerRef?: string;
}
export interface Payment {
  id: string; reference: string; customerId: string; merchantId: string;
  amountCents: number; currency: string; status: PaymentStatus;
  riskScore: number; riskLevel: RiskLevel; idempotencyKey: string;
  createdAt: string; updatedAt: string;
}
export interface Refund {
  id: string; paymentId: string; amountCents: number; reason: string; createdAt: string;
}
export interface Dispute {
  id: string; paymentId: string; reason: string; status: "open" | "under_review" | "won" | "lost";
  createdAt: string;
}
export interface ComplianceAlert {
  id: string; type: string; severity: RiskLevel; entityId: string;
  message: string; status: "open" | "reviewed"; createdAt: string;
}
