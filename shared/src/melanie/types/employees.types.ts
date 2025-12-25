// Simplified Employee Types - Version 2

import { z } from 'zod';

export type PaymentType = "flat" | "hourly" | "invoice";
export type RateType = "netto" | "brutto";

// ============================================================================
// ZOD SCHEMAS (PAM Pattern - Schemas are source of truth)
// ============================================================================

/**
 * Parsed Payslip Data (AI extraction output)
 * Contains all extracted values from a payslip, including both numerical data
 * and contextual parameters for accurate German payroll calculations.
 */
export const ParsedPayslipDataSchema = z.object({
  // ============================================================================
  // CORE FINANCIAL DATA (from payslip)
  // ============================================================================
  brutto: z.number(),
  netto: z.number(),
  taxDeductions: z.number(),
  socialSecurityDeductions: z.number(),
  otherDeductions: z.number(),
  confidence: z.number().min(0).max(1),

  // ============================================================================
  // PERSONAL INFORMATION (from this specific payslip)
  // ============================================================================
  personnelNumber: z.string().optional(),          // Pers.-Nr.
  socialSecurityNumber: z.string().optional(),     // SV-Nummer
  taxIdNumber: z.string().optional(),              // Steuer ID Nr.
  dateOfBirth: z.string().optional(),              // Geb.datum
  entryDate: z.string().optional(),                // Eintritt
  exitDate: z.string().optional(),                 // Austritt
  healthInsuranceCompany: z.string().optional(),   // Kasse (e.g., "DAK Gesundheit", "BARMER")
  religion: z.string().optional(),                 // Konfession (e.g., "rk", "ev", "--")
  personnelGroup: z.string().optional(),           // DEÜV Personengruppe: 101=Regular, 109=Minijob, 110=Short-term, 190=Midijob (@see minijob-zentrale.de)
  beitragsgruppe: z.string().optional(),           // BGRS contribution group "X-X-X-X" (KV-RV-AV-PV): 1-1-1-1=Standard, 6-1-0-0=Pauschal KV, 0-1-0-0=Minijob
  department: z.string().optional(),               // Abteilung
  costCenter: z.string().optional(),               // Kst.-St.

  // ============================================================================
  // TAX & INSURANCE CONTEXT (for this payslip period)
  // ============================================================================
  taxClass: z.string().optional(),              // e.g. "1", "3", "5", "6"
  churchTax: z.boolean().optional(),            // true if "rk" or "ev"
  midijob: z.boolean().optional(),              // true if Übergangsbereich = ja
  multipleEmployment: z.boolean().optional(),   // MFB (Multiple Employment Factor)

  // Insurance rates from this payslip
  healthInsuranceRate: z.number().optional(),                 // KV % total rate
  healthInsuranceEmployeeRate: z.number().optional(),         // AN-Beitrag KV % employee share
  healthInsuranceEmployerRate: z.number().optional(),         // KV % employer share (derived)
  pensionInsuranceRate: z.number().optional(),                // RV % total rate
  pensionInsuranceEmployeeRate: z.number().optional(),        // RV % employee share
  pensionInsuranceEmployerRate: z.number().optional(),        // RV % employer share (derived)
  unemploymentInsuranceRate: z.number().optional(),           // AV % total rate
  unemploymentInsuranceEmployeeRate: z.number().optional(),   // AV % employee share
  unemploymentInsuranceEmployerRate: z.number().optional(),   // AV % employer share (derived)
  careInsuranceRate: z.number().optional(),                   // PV % total rate (Beitrag)
  careInsuranceEmployeeRate: z.number().optional(),           // PV % employee share (AN)
  careInsuranceEmployerRate: z.number().optional(),           // PV % employer share (derived)
  careInsuranceSurchargeRate: z.number().optional(),          // PV % surcharge (Zu.)

  // Official BMF PAP 2025 parameters (for caching)
  pensionInsuranceType: z.number().optional(),  // KRV: 0=statutory/occupational, 1=otherwise
  healthInsuranceType: z.number().optional(),   // PKV: 0=statutory, 1=private no subsidy, 2=private with subsidy
  saxonyNursingCare: z.boolean().optional(),    // PVS: Saxony nursing care special rules
  nursingInsuranceSurcharge: z.boolean().optional(), // PVZ: Employee pays surcharge (childless)
  childDependentNursing: z.number().optional(), // PVA: 0-4 children consideration levels
  childrenCount: z.number().optional(),         // ZKF: Number of children for tax benefits (0-10)
  monthlyTaxAllowance: z.number().optional(),   // LZZFREIB: Tax-free allowance per month (cents)
  monthlyTaxSurcharge: z.number().optional(),   // LZZHINZU: Tax surcharge per month (cents)
  isOver64: z.boolean().optional(),             // ALTER1: Age relief for employees 64+

  // ============================================================================
  // DAYS INFORMATION (for this specific payslip period - DYNAMIC)
  // ============================================================================
  svDaysMonthly: z.object({
    kv: z.number().optional(),  // Health insurance days this month
    rv: z.number().optional(),  // Pension insurance days this month
    av: z.number().optional(),  // Unemployment insurance days this month
    pv: z.number().optional(),  // Nursing care days this month
  }).optional(),

  svDaysCumulative: z.object({
    kv: z.number().optional(),  // Health insurance days cumulative
    rv: z.number().optional(),  // Pension insurance days cumulative
    av: z.number().optional(),  // Unemployment insurance days cumulative
    pv: z.number().optional(),  // Nursing care days cumulative
  }).optional(),

  taxDaysMonthly: z.number().optional(),      // St.-Tage monatlich
  taxDaysCumulative: z.number().optional(),   // St.-Tage kumuliert

  // ============================================================================
  // OCCUPATIONAL RISK CATEGORY (from this payslip)
  // ============================================================================
  occupationalRiskCategory: z.object({
    kv: z.number().optional(),  // KV risk category (BGR)
    rv: z.number().optional(),  // RV risk category (BGR)
    av: z.number().optional(),  // AV risk category (BGR)
    pv: z.number().optional(),  // PV risk category (BGR)
  }).optional(),

  // ============================================================================
  // VACATION INFORMATION (for this payslip period - DYNAMIC)
  // ============================================================================
  vacationPreviousYear: z.number().optional(),      // Urlaub Vorjahr
  vacationEntitlement: z.number().optional(),       // Urlaubsanspruch
  vacationTakenMonthly: z.number().optional(),      // Urlaub - monatlich genommen
  vacationRemaining: z.number().optional(),         // Resturlaub

  // ============================================================================
  // ACCUMULATED YEARLY VALUES (as of this payslip - DYNAMIC)
  // ============================================================================
  yearlyAccumulatedValues: z.object({
    totalGross: z.number().optional(),                    // Gesamtbrutto
    taxGross: z.number().optional(),                      // Steuer - Brutto
    incomeTax: z.number().optional(),                     // Lohnsteuer
    churchTaxAmount: z.number().optional(),               // Kirchensteuer
    solidaritySurcharge: z.number().optional(),           // SolZ
    healthInsuranceGross: z.number().optional(),          // KV - Brutto
    nursingCareGross: z.number().optional(),              // PV - Brutto
    pensionInsuranceGross: z.number().optional(),         // RV - Brutto
    unemploymentInsuranceGross: z.number().optional(),    // AV - Brutto
    healthInsuranceContribution: z.number().optional(),   // KV - Beitrag
    nursingCareContribution: z.number().optional(),       // PV - Beitrag
    pensionInsuranceContribution: z.number().optional(),  // RV - Beitrag
    unemploymentInsuranceContribution: z.number().optional(), // AV - Beitrag
    employerSavingsTotal: z.number().optional(),            // VWL - Gesamt
    companyPension: z.number().optional(),                  // Betriebl. Altersversorgung
    payoutAmount: z.number().optional(),                    // Auszahlungsbetrag
  }).optional(),

  // ============================================================================
  // BANKING INFORMATION (from this payslip)
  // ============================================================================
  bankingInfo: z.object({
    iban: z.string().optional(),
    bic: z.string().optional(),
    bankName: z.string().optional(),
  }).optional(),

  // ============================================================================
  // EMPLOYER INFORMATION (from this payslip)
  // ============================================================================
  employerInfo: z.object({
    companyName: z.string().optional(),              // e.g., "Zola UG (haftungsbeschränkt)"
    street: z.string().optional(),                   // e.g., "Paul-Lincke-Ufer 39-40"
    postalCode: z.string().optional(),               // e.g., "10999"
    city: z.string().optional(),                     // e.g., "Berlin"
    fullAddress: z.string().optional(),              // Combined address for convenience
    taxId: z.string().optional(),                    // Company tax ID if present on payslip
    registrationNumber: z.string().optional(),       // Company registration number if present
    contactPhone: z.string().optional(),             // Contact phone if present on payslip
    contactEmail: z.string().optional(),             // Contact email if present on payslip
  }).optional(),

  // ============================================================================
  // CACHE METADATA (when stored on employee profile)
  // ============================================================================
  month: z.string().optional(),     // Month payslip was from (e.g., "08", "09")
  year: z.string().optional(),      // Year payslip was from (e.g., "2025")
  cachedAt: z.string().optional(),  // ISO timestamp when cached
});

