import { z } from 'zod';

// ============================================================================
// ZOD SCHEMAS (PAM Pattern - Schemas are source of truth)
// ============================================================================

/**
 * Calculate Brutto Request Schema
 * Input validation for brutto calculation from netto amount
 */
export const CalculateBruttoRequestSchema = z.object({
  flowId: z.string(),
  employeeId: z.string(),
  month: z.string().regex(/^(0[1-9]|1[0-2])$/), // "01" to "12"
  year: z.string().regex(/^20\d{2}$/), // "2020" to "2099"
  netto: z.number().int().positive(), // In cents
  orgId: z.string(),
  forceRefresh: z.boolean().nullish(), // Skip cache and force fresh payslip analysis
  includeEmployerShare: z.boolean().nullish(), // Return brutto including employer share contributions
  // BMF PAP 2025 Official Parameters
  childrenCount: z.number().int().min(0).max(10).nullish(), // ZKF parameter: Number of children for tax benefits
  monthlyTaxAllowance: z.number().int().min(0).nullish(), // LZZFREIB parameter: Tax-free allowance per month (cents)
  monthlyTaxSurcharge: z.number().int().min(0).nullish(), // LZZHINZU parameter: Tax surcharge per month (cents)
  isOver64: z.boolean().nullish(), // ALTER1 parameter: Age relief for employees 64+
});

/**
 * Calculate Brutto Response Schema
 * Output from brutto calculation flow
 */
export const CalculateBruttoResponseSchema = z.object({
  flowId: z.string(),
  brutto: z.number(), // in cents
  confidence: z.number(), // 0-1
  reasoning: z.string().optional(),
  month: z.string(),
  year: z.string(),
  bruttoEmployeeShare: z.number().optional(), // Brutto considering only employee contributions
  employerContribution: z.number().optional(), // Employer social-security contribution amount (cents)
  bruttoIncludingEmployerShare: z.number().optional(), // Brutto plus employer contribution (cents)
  employerContributionBreakdown: z.object({
    healthInsurance: z.number().optional(),
    pensionInsurance: z.number().optional(),
    unemploymentInsurance: z.number().optional(),
    careInsurance: z.number().optional(),
  }).optional(),
});

// ============================================================================
// TYPESCRIPT TYPES (Derived from Zod schemas)
// ============================================================================

export type CalculateBruttoRequest = z.infer<typeof CalculateBruttoRequestSchema>;
export type CalculateBruttoResponse = z.infer<typeof CalculateBruttoResponseSchema>;

// ============================================================================
// RE-EXPORTS FROM EMPLOYEES.TYPES.TS (Single source of truth)
// ============================================================================

export type { ParsedPayslipData, BMFTaxInfo } from './employees.types';
