/**
 * BMAS 2025 Employer Social Security Contributions (Arbeitgeberanteil)
 *
 * Legal basis:
 * - Sozialversicherungsrechengrößen-Verordnung 2025
 * - §§ 241-249 SGB V (Health Insurance)
 * - §§ 157-162 SGB VI (Pension Insurance)
 * - §§ 341-345 SGB III (Unemployment Insurance)
 * - §§ 54-61 SGB XI (Care Insurance)
 * - §§ 249a-249c SGB V (Mini-job special rules)
 *
 * Sources:
 * - https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/sozialversicherungs-rechengroessenverordnung-2025.html
 * - https://www.lohn-info.de/sozialversicherungsbeitraege2025.html
 * - https://magazin.minijob-zentrale.de/minijob-abgaben-2025/
 */

/**
 * BMAS 2025 Official Employer Contribution Constants
 */
export const BMAS_2025_EMPLOYER = {
  // ============================================================================
  // CONTRIBUTION CEILINGS (Beitragsbemessungsgrenzen) - Monthly in cents
  // ============================================================================
  KV_PV_CEILING: 551250, // €5,512.50/month (€66,150/year) - Health & Care
  RV_AV_CEILING: 805000, // €8,050.00/month (€96,600/year) - Pension & Unemployment

  // ============================================================================
  // REGULAR EMPLOYEE EMPLOYER RATES (Arbeitgeberanteil)
  // ============================================================================
  KV_BASE_RATE: 0.073, // 7.3% - Health insurance base
  KV_ZUSATZ_AVG: 0.0125, // 1.25% - Average additional contribution (Zusatzbeitrag)
  RV_RATE: 0.093, // 9.3% - Pension insurance
  AV_RATE: 0.013, // 1.3% - Unemployment insurance
  PV_RATE: 0.018, // 1.8% - Care insurance (standard)
  PV_RATE_SACHSEN: 0.013, // 1.3% - Care insurance (Sachsen exception)

  // ============================================================================
  // MINI-JOB COMMERCIAL (Gewerbliche Minijobs) - §8 SGB IV
  // Source: https://magazin.minijob-zentrale.de/minijob-abgaben-2025/
  // ============================================================================
  MINIJOB_KV: 0.13, // 13% - Health insurance (pauschaler KV-Beitrag)
  MINIJOB_RV: 0.15, // 15% - Pension insurance (pauschaler RV-Beitrag)
  MINIJOB_U1: 0.011, // 1.1% - Umlage U1 (Lohnfortzahlung im Krankheitsfall)
  MINIJOB_U2: 0.0022, // 0.22% - Umlage U2 (Mutterschutz) - reduced from 0.24% in 2025
  MINIJOB_INSOLVENZ: 0.0015, // 0.15% - Insolvenzgeldumlage - increased from 0.06% in 2025
  MINIJOB_PAUSCHSTEUER: 0.02, // 2% - Pauschalsteuer (flat tax)
  MINIJOB_TOTAL: 0.3147, // 31.47% - Total employer rate

  // ============================================================================
  // MINI-JOB HOUSEHOLD (Minijobs im Privathaushalt) - §8a SGB IV
  // Lower rates to promote domestic employment
  // ============================================================================
  MINIJOB_HAUSHALT_KV: 0.05, // 5% - Health insurance
  MINIJOB_HAUSHALT_RV: 0.05, // 5% - Pension insurance
  MINIJOB_HAUSHALT_UNFALL: 0.016, // 1.6% - Accident insurance (Unfallversicherung)
  MINIJOB_HAUSHALT_TOTAL: 0.1492, // 14.92% - Total employer rate

  // ============================================================================
  // INCOME THRESHOLDS (in cents)
  // ============================================================================
  MINIJOB_THRESHOLD: 55600, // €556.00 - Mini-job income limit 2025
  MIDIJOB_MAX: 200000, // €2,000.00 - Midijob upper limit (Übergangsbereich)

  // ============================================================================
  // MIDIJOB (Übergangsbereich) Factor F for 2025
  // Formula: F = 28 / 41.90 = 0.6683
  // ============================================================================
  MIDIJOB_FACTOR_F: 0.6683,
} as const;

/**
 * Employment type for employer contribution calculation
 * Different from EmploymentType in utils (which is for general employment classification)
 */