export type ParsedPayslipData = z.infer<typeof ParsedPayslipDataSchema>;

/**
 * BMF Tax Info (cached on employee profile)
 * Official BMF PAP 2025 parameters for employee tax calculation.
 * Based on BMF XML specification: https://www.bmf-steuerrechner.de/
 * These parameters are STABLE across payslips and can be cached for reuse.
 *
 * IMPORTANT: Only stable/semi-stable fields belong here. Dynamic fields that
 * change every month (accumulated values, monthly days, etc.) belong in
 * ParsedPayslipDataSchema instead.
 */
export const BMFTaxInfoSchema = z.object({
  // ============================================================================
  // PERSONAL INFORMATION (stable identifiers)
  // ============================================================================
  personnelNumber: z.string().optional(),          // Pers.-Nr. (stable)
  socialSecurityNumber: z.string().optional(),     // SV-Nummer (stable)
  taxIdNumber: z.string().optional(),              // Steuer ID Nr. (stable)
  dateOfBirth: z.string().optional(),              // Geb.datum (stable)
  entryDate: z.string().optional(),                // Eintritt (stable)
  exitDate: z.string().optional(),                 // Austritt (stable when set)
  healthInsuranceCompany: z.string().optional(),   // Kasse (relatively stable)
  religion: z.string().optional(),                 // Konfession (stable)
  personnelGroup: z.string().optional(),           // Personengruppe (stable)
  beitragsgruppe: z.string().optional(),           // BGRS contribution group "X-X-X-X" (KV-RV-AV-PV): 1-1-1-1=Standard, 6-1-0-0=Pauschal KV (stable)
  department: z.string().optional(),               // Abteilung (relatively stable)
  costCenter: z.string().optional(),               // Kst.-St. (relatively stable)

  // ============================================================================
  // EMPLOYMENT STATUS (relatively stable)
  // ============================================================================
  midijob: z.boolean().optional(),                 // Übergangsbereich (€556-€2000) - determines Gleitzone SV calculation (stable)
  multipleEmployment: z.boolean().optional(),      // MFB - Multiple Employment Factor (relatively stable)

  // ============================================================================
  // OFFICIAL BMF PAP 2025 PARAMETERS (from XML spec)
  // ============================================================================
  taxClass: z.number().optional(),                    // STKL: 1-6 (Steuerklasse) (stable)
  pensionInsuranceType: z.number().optional(),        // KRV: 0=statutory/occupational, 1=otherwise (stable)
  healthInsuranceType: z.number().optional(),         // PKV: 0=statutory, 1=private no subsidy, 2=private with subsidy (stable)
  saxonyNursingCare: z.boolean().optional(),          // PVS: Saxony nursing care special rules (stable)
  nursingInsuranceSurcharge: z.boolean().optional(),  // PVZ: Employee pays surcharge (childless) (stable)
  childDependentNursing: z.number().optional(),       // PVA: 0-4 children consideration levels (stable)
  churchTax: z.boolean().optional(),       // LZZ: Church tax (rk/ev) (stable)
  childrenCount: z.number().optional(),    // ZKF: Number of children for tax benefits (relatively stable)
  monthlyTaxAllowance: z.number().optional(),  // LZZFREIB: Tax-free allowance per month in cents (relatively stable)
  monthlyTaxSurcharge: z.number().optional(),  // LZZHINZU: Tax surcharge per month in cents (relatively stable)
  isOver64: z.boolean().optional(),        // ALTER1: Age relief for employees 64+ (stable within year)

  // ============================================================================
  // INSURANCE RATES (relatively stable - can change annually)
  // ============================================================================
  // Health Insurance (KV)
  healthInsuranceRate: z.number().optional(),               // KV % employee share (AN)
  healthInsuranceEmployeeRate: z.number().optional(),       // Historical alias (same as above)
  healthInsuranceEmployerRate: z.number().optional(),       // KV % employer share (AG)
  healthInsuranceTotalRate: z.number().optional(),          // KV % total rate (AN + AG)

  // Pension Insurance (RV)
  pensionInsuranceRate: z.number().optional(),              // RV % employee share (AN)
  pensionInsuranceEmployeeRate: z.number().optional(),      // Historical alias (same as above)
  pensionInsuranceEmployerRate: z.number().optional(),      // RV % employer share (AG)
  pensionInsuranceTotalRate: z.number().optional(),         // RV % total rate (AN + AG)

  // Unemployment Insurance (AV)
  unemploymentInsuranceRate: z.number().optional(),         // AV % employee share (AN)
  unemploymentInsuranceEmployeeRate: z.number().optional(), // Historical alias (same as above)
  unemploymentInsuranceEmployerRate: z.number().optional(), // AV % employer share (AG)
  unemploymentInsuranceTotalRate: z.number().optional(),    // AV % total rate (AN + AG)

  // Nursing Care Insurance (PV)
  careInsuranceRate: z.number().optional(),                 // PV % employee share (AN)
  careInsuranceEmployeeRate: z.number().optional(),         // Historical alias (same as above)
  careInsuranceEmployerRate: z.number().optional(),         // PV % employer share (AG)
  careInsuranceTotalRate: z.number().optional(),            // PV % total rate (AN + AG)
  careInsuranceSurchargeRate: z.number().optional(),        // PV % surcharge (Zu.)

  // ============================================================================
  // OCCUPATIONAL RISK CATEGORY (stable)
  // ============================================================================
  occupationalRiskCategory: z.object({
    kv: z.number().optional(),
    rv: z.number().optional(),
    av: z.number().optional(),
    pv: z.number().optional(),
  }).optional(),  // BGR (Berufsgenossenschaft Risk Category) - stable

  // ============================================================================
  // VACATION ENTITLEMENT (relatively stable - annual entitlement)
  // ============================================================================
  vacationEntitlement: z.number().optional(),       // Urlaubsanspruch (annual entitlement - relatively stable)

  // ============================================================================
  // ACCUMULATED YEARLY VALUES (context for tax calculations - grows monthly)
  // ============================================================================
  yearlyAccumulatedValues: z.object({
    totalGross: z.number().optional(),                    // Gesamtbrutto (in cents)
    taxGross: z.number().optional(),                      // Steuer - Brutto (in cents)
    incomeTax: z.number().optional(),                     // Lohnsteuer (in cents)
    churchTaxAmount: z.number().optional(),               // Kirchensteuer (in cents)
    solidaritySurcharge: z.number().optional(),           // SolZ (in cents)
    healthInsuranceGross: z.number().optional(),          // KV - Brutto (in cents)
    nursingCareGross: z.number().optional(),              // PV - Brutto (in cents)
    pensionInsuranceGross: z.number().optional(),         // RV - Brutto (in cents)
    unemploymentInsuranceGross: z.number().optional(),    // AV - Brutto (in cents)
    healthInsuranceContribution: z.number().optional(),   // KV - Beitrag (in cents)
    nursingCareContribution: z.number().optional(),       // PV - Beitrag (in cents)
    pensionInsuranceContribution: z.number().optional(),  // RV - Beitrag (in cents)
    unemploymentInsuranceContribution: z.number().optional(), // AV - Beitrag (in cents)
    employerSavingsTotal: z.number().optional(),          // VWL - Gesamt (in cents)
    companyPension: z.number().optional(),                // Betriebl. Altersversorgung (in cents)
    payoutAmount: z.number().optional(),                  // Auszahlungsbetrag cumulative (in cents)
  }).optional(),

  // ============================================================================
  // BANKING INFORMATION (stable)
  // ============================================================================
  bankingInfo: z.object({
    iban: z.string().optional(),
    bic: z.string().optional(),
    bankName: z.string().optional(),
  }).optional(),

  // ============================================================================
  // PAYSLIP REFERENCE VALUES (for labor cost ratio calculation)
  // ============================================================================
  brutto: z.number().optional(),  // Brutto from reference payslip (in cents)
  netto: z.number().optional(),   // Netto from reference payslip (in cents)

  // ============================================================================
  // CACHE METADATA
  // ============================================================================
  referenceMonth: z.string(),              // Month payslip was from (e.g., "08", "09")
  referenceYear: z.string(),               // Year payslip was from (e.g., "2025")
  cachedAt: z.string(),                    // ISO timestamp when cached
});

