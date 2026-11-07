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

const publicHttpUrl = z
  .string()
  .trim()
  .url("Enter a complete URL, including https://")
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  }, "Use an http:// or https:// source URL.");

export const feedbackSchema = z.object({
  category: z.enum(requestTypes),
  subject: z
    .string()
    .trim()
    .min(5, "Please enter a specific subject.")
    .max(120),
  details: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters of context.")
    .max(3000),
  sourceUrl: publicHttpUrl.or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal("")),
  website: z.string().max(0),
  turnstileToken: z.string().trim().max(2048).optional(),
});

export type FeedbackSubmission = z.infer<typeof feedbackSchema>;
