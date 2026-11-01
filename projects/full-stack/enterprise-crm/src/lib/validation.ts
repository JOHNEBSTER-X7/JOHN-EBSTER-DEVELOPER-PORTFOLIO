import { z } from "zod";

export const contactStatuses = ["LEAD", "QUALIFIED", "CUSTOMER", "INACTIVE"] as const;

export const contactInputSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  status: z.enum(contactStatuses).optional(),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const contactUpdateSchema = contactInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field is required" },
);