export type BMFTaxInfo = z.infer<typeof BMFTaxInfoSchema>;

// Tips distribution is now handled entirely by Business configuration
// No hardcoded groups or default distributions

export interface Employee {
  // Firebase document ID
  id?: string;
  // Organization ID for multi-tenancy
  orgId: string;
  // Business access restriction (optional)
  // If empty/missing: employee can check in at ANY business in their org
  // If populated: employee can ONLY check in at these specific businesses
  businessIds?: string[];

  // Core identity
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string; // Date of birth in ISO format (YYYY-MM-DD)
  professionId: string; // e.g., "Pizzaiolo", "Waiter", "Dishwasher", "Chef" - determines tips group
  startDate: Date;
  endDate?: Date;


  // NGTeco integration (attendance system)
  employeeCode?: string; // Optional - only required for NGTeco integration, used to match employees
  employee_code?: string; // Legacy snake_case version for backward compatibility
  ngtecoEmployeeId?: string; // The employee_id returned from NGTeco API
  ngtecoPersonId?: string; // Used for deletion
  ngtecoDepartmentId?: string; // NGTeco department ID

  // Device assignments
  selectedDevices?: string[]; // Array of device IDs this employee has access to
  deviceAssociations?: Array<{  // Device-person association IDs from NGTeco
    deviceId: string;
    devicePersonId?: string;  // Optional - NGTeco may not return association ID in all cases
  }>;

