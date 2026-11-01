import express from "express";
import { z } from "zod";
import { BankingPlatform, PlatformError } from "./platform";

const partySchema = z.object({
  kind: z.enum(["customer", "merchant"]),
  legalName: z.string().trim().min(2).max(160),
  email: z.string().email().max(254),
  country: z.string().regex(/^[A-Za-z]{2}$/)
});
const reviewSchema = z.object({ decision: z.enum(["approved", "rejected"]), reviewerRef: z.string().trim().min(3).max(100) });
const paymentSchema = z.object({
  reference: z.string().trim().min(1).max(100),
  customerId: z.string().uuid(), merchantId: z.string().uuid(),
  amountCents: z.number().int().positive().safe(),
  currency: z.string().regex(/^[A-Za-z]{3}$/),
  idempotencyKey: z.string().trim().min(8).max(120)
});
const refundSchema = z.object({ amountCents: z.number().int().positive().safe(), reason: z.string().trim().min(3).max(500) });
const disputeSchema = z.object({ reason: z.string().trim().min(3).max(500) });
const outcomeSchema = z.object({ outcome: z.enum(["won", "lost"]) });

export function createApp(platform = new BankingPlatform()) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "256kb" }));
  app.get("/api/health", (_req,res) => res.json({status:"ok",service:"northstar-banking-payments"}));
  app.get("/api/metrics", (_req,res) => res.json(platform.metrics()));
  app.get("/api/parties", (_req,res) => res.json(platform.listParties()));
  app.post("/api/parties", (req,res) => {
    const parsed = partySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:"Invalid onboarding request",details:parsed.error.flatten()});
    try { return res.status(201).json(platform.createParty(parsed.data)); } catch(e) { return handleError(e,res); }
  });
  app.post("/api/parties/:id/kyc-review", (req,res) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:"Invalid review decision",details:parsed.error.flatten()});
    try { return res.json(platform.reviewKyc(req.params.id,parsed.data.decision,parsed.data.reviewerRef)); } catch(e) { return handleError(e,res); }
  });
  app.get("/api/payments", (_req,res) => res.json(platform.listPayments()));
  app.post("/api/payments", (req,res) => {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:"Invalid payment request",details:parsed.error.flatten()});
    try { return res.status(201).json(platform.initiatePayment(parsed.data)); } catch(e) { return handleError(e,res); }
  });
  app.post("/api/payments/:id/settle", (req,res) => {
    try { return res.json(platform.settlePayment(req.params.id)); } catch(e) { return handleError(e,res); }
  });
  app.post("/api/payments/:id/refunds", (req,res) => {
    const parsed = refundSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:"Invalid refund request",details:parsed.error.flatten()});
    try { return res.status(201).json(platform.refundPayment(req.params.id,parsed.data.amountCents,parsed.data.reason)); } catch(e) { return handleError(e,res); }
  });
  app.post("/api/payments/:id/disputes", (req,res) => {
    const parsed = disputeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:"Invalid dispute request",details:parsed.error.flatten()});
    try { return res.status(201).json(platform.openDispute(req.params.id,parsed.data.reason)); } catch(e) { return handleError(e,res); }
  });
  app.post("/api/disputes/:id/review", (req,res) => {
    const parsed = outcomeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({error:"Invalid dispute outcome",details:parsed.error.flatten()});
    try { return res.json(platform.reviewDispute(req.params.id,parsed.data.outcome)); } catch(e) { return handleError(e,res); }
  });
  app.get("/api/compliance/alerts", (_req,res) => res.json(platform.listAlerts()));
  app.post("/api/compliance/alerts/:id/review", (req,res) => {
    try { return res.json(platform.reviewAlert(req.params.id)); } catch(e) { return handleError(e,res); }
  });
  return app;
}
function handleError(error: unknown, res: express.Response) {
  if (error instanceof PlatformError) return res.status(error.statusCode).json({error:error.message});
  return res.status(500).json({error:"Unexpected platform error."});
}
