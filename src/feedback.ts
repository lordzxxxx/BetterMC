import { z } from "zod";

export const requestTypeOptions = [
  { value: "correction", label: "Suggest a correction" },
  { value: "broken-link", label: "Report a broken link" },
  { value: "document-request", label: "Suggest a public document" },
  { value: "website-feedback", label: "Website feedback" },
] as const;

export type RequestType = (typeof requestTypeOptions)[number]["value"];

const requestTypes = [
  "correction",
  "broken-link",
  "document-request",
  "website-feedback",
] as const;

const optionalPublicHttpUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => {
    if (!value || value === "") return true;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }, "Use an http:// or https:// source URL.");

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine((val) => {
    if (!val || val === "") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }, "Enter a valid email address.");

export const feedbackSchema = z.object({
  category: z.enum(requestTypes),
  subject: z
    .string()
    .trim()
    .min(3, "Please enter a specific subject (at least 3 characters).")
    .max(120),
  details: z
    .string()
    .trim()
    .min(5, "Please provide at least 5 characters of context.")
    .max(3000),
  sourceUrl: optionalPublicHttpUrl,
  email: optionalEmail,
  website: z.string().max(0),
  turnstileToken: z.string().trim().max(2048).optional(),
});

export type FeedbackSubmission = z.infer<typeof feedbackSchema>;