  // NGTeco cleanup tracking (for terminated employees)
  ngtecoCleanupCompleted?: Date;  // Set when 4am cron completes NGTeco cleanup
  ngtecoCleanupDetails?: {
    processedAt: string;  // ISO timestamp when cleanup was performed
    devicesRemoved: number;  // Count of devices employee was removed from
    hrDeleted: boolean;  // Whether employee was deleted from NGTeco HR system
  };

  // Banking & Payment
  iban: string;
  bic?: string; // Only for non-German IBANs
  ibanRecipientName?: string; // Optional, overrides employee name in payment files

  paymentType: PaymentType;
  hourlyRate?: number; // For 'hourly' and 'invoice' - in EUROS (stored in DB as euros, NOT cents)
  rateType?: RateType; // Whether rate/amount is netto or brutto. Default undefined = 'netto' for backwards compatibility
  flatPaymentAmount?: number; // For 'flat' only - in EUROS (stored in DB as euros, NOT cents)



  // Tips
  excludeFromTips?: boolean; // If true, employee doesn't participate in tips distribution


  // Tax Information Cache (from payslip parsing)
  taxInfo?: ParsedPayslipData; // Cached payslip data for labor cost calculations


  // CoP Validation
  copValidation?: {
    status: 'matched' | 'close_match' | 'not_matched' | 'cannot_be_checked' | 'not_verified';
    actualName?: string;
    validatedAt?: string;
    error?: string;
  };


  // Account & Authentication
  userId?: string; // Firebase Auth user ID when employee has an account
  hasAccount?: boolean; // Whether employee has created an account
  accountCreatedAt?: string; // ISO string of when account was created
  consentGivenAt?: string; // ISO string of when employee agreed to terms and privacy policy

  // Last punch tracking (for QR scanner rate limit + punch type)
  lastPunchTime?: string; // ISO timestamp of last punch
  lastPunchType?: 'in' | 'out'; // Type of last punch
  lastPunchBusinessId?: string; // Business ID of last punch

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string; // User ID who created the record
  updatedBy?: string; // User ID who last updated the record
}