export type EmployerContributionType =
  | 'regular' // Regular employee (above €2,000)
  | 'minijob' // Commercial mini-job (up to €556)
  | 'minijob_household' // Household mini-job (up to €556)
  | 'midijob'; // Midijob/Übergangsbereich (€556.01 - €2,000)

/**
 * Input for employer contribution calculation
 */
export interface EmployerContributionInput {
  /** Monthly gross salary in cents */
  bruttoMonthly: number;
  /** Employment type - auto-detected if not provided */
  employmentType?: EmployerContributionType;
  /** Is employee in Sachsen? (different PV rate) */
  isSachsen?: boolean;
  /** Actual employer health insurance rate from payslip (percentage, e.g., 8.55) */
  healthInsuranceEmployerRate?: number;
  /** Actual employer pension rate from payslip (percentage, e.g., 9.3) */
  pensionInsuranceEmployerRate?: number;
  /** Actual employer unemployment rate from payslip (percentage, e.g., 1.3) */
  unemploymentInsuranceEmployerRate?: number;
  /** Actual employer care insurance rate from payslip (percentage, e.g., 1.8) */
  careInsuranceEmployerRate?: number;
}

/**
 * Result of employer contribution calculation
 */
export interface EmployerContributionResult {
  /** Total employer contribution in cents */
  total: number;
  /** Breakdown by insurance type (all in cents) */
  breakdown: {
    healthInsurance: number;
    pensionInsurance: number;
    unemploymentInsurance: number;
    careInsurance: number;
    /** U1 + U2 + Insolvenzgeld/Unfallversicherung (mini-job only) */
    umlagen?: number;
    /** Flat tax (mini-job only) */
    pauschsteuer?: number;
  };
  /** Detected or provided employment type */
  employmentType: EmployerContributionType;
}

/**
 * Calculate employer social security contributions (Arbeitgeberanteil)
 *
 * Handles all employment types:
 * - Regular employees: Full rates up to ceilings
 * - Mini-jobs (commercial): 31.47% flat rate
 * - Mini-jobs (household): 14.92% flat rate
 * - Midijobs: Employer pays full rate on full brutto (only employee base is reduced)
 *
 * @param input - Brutto and optional rates/type
 * @returns Total contribution and breakdown in cents
 */
export function calculateEmployerContribution(
  input: EmployerContributionInput
): EmployerContributionResult {
  const { bruttoMonthly } = input;
  const B = BMAS_2025_EMPLOYER;

  // Detect employment type if not provided
  const employmentType = input.employmentType ?? detectEmploymentType(bruttoMonthly);

  // Mini-job (commercial) - flat rates
  if (employmentType === 'minijob') {
    return calculateMinijobEmployer(bruttoMonthly, false);
  }

  // Mini-job (household) - reduced flat rates
  if (employmentType === 'minijob_household') {
    return calculateMinijobEmployer(bruttoMonthly, true);
  }

  // Regular employee or Midijob
  // IMPORTANT: For midijobs, employer pays FULL rate on FULL brutto
  // Only the employee's contribution base is reduced, not the employer's
  // Reference: §20 Abs. 2 SGB IV

  // Apply contribution ceilings
  const kvPvBase = Math.min(bruttoMonthly, B.KV_PV_CEILING);
  const rvAvBase = Math.min(bruttoMonthly, B.RV_AV_CEILING);

  // Use actual rates from payslip if available, otherwise BMAS 2025 defaults
  const kvRate =
    input.healthInsuranceEmployerRate !== undefined
      ? input.healthInsuranceEmployerRate / 100
      : B.KV_BASE_RATE + B.KV_ZUSATZ_AVG; // 7.3% + 1.25% = 8.55%

  const rvRate =
    input.pensionInsuranceEmployerRate !== undefined
      ? input.pensionInsuranceEmployerRate / 100
      : B.RV_RATE; // 9.3%

  const avRate =
    input.unemploymentInsuranceEmployerRate !== undefined
      ? input.unemploymentInsuranceEmployerRate / 100
      : B.AV_RATE; // 1.3%

  const pvRate =
    input.careInsuranceEmployerRate !== undefined
      ? input.careInsuranceEmployerRate / 100
      : input.isSachsen
        ? B.PV_RATE_SACHSEN // 1.3% in Sachsen
        : B.PV_RATE; // 1.8% elsewhere

  // Calculate contributions
  const healthInsurance = Math.round(kvPvBase * kvRate);
  const careInsurance = Math.round(kvPvBase * pvRate);
  const pensionInsurance = Math.round(rvAvBase * rvRate);
  const unemploymentInsurance = Math.round(rvAvBase * avRate);

  return {
    total: healthInsurance + careInsurance + pensionInsurance + unemploymentInsurance,
    breakdown: {
      healthInsurance,
      pensionInsurance,
      unemploymentInsurance,
      careInsurance,
    },
    employmentType,
  };
}

