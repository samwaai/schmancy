// melanie/types/cop-validation.types.ts
import { z } from "zod";

/**
 * Request type for Confirmation of Payee validation
 */
export interface ConfirmationOfPayeeRequest {
  orgId: string;
  employeeId: string;
  iban: string;
  firstName: string;
  lastName: string;
  recipientCountry?: string;
  recipientCurrency?: string;
}

/**
 * Response type for Confirmation of Payee validation
 */
export interface ConfirmationOfPayeeResponse {
  status: 'matched' | 'close_match' | 'not_matched' | 'cannot_be_checked' | 'not_verified';
  actualName?: string;
  validatedAt: string;
  retryAttempts: Array<{
    attempt: number;
    profileType: 'personal' | 'business';
    resultCode: string;
    succeeded: boolean;
  }>;
  error?: string;
}

/**
 * Zod schema for request validation
 */
export const ConfirmationOfPayeeRequestSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  iban: z.string().min(15, "Valid IBAN is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  recipientCountry: z.string().optional(),
  recipientCurrency: z.string().optional(),
});

/**
 * Zod schema for public CoP request validation (no auth required)
 */
export const PublicConfirmationOfPayeeRequestSchema = z.object({
  iban: z.string().min(15, "Valid IBAN is required"),
  name: z.string().min(1, "Name is required"),
});

/**
 * Zod schema for response validation
 */
export const ConfirmationOfPayeeResponseSchema = z.object({
  status: z.enum(['matched', 'close_match', 'not_matched', 'cannot_be_checked', 'not_verified']),
  actualName: z.string().optional(),
  validatedAt: z.string(),
  retryAttempts: z.array(z.object({
    attempt: z.number(),
    profileType: z.enum(['personal', 'business']),
    resultCode: z.string(),
    succeeded: z.boolean(),
  })),
  error: z.string().optional(),
});