/**
 * Calculate mini-job employer contributions with Pauschalabgaben
 *
 * Commercial mini-jobs: 31.47% (15% RV + 13% KV + 2% Tax + 1.47% Umlagen)
 * Household mini-jobs: 14.92% (5% RV + 5% KV + 2% Tax + 2.92% Umlagen/Unfall)
 */
function calculateMinijobEmployer(
  bruttoMonthly: number,
  isHousehold: boolean
): EmployerContributionResult {
  const B = BMAS_2025_EMPLOYER;

  if (isHousehold) {
    // Household mini-job (§8a SGB IV)
    const kv = Math.round(bruttoMonthly * B.MINIJOB_HAUSHALT_KV);
    const rv = Math.round(bruttoMonthly * B.MINIJOB_HAUSHALT_RV);
    const u1 = Math.round(bruttoMonthly * B.MINIJOB_U1);
    const u2 = Math.round(bruttoMonthly * B.MINIJOB_U2);
    const unfall = Math.round(bruttoMonthly * B.MINIJOB_HAUSHALT_UNFALL);
    const steuer = Math.round(bruttoMonthly * B.MINIJOB_PAUSCHSTEUER);

    return {
      total: kv + rv + u1 + u2 + unfall + steuer,
      breakdown: {
        healthInsurance: kv,
        pensionInsurance: rv,
        unemploymentInsurance: 0,
        careInsurance: 0,
        umlagen: u1 + u2 + unfall,
        pauschsteuer: steuer,
      },
      employmentType: 'minijob_household',
    };
  }

  // Commercial mini-job (§8 SGB IV)
  const kv = Math.round(bruttoMonthly * B.MINIJOB_KV);
  const rv = Math.round(bruttoMonthly * B.MINIJOB_RV);
  const u1 = Math.round(bruttoMonthly * B.MINIJOB_U1);
  const u2 = Math.round(bruttoMonthly * B.MINIJOB_U2);
  const insolvenz = Math.round(bruttoMonthly * B.MINIJOB_INSOLVENZ);
  const steuer = Math.round(bruttoMonthly * B.MINIJOB_PAUSCHSTEUER);

  return {
    total: kv + rv + u1 + u2 + insolvenz + steuer,
    breakdown: {
      healthInsurance: kv,
      pensionInsurance: rv,
      unemploymentInsurance: 0,
      careInsurance: 0,
      umlagen: u1 + u2 + insolvenz,
      pauschsteuer: steuer,
    },
    employmentType: 'minijob',
  };
}

/**
 * Auto-detect employment type based on monthly brutto
 *
 * Note: This only detects based on income. For accurate mini-job detection,
 * also check personnelGroup === "109" or taxClass === "P"
 */
function detectEmploymentType(bruttoMonthly: number): EmployerContributionType {
  const B = BMAS_2025_EMPLOYER;
  if (bruttoMonthly <= B.MINIJOB_THRESHOLD) return 'minijob';
  if (bruttoMonthly <= B.MIDIJOB_MAX) return 'midijob';
  return 'regular';
}

/**
 * Helper to detect if employee is a mini-job based on payslip data
 * More accurate than income-based detection
 */
export function isMinijobFromPayslip(data: {
  personnelGroup?: string;
  taxClass?: string | number;
  bruttoEqualsNetto?: boolean;
}): boolean {
  // Personnel group 109 = geringfügig entlohnte Beschäftigte
  if (data.personnelGroup === '109') return true;

  // Tax class "P" indicates Pauschalversteuerung (mini-job flat tax)
  if (data.taxClass === 'P' || data.taxClass === '0') return true;

  // If brutto equals netto, likely a mini-job (no employee deductions)
  if (data.bruttoEqualsNetto) return true;

  return false;
}
