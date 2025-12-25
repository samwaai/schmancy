import * as BigJs from "big.js";
const Big = BigJs.Big;

// ============================================================================
// BMAS 2025 — OFFICIAL SOCIAL SECURITY RULES
// Source: BMAS Sozialversicherungsrechengrößen-Verordnung 2025
// https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/sozialversicherungs-rechengroessenverordnung-2025.html
// ============================================================================

const BMAS_2025 = {
  // Contribution ceilings (monthly values in cents)
  RV_CEILING_WEST: 805000,    // €8,050/month = €96,600/year (pension/unemployment)
  RV_CEILING_EAST: 805000,    // €8,050/month = €96,600/year (unified nationwide 2025)
  KV_PV_CEILING: 551250,      // €5,512.50/month = €66,150/year (health/care)

  // Employee contribution rates (2025 values)
  KV_RATE: 0.073,                    // Health insurance base rate: 7.3%
  KV_ZUSATZ_RATE: 0.0125,            // Average additional health rate: 1.25% (2.5% total / 2, GKV-Spitzenverband 2025)
  RV_RATE: 0.093,                    // Pension insurance: 9.3%
  AV_RATE: 0.013,                    // Unemployment insurance: 1.3%
  PV_BASE_RATE: 0.018,               // Care insurance base: 1.8% (increased from 1.7% Jan 2025)
  PV_CHILDLESS_SURCHARGE: 0.006,     // Childless surcharge: 0.6%
  PV_CHILD_DISCOUNT: 0.0025,         // Discount per child (2nd-5th under 25): 0.25% each, max 1.0%

  // Employment thresholds (monthly values in cents)
  // Source: https://www.tk.de/firmenkunden/service/fachthemen/versicherung-fachthema/minijobs-uebergangsbereich-und-mindestlohn-2025-2046998
  MIDIJOB_MIN: 55601,         // €556.01 (increased from €538 due to minimum wage 2025)
  MIDIJOB_MAX: 200000,        // €2,000
  MINIJOB_MAX: 55600,         // €556.00
};

const RV_CEILING = BMAS_2025.RV_CEILING_WEST;

// ============================================================================
// TYPES
// ============================================================================

export interface BruttoCalculationInput {
  netto: number;
  // RAW data - no inference, no mutation
  taxClass: string;              // RAW: "P", "0", "1", "2", "3", "4", "5", "6"
  personnelGroup?: string;       // RAW: "109" (minijob), "101" (regular), etc.
  churchTax: boolean;
  churchTaxRate?: number;
  midijob?: boolean;
  healthInsuranceRate?: number;
  pensionInsuranceRate?: number;
  unemploymentInsuranceRate?: number;
  careInsuranceRate?: number;
  isChildless?: boolean;
  // BMF PAP 2025 Official Parameters (newly added)
  childrenCount?: number;        // ZKF: Number of children for tax benefits
  childrenUnder25?: number;      // Number of children under 25 (for PV multi-child discount per §55 SGB XI)
  monthlyTaxAllowance?: number;  // LZZFREIB: Tax-free allowance per month (cents)
  monthlyTaxSurcharge?: number;  // LZZHINZU: Tax surcharge per month (cents)
  isOver64?: boolean;           // ALTER1: Age relief for employees 64+
  birthYear?: number;           // For calculating exact age relief amount
}

export interface BruttoCalculationOutput {
  brutto: number;
  confidence: number;
  reasoning: string;
  taxDeductions: number;
  socialSecurityDeductions: number;
  iterations: number;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Calculate care insurance (Pflegeversicherung) rate with multi-child discount
 * Reference: §55 Abs. 3 SGB XI (effective July 2023)
 *
 * Rates for 2025:
 * - Childless (23+): 2.4% (1.8% base + 0.6% surcharge)
 * - 1 child: 1.8% (base rate)
 * - 2 children under 25: 1.55% (-0.25%)
 * - 3 children under 25: 1.30% (-0.50%)
 * - 4 children under 25: 1.05% (-0.75%)
 * - 5+ children under 25: 0.80% (-1.00% max)
 *
 * @param isChildless - true if employee has no children
 * @param childrenUnder25 - number of children under 25 years old
 * @returns Employee PV contribution rate as decimal (e.g., 0.018 for 1.8%)
 */
/**
 * Check if employee is 23 years or older for PV childless surcharge
 * Per §55 Abs. 3 SGB XI, the childless surcharge only applies to those 23+
 */
function isOver23ForPV(birthYear?: number): boolean {
  if (birthYear === undefined) return true; // Conservative: assume over 23 if unknown
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  return age >= 23;
}

function calculatePVRate(isChildless: boolean, childrenUnder25: number = 0, birthYear?: number): number {
  // Childless employees 23+: base rate + surcharge (§55 Abs. 3 SGB XI)
  // Under 23: no surcharge regardless of children status
  if (isChildless && isOver23ForPV(birthYear)) {
    return BMAS_2025.PV_BASE_RATE + BMAS_2025.PV_CHILDLESS_SURCHARGE; // 2.4%
  }

  // Parents OR childless under 23: base rate
  if (childrenUnder25 <= 1) {
    return BMAS_2025.PV_BASE_RATE; // 1.8%
  }

  // Parents with 2+ children under 25: discount of 0.25% per child (2nd-5th)
  // Maximum discount: 1.0% (for 5+ children)
  const discountableChildren = Math.min(childrenUnder25 - 1, 4); // Max 4 additional children (2nd-5th)
  const discount = discountableChildren * BMAS_2025.PV_CHILD_DISCOUNT;

  return BMAS_2025.PV_BASE_RATE - discount;
}

/**
 * Calculate EMPLOYEE contribution base for Midijob (Übergangsbereich) 2025
 *
 * IMPORTANT: There are TWO different formulas in the Gleitzone:
 * 1. Total contribution base (Gesamtbeitrag): Uses Faktor F
 * 2. Employee contribution base (Arbeitnehmeranteil): Simpler formula WITHOUT Faktor F
 *
 * This function returns the EMPLOYEE contribution base factor.
 *
 * Official EMPLOYEE formula for 2025:
 * AN-BE = (OG/(OG-UG)) × (AE - UG)
 * AN-BE = 1.3850415512 × (AE - 556)
 *
 * Where:
 * - OG = 2000 (upper threshold)
 * - UG = 556 (lower threshold = Geringfügigkeitsgrenze)
 * - AE = Actual gross salary (Arbeitsentgelt)
 * - AN-BE = Employee contribution base (Arbeitnehmer beitragspflichtige Einnahme)
 *
 * Key behavior:
 * - At €556.01: AN-BE ≈ €0.01 (employee pays essentially nothing)
 * - At €2000: AN-BE = €2000 (employee pays full rate)
 *
 * Returns the factor by which to multiply brutto to get employee's contribution base.
 *
 * Source: https://www.lohn-info.de/uebergangsbereich_gleitzone_2025.html
 * Legal basis: §20 Abs. 2a SGB IV, §163 Abs. 10 SGB VI
 */
function calculateGleitzonenFaktor(brutto: number): number {
  // Below mini-job threshold: no social insurance (Minijob)
  if (brutto <= BMAS_2025.MINIJOB_MAX) return 0;

  // Above midijob threshold: full contributions
  if (brutto >= BMAS_2025.MIDIJOB_MAX) return 1;

  // In Gleitzone (€556.01 - €2,000): use EMPLOYEE contribution formula
  const UG = BMAS_2025.MINIJOB_MAX / 100;  // 556 EUR (Geringfügigkeitsgrenze)
  const OG = BMAS_2025.MIDIJOB_MAX / 100;  // 2000 EUR (Übergangsbereich-Obergrenze)
  const AE = brutto / 100;  // Actual earnings in EUR

  // Official EMPLOYEE contribution base formula:
  // AN-BE = (OG/(OG-UG)) × (AE - UG)
  // = 1.3850415512 × (AE - 556)
  const multiplier = OG / (OG - UG);  // 2000/1444 = 1.3850415512
  const AN_BE = multiplier * (AE - UG);

  // Return reduction factor: AN-BE / AE
  // This gives us the factor by which to reduce the employee's contribution base
  // At €556.01: factor ≈ 0.000025 (essentially 0)
  // At €2000: factor = 1.0 (full contributions)
  return AN_BE / AE;
}

// ============================================================================
// BMF PAP 2025 — OFFICIAL TAX CONSTANTS
// Source: https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2025.xml.xhtml
// ============================================================================

const BMF_2025 = {
  // Income tax thresholds (§32a EStG 2025)
  // Source: https://www.gesetze-im-internet.de/estg/__32a.html
  GFB: new Big(12096),      // Grundfreibetrag (basic allowance) - Zone 1 upper limit
  ZONE1: new Big(17443),    // Zone 2 upper limit (€12,097 - €17,443)
  ZONE2: new Big(68480),    // Zone 3 upper limit (€17,444 - €68,480)
  ZONE3: new Big(277825),   // Zone 4 upper limit (€68,481 - €277,825)

  // Solidarity surcharge (§3 SolzG 2025)
  // Source: BMF PAP 2025 MSOLZ method
  // Uses formula-based approach: Min(JBMG × 5.5%; (JBMG - SOLZFREI) × 11.9%)
  SOLZ_FREE: new Big(19950),     // Full exemption threshold (annual tax, singles)

  // Vorsorgepauschale constants (PAP 2025 page 28)
  BBGRV: new Big(96600),    // RV/AV ceiling (€8,050/month * 12 = €96,600/year)
  BBGKVPV: new Big(66150),  // KV/PV ceiling (€5,512.50/month * 12 = €66,150/year)
  RVSATZAN: new Big(0.093), // Employee pension rate 9.3%
  KVSATZAN: new Big(0.073), // Employee health insurance base rate 7.3%
  KVSATZAG: new Big(0.0125), // Average employee additional health rate (Zusatzbeitrag employee share) 1.25% (PAP uses for default calculations)
  PVSATZAN: new Big(0.018), // Employee care insurance base rate 1.8% (increased Jan 2025)
  PVSATZAG: new Big(0.018), // Employer care insurance rate 1.8% (increased Jan 2025)
  PVZ_KINDER: new Big(0.006), // Childless surcharge 0.6%

  // Calculation helpers
  ZAHL10000: new Big(10000),
  ZAHL100: new Big(100),
};

/**
 * Calculate income tax according to §32a EStG 2025 progressive tariff
 * Reference: BMF PAP 2025 method UPTAB25
 * Source: https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2025.xml.xhtml
 */
function calcIncomeTax2025(x: BigJs.Big): BigJs.Big {
  // Zone 0: Up to basic allowance (€12,096) - no tax
  if (x.lte(BMF_2025.GFB)) return new Big(0);

  // Zone 1: €12,097 to €17,444 - Formula from PAP 2025
  // ST = (932.30 * Y + 1,400) * Y
  if (x.lte(BMF_2025.ZONE1)) {
    const y = x.minus(BMF_2025.GFB).div(BMF_2025.ZAHL10000);
    return y.times(932.3).plus(1400).times(y);
  }

  // Zone 2: €17,444 to €68,481 - Formula from PAP 2025
  // ST = (176.64 * Z + 2,397) * Z + 1,015.13
  // Z = (X - 17443) / 10000 (official PAP 2025 - deliberate offset from boundary)
  if (x.lte(BMF_2025.ZONE2)) {
    const z = x.minus(new Big(17443)).div(BMF_2025.ZAHL10000);
    return z.times(176.64).plus(2397).times(z).plus(1015.13);
  }

  // Zone 3: €68,482 to €277,826 - 42% marginal rate
  // ST = 0.42 * X - 10,911.92
  if (x.lte(BMF_2025.ZONE3))
    return x.times(0.42).minus(10911.92);

  // Zone 4: Above €277,826 - 45% marginal rate (Reichensteuer)
  // ST = 0.45 * X - 19,246.67
  return x.times(0.45).minus(19246.67);
}

/**
 * Calculate tax for tax classes 5 and 6 using the UP5_6 method
 * Reference: BMF PAP 2025 method UP5_6
 *
 * This special calculation method applies to tax classes 5 and 6:
 * 1. Calculate tax on 125% of income
 * 2. Calculate tax on 75% of income
 * 3. Take the difference times 2
 * 4. Apply minimum 14% tax floor
 */
function calcUP5_6(zx: BigJs.Big): BigJs.Big {
  // Calculate tax on 125% of income
  const x125 = zx.times(1.25);
  const st1 = calcIncomeTax2025(x125);

  // Calculate tax on 75% of income
  const x75 = zx.times(0.75);
  const st2 = calcIncomeTax2025(x75);

  // Differential calculation: (ST1 - ST2) * 2
  const diff = st1.minus(st2).times(2);

  // Minimum tax (14% of income)
  const mist = zx.times(0.14).round(0, Big.roundDown);

  // Return maximum of differential or minimum tax
  return diff.gt(mist) ? diff : mist;
}

/**
 * Calculate tax for tax classes 5 and 6 using the MST5_6 method
 * Reference: BMF PAP 2025 method MST5_6
 *
 * This is the complete calculation method for tax classes 5 and 6,
 * which applies marginal rates above certain thresholds.
 */
function calcMST5_6(zzx: BigJs.Big): BigJs.Big {
  // BMF PAP 2025 thresholds for tax class 5
  const W1STKL5 = new Big(13785);  // First threshold
  const W2STKL5 = new Big(34240);  // 42% threshold
  const W3STKL5 = new Big(222260); // 45% threshold

  let st: BigJs.Big;

  if (zzx.gt(W2STKL5)) {
    // Income above W2: Apply marginal rates
    const zx = W2STKL5;
    st = calcUP5_6(zx);

    if (zzx.gt(W3STKL5)) {
      // Above W3: Add 42% on W2-W3 range, then 45% on excess
      st = st.plus(W3STKL5.minus(W2STKL5).times(0.42));
      st = st.plus(zzx.minus(W3STKL5).times(0.45));
    } else {
      // Between W2 and W3: Add 42% on excess above W2
      st = st.plus(zzx.minus(W2STKL5).times(0.42));
    }
  } else {
    // Income at or below W2
    const zx = zzx;
    st = calcUP5_6(zx);

    if (zzx.gt(W1STKL5)) {
      // Between W1 and W2: Check if marginal rate calculation gives lower tax
      const vergl = calcUP5_6(W1STKL5).plus(zzx.minus(W1STKL5).times(0.42));

      // Use the LOWER tax amount (taxpayer-favorable)
      if (vergl.lt(st)) {
        st = vergl;
      }
    }
  }

  return st.round(0, Big.roundDown);
}

/**
 * Calculate solidarity surcharge according to §3 SolzG
 * Reference: BMF PAP 2025 method MSOLZ
 *
 * The official PAP 2025 formula uses:
 * SOLZJ = JBMG × 5.5%
 * SOLZMIN = (JBMG - SOLZFREI) × 11.9%
 * Result = Min(SOLZJ, SOLZMIN)
 *
 * This creates a phase-out zone where:
 * - Full exemption below €19,950
 * - Phase-out using 11.9% formula
 * - Full 5.5% rate when 11.9% formula exceeds 5.5% (around €31,527)
 */
function calcSolz(st: BigJs.Big): BigJs.Big {
  // Full exemption below threshold
  if (st.lte(BMF_2025.SOLZ_FREE)) return new Big(0);

  // SOLZJ: Full 5.5% rate
  const solzj = st.times(0.055);

  // SOLZMIN: Phase-out formula (11.9% of excess over threshold)
  const solzmin = st.minus(BMF_2025.SOLZ_FREE).times(0.119);

  // Return the LOWER of the two (taxpayer-favorable)
  return solzmin.lt(solzj) ? solzmin : solzj;
}

// Church tax (8 % / 9 %)
function calcChurchTax(st: BigJs.Big, rate: number): BigJs.Big {
  return rate ? st.times(rate).div(100) : new Big(0);
}

/**
 * Calculate Vorsorgepauschale according to BMF PAP 2025 Method MVSP
 * Source: BMF PAP 2025 page 28-29, §39b Abs. 2 Satz 5 Nr. 3 EStG
 * Reference: https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2025.xml.xhtml
 *
 * The Vorsorgepauschale reduces taxable income to account for social insurance contributions.
 * It follows the EXACT official PAP 2025 formula.
 */
function calcVorsorgepauschale(
  bruttoAnnualEUR: BigJs.Big,
  taxClass: number = 1,
  hasChildless: boolean = true,
  pkv: number = 0,  // 0=statutory, 1=private, 2=private with subsidy
  actualKvRate?: number,  // Actual health insurance rate from payslip (e.g., 9.05)
  actualPvRate?: number   // Actual care insurance rate from payslip (e.g., 2.4 for childless)
): BigJs.Big {
  // PAP 2025 page 28, Line 1: "ZRE4VP" - Income capped at health insurance ceiling
  let zre4vp = bruttoAnnualEUR;
  if (zre4vp.gt(BMF_2025.BBGKVPV)) {
    zre4vp = BMF_2025.BBGKVPV;  // Cap at €66,150
  }

  // PAP 2025 Method MVSP - Calculate VSP1 (pension insurance portion)
  // Reference: PAP page 28, method MRE4LZZ2 → MVSP
  let vsp1 = new Big(0);

  // VSP1: Pension insurance (if not exempt - KRV != 1)
  // PAP: "VSP1 = ZRE4VP * RVSATZAN" with .setScale(2, ROUND_DOWN)
  const zre4vp_rv = bruttoAnnualEUR.gt(BMF_2025.BBGRV) ? BMF_2025.BBGRV : bruttoAnnualEUR;
  vsp1 = zre4vp_rv.times(BMF_2025.RVSATZAN).round(2, Big.roundDown);  // 9.3% of income (up to €96,600)

  // PAP 2025 Method MVSP - Calculate VSP3 (health/care insurance)
  let vsp3 = new Big(0);

  // Reference: BMF PAP 2025 Method MVSP - STKL == 6 gets VSP3 = 0
  if (taxClass === 6) {
    vsp3 = new Big(0);
  } else if (pkv === 0) {
    // Statutory insurance: Calculate based on actual contribution rates
    // PAP 2025 Method MVSP: VSP3 calculation for GKV members

    // Health insurance employee share:
    // Use actual rate from payslip if provided, otherwise use BMF defaults
    // Actual rate includes both base rate + Zusatzbeitrag (e.g., 9.05%)
    let kvRate: BigJs.Big;
    if (actualKvRate !== undefined) {
      kvRate = new Big(actualKvRate).div(100);  // Convert percentage to decimal
    } else {
      // Default: Base rate 7.3% + Additional rate 1.7% = 9.0%
      kvRate = BMF_2025.KVSATZAN.plus(BMF_2025.KVSATZAG);
    }
    const kvContribution = zre4vp.times(kvRate);

    // Care insurance employee share:
    // Use actual rate from payslip if provided, otherwise calculate from BMF defaults
    // Actual rate includes base + childless surcharge if applicable (e.g., 2.4% for childless)
    let pvRate: BigJs.Big;
    if (actualPvRate !== undefined) {
      pvRate = new Big(actualPvRate).div(100);  // Convert percentage to decimal
    } else {
      // Default: Base rate 1.8% + Childless surcharge 0.6% if applicable
      pvRate = BMF_2025.PVSATZAN;  // 1.8% base rate
      if (hasChildless) {
        pvRate = pvRate.plus(BMF_2025.PVZ_KINDER);  // +0.6% for childless
      }
    }
    const pvContribution = zre4vp.times(pvRate);

    // VSP3 = Total employee contributions for KV + PV
    // BMF PAP 2025: Round to 2 decimals, ROUND_DOWN (official requirement)
    vsp3 = kvContribution.plus(pvContribution).round(2, Big.roundDown);

  } else if (pkv === 1 || pkv === 2) {
    // Private insurance: Would use actual PKV amounts
    // For now, using statutory equivalent
    vsp3 = zre4vp.times(BMF_2025.KVSATZAN.plus(BMF_2025.PVSATZAN));
  }

  // PAP 2025 page 29 - Calculate VSP2 (12% rule)
  // Reference: "VSP2 = ZRE4VP * 0.12" with .setScale(2, ROUND_DOWN)
  const vsp2 = zre4vp.times(new Big(0.12)).round(2, Big.roundDown);

  // Maximum VSP2 allowance per PAP 2025
  // Reference: PAP page 29, VSPMAX calculation
  let vspmax: BigJs.Big;
  if (taxClass === 3) {
    vspmax = new Big(3000);  // Tax class 3: €3,000 max
  } else {
    vspmax = new Big(1900);  // Tax class 1,2,4,5,6: €1,900 max
  }

  // Apply VSP2 maximum
  const vsp2_capped = vsp2.gt(vspmax) ? vspmax : vsp2;

  // PAP 2025 comparison calculation (page 29)
  // The official formula compares two calculations:

  // Method 1: Standard calculation (VSPN)
  // VSPN = VSP1 (pension) + MIN(VSP2, VSPMAX)
  const vspn = vsp1.plus(vsp2_capped);

  // Method 2: Actual contributions (VSPKURZ)
  // For statutory insurance, this is often lower than VSPN
  // VSPKURZ = VSP1 (pension) + VSP3 (actual health/care)
  const vspkurz = vsp1.plus(vsp3);

  // PAP Decision: Use the HIGHER of the two methods
  // This ensures minimum tax deduction benefit
  let vsp = vspn.gt(vspkurz) ? vspn : vspkurz;

  // PAP 2025: Round UP to whole euros (ROUND_UP)
  // Reference: PAP general rounding rules
  return vsp.round(0, Big.roundUp);
}

/**
 * Calculate child allowance (Kinderfreibetrag) per BMF PAP 2025 Method MZTABFB
 * Reference: BMF PAP 2025 XML lines 857-879
 * Source: https://www.bmf-steuerrechner.de/javax.faces.resource/daten/xmls/Lohnsteuer2025.xml.xhtml
 *
 * Per official PAP 2025:
 * - Tax Class 1,2,3: €9,600 per child (full Kinderfreibetrag)
 * - Tax Class 4: €4,800 per child (half, as split between spouses)
 * - Tax Class 5,6: €0 (no child allowance)
 */
function calculateChildAllowance(taxClass: number, childrenCount?: number): BigJs.Big {
  if (!childrenCount || childrenCount <= 0) return new Big(0);

  // BMF PAP 2025 Method MZTABFB lines 869-879:
  // Tax Class 6: No child allowance (STKL == 6)
  if (taxClass === 6) return new Big(0);

  // Tax Class 5: No child allowance (STKL == 5)
  if (taxClass === 5) return new Big(0);

  // Tax Class 4: €4,800 per child (split between spouses)
  // PAP 2025 line 874: "KFB = ZKF * 4800"
  if (taxClass === 4) return new Big(4800).times(childrenCount);

  // Tax Class 1, 2, 3: €9,600 per child (full allowance)
  // PAP 2025 line 877: "KFB = ZKF * 9600"
  return new Big(9600).times(childrenCount);
}

/**
 * Calculate single parent relief (Entlastungsbetrag für Alleinerziehende) per §24b EStG
 * Reference: BMF PAP 2025 Method MZTABFB - EFA variable
 *
 * Only applies to Tax Class 2 (single parents)
 * Amount for 2025:
 * - Base: €4,260/year for first child
 * - Additional: +€240/year for each additional child
 *
 * Examples:
 * - 1 child: €4,260
 * - 2 children: €4,500 (€4,260 + €240)
 * - 3 children: €4,740 (€4,260 + €480)
 *
 * This relief reduces taxable income for single parents raising children alone.
 */
function calculateSingleParentRelief(taxClass: number, childrenCount?: number): BigJs.Big {
  // Only Tax Class 2 receives this relief
  if (taxClass !== 2) return new Big(0);

  // Must have at least one child
  if (!childrenCount || childrenCount <= 0) return new Big(0);

  // Base amount for first child per §24b Abs. 2 EStG
  const baseAmount = 4260;

  // Additional €240 per child beyond the first (§24b Abs. 2 Satz 2 EStG)
  const additionalChildren = Math.max(0, childrenCount - 1);
  const additionalAmount = additionalChildren * 240;

  return new Big(baseAmount + additionalAmount);
}

/**
 * Altersentlastungsbetrag lookup table per §24a EStG
 * Reference: BMF PAP 2025 TAB4 (percentage) and TAB5 (max amount)
 *
 * The age relief is being phased out from 2005 to 2058.
 * Values depend on the year the person turned 64.
 *
 * Key: Year person turned 64
 * Value: [percentage as decimal, max amount in EUR]
 */
const AGE_RELIEF_TABLE: Record<number, [number, number]> = {
  // Year turned 64 → [percentage, max EUR]
  2005: [0.400, 1900],  // and earlier
  2006: [0.384, 1824],
  2007: [0.368, 1748],
  2008: [0.352, 1672],
  2009: [0.336, 1596],
  2010: [0.320, 1520],
  2011: [0.304, 1444],
  2012: [0.288, 1368],
  2013: [0.272, 1292],
  2014: [0.256, 1216],
  2015: [0.240, 1140],
  2016: [0.224, 1064],
  2017: [0.208, 988],
  2018: [0.192, 912],
  2019: [0.176, 836],
  2020: [0.160, 760],
  2021: [0.152, 722],
  2022: [0.144, 684],
  2023: [0.140, 665],
  2024: [0.132, 627],
  2025: [0.128, 608],
  2026: [0.124, 589],
  2027: [0.120, 570],
  2028: [0.116, 551],
  2029: [0.112, 532],
  2030: [0.108, 513],
  2031: [0.104, 494],
  2032: [0.100, 475],
  2033: [0.096, 456],
  2034: [0.092, 437],
  2035: [0.088, 418],
  2036: [0.084, 399],
  2037: [0.080, 380],
  2038: [0.076, 361],
  2039: [0.072, 342],
  2040: [0.068, 323],
  // 2041+ continues decreasing until 0 in 2058
};

/**
 * Calculate age relief amount (Altersentlastungsbetrag) per BMF PAP 2025
 * Reference: BMF PAP 2025 Method MZTABFB + TAB4/TAB5 tables
 * Source: §24a EStG
 *
 * For employees 64+ years old, provides tax relief that varies by birth year.
 * The relief percentage and maximum amount depend on the year the person turned 64.
 *
 * Examples (for tax year 2025):
 * - Born 1960 (turned 64 in 2024): 13.2% up to €627
 * - Born 1961 (turned 64 in 2025): 12.8% up to €608
 * - Born 1941 or earlier: 40.0% up to €1,900
 *
 * @param bruttoAnnualEUR - Annual gross income in EUR
 * @param isOver64 - Whether employee is 64+ years old
 * @param birthYear - Year of birth (for calculating exact relief amount)
 * @returns Age relief amount in EUR
 */
function calculateAgeAllowance(bruttoAnnualEUR: BigJs.Big, isOver64?: boolean, birthYear?: number): BigJs.Big {
  if (!isOver64) return new Big(0);

  // Calculate the year they turned 64
  let yearTurned64: number;
  if (birthYear) {
    yearTurned64 = birthYear + 64;
  } else {
    // If birth year not provided, use conservative 2024 values (most common case for 2025)
    yearTurned64 = 2024;
  }

  // Look up values in table
  let percentage: number;
  let maxAmount: number;

  if (yearTurned64 <= 2005) {
    // 2005 or earlier: maximum values
    [percentage, maxAmount] = AGE_RELIEF_TABLE[2005];
  } else if (yearTurned64 >= 2040) {
    // 2040+: use 2040 values (continues decreasing but we cap at 2040 in our table)
    // For years beyond 2040, calculate the reduction
    const yearsAfter2040 = yearTurned64 - 2040;
    const basePercentage = 0.068;
    const baseMax = 323;
    // Each year: -0.4% percentage, -€19 max (approximate)
    percentage = Math.max(0, basePercentage - yearsAfter2040 * 0.004);
    maxAmount = Math.max(0, baseMax - yearsAfter2040 * 19);
  } else {
    // Use table lookup
    [percentage, maxAmount] = AGE_RELIEF_TABLE[yearTurned64] || [0.132, 627];  // Default to 2024 values
  }

  const relief = bruttoAnnualEUR.times(percentage);
  const maxBig = new Big(maxAmount);
  return relief.gt(maxBig) ? maxBig : relief;
}

/**
 * Calculate taxable income (zu versteuerndes Einkommen - ZVE)
 * Reference: BMF PAP 2025 method MRE4ABZ + MRE4JL + MZTABFB
 * ZVE = Gross - Vorsorgepauschale - Werbungskostenpauschale - Sonderausgabenpauschale - KFB - LZZFREIB + LZZHINZU - ALTER1
 *
 * This is the key calculation that reduces income before applying tax brackets!
 */
function calcTaxableIncome(
  bruttoAnnualEUR: BigJs.Big,
  taxClass: number = 1,
  isChildless: boolean = true,
  actualKvRate?: number,
  actualPvRate?: number,
  childrenCount?: number,
  monthlyTaxAllowance?: number,
  monthlyTaxSurcharge?: number,
  isOver64?: boolean,
  birthYear?: number
): BigJs.Big {
  // PAP 2025 standard deductions
  // For tax class 6: NO work expenses or special expenses deductions
  // Reference: BMF PAP 2025 Method MZTABFB - condition "STKL < 6" excludes class 6 from ANP and SAP
  const WERBUNGSKOSTENPAUSCHALE = taxClass < 6 ? new Big(1230) : new Big(0); // AN-Pauschbetrag (work expenses)
  const SONDERAUSGABENPAUSCHALE = taxClass < 6 ? new Big(36) : new Big(0);   // Sonderausgaben-Pauschbetrag

  // Calculate Vorsorgepauschale with childless status and actual rates
  const vsp = calcVorsorgepauschale(bruttoAnnualEUR, taxClass, isChildless, 0, actualKvRate, actualPvRate);

  // BMF PAP 2025 Method MZTABFB: Calculate child allowance (KFB)
  const childAllowance = calculateChildAllowance(taxClass, childrenCount);

  // BMF PAP 2025 Method MZTABFB: Calculate single parent relief (EFA)
  // Only for Tax Class 2: €4,260/year (§24b EStG)
  const singleParentRelief = calculateSingleParentRelief(taxClass, childrenCount);

  // BMF PAP 2025 Method MRE4JL: Convert monthly allowances to annual
  // LZZFREIB reduces taxable income, LZZHINZU increases it
  const annualTaxAllowance = monthlyTaxAllowance
    ? new Big(monthlyTaxAllowance).times(12).div(100)  // Convert cents to EUR
    : new Big(0);

  const annualTaxSurcharge = monthlyTaxSurcharge
    ? new Big(monthlyTaxSurcharge).times(12).div(100)  // Convert cents to EUR
    : new Big(0);

  // BMF PAP 2025: Calculate age relief (Altersentlastungsbetrag)
  const ageAllowance = calculateAgeAllowance(bruttoAnnualEUR, isOver64, birthYear);

  // PAP formula: ZVE = RE4 - VSP - AN-Pauschbetrag - Sonderausgaben - KFB - EFA - LZZFREIB + LZZHINZU - ALTER1
  const zve = bruttoAnnualEUR
    .minus(vsp)
    .minus(WERBUNGSKOSTENPAUSCHALE)
    .minus(SONDERAUSGABENPAUSCHALE)
    .minus(childAllowance)        // Child allowance per MZTABFB
    .minus(singleParentRelief)    // NEW: Single parent relief (Tax Class 2 only)
    .minus(annualTaxAllowance)    // Tax allowance per MRE4JL
    .plus(annualTaxSurcharge)      // Tax surcharge per MRE4JL
    .minus(ageAllowance);          // Age relief per MZTABFB

  // ZVE cannot be negative (PAP rule)
  return zve.lt(0) ? new Big(0) : zve;
}

/**
 * Calculate monthly wage tax (Lohnsteuer) according to BMF PAP 2025
 * Reference: PAP 2025 methods MLSTJAHR, UPLSTLZZ
 *
 * This calculates the exact wage tax following the official PAP procedure:
 * 1. Calculate taxable income (ZVE) with all deductions
 * 2. Apply progressive tax tariff (§32a EStG) or MST5_6 for tax classes 5/6
 * 3. Add solidarity surcharge (§3 SolzG) and church tax
 * 4. Convert annual tax to monthly amount
 */
function calculateTaxWithBMF(
  bruttoMonthly: number,
  taxClass: number,
  churchRate: number,
  isChildless: boolean = true,
  actualKvRate?: number,
  actualPvRate?: number,
  childrenCount?: number,
  monthlyTaxAllowance?: number,
  monthlyTaxSurcharge?: number,
  isOver64?: boolean,
  birthYear?: number,
  steuertage: number = 30
): number {
  // Convert monthly cents to annual EUR
  const annualEUR = new Big(bruttoMonthly).times(12).div(100);

  // PAP 2025: Calculate ZVE (taxable income) with all deductions
  // This is the CRITICAL step that reduces tax base before applying brackets
  const zve = calcTaxableIncome(
    annualEUR,
    taxClass,
    isChildless,
    actualKvRate,
    actualPvRate,
    childrenCount,
    monthlyTaxAllowance,
    monthlyTaxSurcharge,
    isOver64,
    birthYear
  );

  // Calculate income tax based on tax class
  let st: BigJs.Big;

  if (taxClass === 5 || taxClass === 6) {
    // Tax classes 5 and 6 use the special MST5_6 method
    // Reference: BMF PAP 2025 methods UP5_6 and MST5_6
    st = calcMST5_6(zve);
  } else if (taxClass === 3) {
    // Tax class 3: Split income, double the tax
    const taxable = zve.div(2);
    st = calcIncomeTax2025(taxable).times(2);
  } else {
    // Tax classes 1, 2, 4: Standard calculation
    st = calcIncomeTax2025(zve);
  }

  // Add solidarity surcharge (§3 SolzG with phase-out)
  const solz = calcSolz(st);

  // Add church tax if applicable
  const church = calcChurchTax(st, churchRate);

  // Total annual tax
  const total = st.plus(solz).plus(church);

  // Convert to monthly cents using steuertage (PAP: LSTLZZ)
  // Formula: annual_cents * (steuertage / 360) = monthly_cents
  return Number(total.times(100).times(steuertage).div(360).round(0, Big.roundHalfUp).toString());
}

// ============================================================================
// BMAS 2025 — SOCIAL SECURITY
// ============================================================================

function calculateSocialSecurityWithBMAS(
  bruttoMonthly: number,
  ctx: {
    midijob?: boolean;
    healthInsuranceRate?: number;
    pensionInsuranceRate?: number;
    unemploymentInsuranceRate?: number;
    careInsuranceRate?: number;
    childless?: boolean;
    childrenUnder25?: number;  // For multi-child PV discount per §55 SGB XI
    birthYear?: number;  // For PV childless surcharge age check (§55 Abs. 3 SGB XI)
  }
): number {
  // When rates are provided from payslip parsing, they are ALREADY employee shares
  // The AI extracts the employee share directly (e.g., 9.3% from "RV 18.6% / 9.3%")
  const kvRate = ctx.healthInsuranceRate
    ? ctx.healthInsuranceRate / 100  // Already employee share from payslip
    : BMAS_2025.KV_RATE + BMAS_2025.KV_ZUSATZ_RATE;

  // RV rate from payslip is already employee share (e.g., 9.3%)
  const rvRate = ctx.pensionInsuranceRate
    ? ctx.pensionInsuranceRate / 100  // Already employee share from payslip
    : BMAS_2025.RV_RATE;

  // AV rate from payslip is already employee share (e.g., 1.3%)
  const avRate = ctx.unemploymentInsuranceRate
    ? ctx.unemploymentInsuranceRate / 100  // Already employee share from payslip
    : BMAS_2025.AV_RATE;

  // PV rate: Use actual rate from payslip OR calculate with multi-child discount
  // §55 Abs. 3 SGB XI: Parents with 2+ children under 25 get reduced rates
  // §55 Abs. 3 SGB XI: Childless surcharge only applies to employees 23+
  let pvRate: number;
  if (ctx.careInsuranceRate !== undefined) {
    // Use rate from payslip (already includes any applicable discounts/surcharges)
    pvRate = ctx.careInsuranceRate / 100;
  } else {
    // Calculate using official formula with multi-child discount and age check
    pvRate = calculatePVRate(ctx.childless ?? true, ctx.childrenUnder25 ?? 0, ctx.birthYear);
  }

  // Midijob (Übergangsbereich) handling - §20 Abs. 2a SGB IV, §163 Abs. 10 SGB VI
  //
  // When midijob=true, we apply the Gleitzone factor which handles ALL cases:
  // - Income ≤ €556: Factor = 0 → Minijob, NOT Midijob (different rules apply)
  // - Income €556.01-€2000: Factor < 1 → Reduced employee contributions via Gleitzone formula
  // - Income > €2000: Factor = 1 → Full contributions apply
  //
  // Employee contribution base formula: AN-BE = (2000/(2000-556)) × (AE - 556)
  // At €556.01: AN-BE ≈ €0.01 (employee pays essentially nothing)
  // At €2000: AN-BE = €2000 (full contribution)
  //
  // Source: https://www.lohn-info.de/uebergangsbereich_gleitzone_2025.html
  if (ctx.midijob) {
    const f = calculateGleitzonenFaktor(bruttoMonthly);

    // Factor 0 means income ≤ €556 - employee pays nothing
    // This handles months where a Midijob employee has reduced hours
    if (f === 0) {
      return 0;
    }

    const reduced = bruttoMonthly * f;
    const kvpvBase = Math.min(reduced, BMAS_2025.KV_PV_CEILING);
    const rvavBase = Math.min(reduced, RV_CEILING);
    return Math.round(
      kvpvBase * kvRate +
      kvpvBase * pvRate +
      rvavBase * rvRate +
      rvavBase * avRate
    );
  }

  const kvpvBase = Math.min(bruttoMonthly, BMAS_2025.KV_PV_CEILING);
  const rvavBase = Math.min(bruttoMonthly, RV_CEILING);
  return Math.round(
    kvpvBase * kvRate +
    kvpvBase * pvRate +
    rvavBase * rvRate +
    rvavBase * avRate
  );
}

// ============================================================================
// MAIN — GROSS → NET CALCULATION
// ============================================================================

export interface NettoCalculationContext {
  midijob?: boolean;
  healthInsuranceRate?: number;
  pensionInsuranceRate?: number;
  unemploymentInsuranceRate?: number;
  careInsuranceRate?: number;
  childless?: boolean;
  childrenUnder25?: number;  // For multi-child PV discount per §55 SGB XI
  // BMF PAP 2025 Official Parameters
  childrenCount?: number;
  monthlyTaxAllowance?: number;
  monthlyTaxSurcharge?: number;
  isOver64?: boolean;
  birthYear?: number;
  // Tax calculation period
  steuertage?: number;  // Tax days per month (default: 30)
}

export interface NettoCalculationResult {
  netto: number;
  tax: number;
  socialSecurity: number;
}

export function calculateNettoFromBrutto(
  brutto: number,
  taxClass: number,
  churchRate: number,
  ctx: NettoCalculationContext
): NettoCalculationResult {
  // Calculate actual PV rate for Vorsorgepauschale
  // The careInsuranceRate from payslip is the base rate (e.g., 1.8%)
  // For childless, we add the surcharge (0.6%)
  let actualPvRate: number | undefined;
  if (ctx.careInsuranceRate !== undefined) {
    actualPvRate = ctx.careInsuranceRate;
    if (ctx.childless) {
      actualPvRate += 0.6; // Add childless surcharge
    }
  }

  // Pass childless status and actual rates to tax calculation for proper Vorsorgepauschale
  const tax = calculateTaxWithBMF(
    brutto,
    taxClass,
    churchRate,
    ctx.childless ?? true,
    ctx.healthInsuranceRate, // Actual KV rate (e.g., 9.05%)
    actualPvRate,             // Actual PV rate with childless surcharge (e.g., 2.4%)
    ctx.childrenCount,        // ZKF parameter
    ctx.monthlyTaxAllowance,  // LZZFREIB parameter
    ctx.monthlyTaxSurcharge,  // LZZHINZU parameter
    ctx.isOver64,             // ALTER1 parameter
    ctx.birthYear,            // For age relief calculation
    ctx.steuertage ?? 30      // Tax days per month
  );
  const sv = calculateSocialSecurityWithBMAS(brutto, ctx);
  return { netto: brutto - tax - sv, tax, socialSecurity: sv };
}

// ============================================================================
// EXPORT — calculateBruttoWithBMF (Net → Gross)
// ============================================================================

export function calculateBruttoWithBMF(
  input: BruttoCalculationInput
): BruttoCalculationOutput | null {
  const target = input.netto;
  const churchRate = input.churchTax ? (input.churchTaxRate ?? 9) : 0;

  // ============================================================================
  // STEP 1: Mini-Job Detection using RAW data (BMAS 2025 Official Rules)
  // ============================================================================
  // Mini-job is determined by contract type, NOT income amount!
  // Detection criteria (from raw payslip/contract data):
  // - personnelGroup === "109" (DEÜV Personengruppenschlüssel for Minijob)
  // - taxClass === "P" (Pauschsteuer) or "0" (no tax class)
  //
  // Rules for Mini-jobs (§8 SGB IV):
  // - Employee pays: 0% income tax, 0% social insurance (brutto = netto)
  // - Employer pays: 31.47% flat rate separately (not deducted from employee)
  // ============================================================================
  const isMinijob =
    input.personnelGroup === '109' ||
    input.taxClass === 'P' ||
    input.taxClass === '0';

  if (isMinijob) {
    return {
      brutto: target,  // Mini-job: brutto = netto (no employee deductions)
      confidence: 1.0,
      reasoning:
        `Mini-job (personnelGroup: ${input.personnelGroup || 'N/A'}, taxClass: ${input.taxClass}). ` +
        `Employee receives brutto = netto with no tax or social insurance deductions. ` +
        `Employer pays 31.47% flat-rate contributions separately (§8 SGB IV).`,
      taxDeductions: 0,
      socialSecurityDeductions: 0,
      iterations: 0,
    };
  }

  // ============================================================================
  // STEP 2: Validate tax class for regular employees
  // ============================================================================
  const taxClassNum = parseInt(input.taxClass, 10);
  if (isNaN(taxClassNum) || taxClassNum < 1 || taxClassNum > 6) {
    // Unknown tax class - cannot calculate
    return null;
  }

  const ctx = {
    midijob: input.midijob,
    healthInsuranceRate: input.healthInsuranceRate,
    pensionInsuranceRate: input.pensionInsuranceRate,
    unemploymentInsuranceRate: input.unemploymentInsuranceRate,
    careInsuranceRate: input.careInsuranceRate,
    childless: input.isChildless,
    childrenUnder25: input.childrenUnder25,  // For multi-child PV discount
    // BMF PAP 2025 Official Parameters
    childrenCount: input.childrenCount,
    monthlyTaxAllowance: input.monthlyTaxAllowance,
    monthlyTaxSurcharge: input.monthlyTaxSurcharge,
    isOver64: input.isOver64,
    birthYear: input.birthYear,
  };

  // reasonable search range: assume 25–50% deductions
  // For tax class 6, we need a wider range due to higher deductions
  let lo = Math.floor(target / 0.8);
  let hi = Math.ceil(target / 0.4);

  let best = { brutto: lo, netto: 0, tax: 0, sv: 0 };
  let iterations = 0;
  const maxIter = 40;
  const tol = 10; // 10 cents

  while (iterations++ < maxIter) {
    const mid = Math.round((lo + hi) / 2);
    const { netto, tax, socialSecurity } = calculateNettoFromBrutto(mid, taxClassNum, churchRate, ctx);

    if (Math.abs(netto - target) < Math.abs(best.netto - target))
      best = { brutto: mid, netto, tax, sv: socialSecurity };

    const diff = netto - target;
    if (Math.abs(diff) <= tol) break;
    if (diff < 0) lo = mid; else hi = mid;
  }

  const deviationEUR = Math.abs(best.netto - target) / 100;
  const confidence = deviationEUR < 1 ? 0.99 : deviationEUR < 2 ? 0.97 : 0.95;

  return {
    brutto: best.brutto,
    confidence,
    reasoning:
      `Computed using official BMF PAP 2025 (Lohnsteuer2025.xml). ` +
      `Applied §32a EStG progressive tariff with Vorsorgepauschale per §39b EStG. ` +
      `Tax class ${input.taxClass}${churchRate ? ` (Church ${churchRate}%)` : ""}` +
      `${input.isChildless ? " (childless surcharge 0.6%)" : ""}. ` +
      `Converged in ${iterations} iterations (Δ ≈ ${deviationEUR.toFixed(2)} €).`,
    taxDeductions: best.tax,
    socialSecurityDeductions: best.sv,
    iterations,
  };
}

// ============================================================================
// PUBLIC TAX CALCULATOR — DETAILED BREAKDOWN
// ============================================================================

/**
 * Detailed tax calculation result with individual breakdown
 * Used for public tax calculator UI to show each deduction separately
 */
export interface TaxCalculationDetailedResult {
  brutto: number;                    // Gross salary in cents
  netto: number;                     // Net salary in cents
  // Tax breakdown (all in cents)
  incomeTax: number;                 // Lohnsteuer
  solidaritySurcharge: number;       // Solidaritätszuschlag
  churchTax: number;                 // Kirchensteuer
  // Social security breakdown (all in cents)
  healthInsurance: number;           // Krankenversicherung (KV)
  pensionInsurance: number;          // Rentenversicherung (RV)
  unemploymentInsurance: number;     // Arbeitslosenversicherung (AV)
  careInsurance: number;             // Pflegeversicherung (PV)
  // Totals (all in cents)
  totalTax: number;
  totalSocialSecurity: number;
  totalDeductions: number;
}

/**
 * Input for public tax calculator
 */
export interface TaxCalculationDetailedInput {
  amount: number;                                      // Amount in cents
  direction: 'netto-to-brutto' | 'brutto-to-netto';   // Calculation direction
  taxClass: number;                                    // Tax class 1-6
  churchTax: boolean;                                  // Church tax enabled
  childrenCount?: number;                              // Number of children (for tax benefits)
  isSaxony?: boolean;                                  // Saxony PV rules (employer pays more)
  // Extended options
  midijob?: boolean;                                   // Midijob/Gleitzone
  monthlyTaxAllowance?: number;                        // Monthly tax allowance in cents
  monthlyTaxSurcharge?: number;                        // Monthly tax surcharge in cents
  // Social insurance rates (employee share in %)
  healthInsuranceRate?: number;                        // KV rate (default 8.55%)
  pensionInsuranceRate?: number;                       // RV rate (default 9.3%)
  unemploymentInsuranceRate?: number;                  // AV rate (default 1.3%)
  careInsuranceRate?: number;                          // PV base rate (default 1.8%)
  // Care insurance special options
  childlessSurcharge?: boolean;                        // +0.6% for childless over 23
  careInsuranceSurchargeRate?: number;                 // Custom surcharge rate (default 0.6%)
  // 100% accuracy options
  isOver64?: boolean;                                  // ALTER1 flag (age 64+ relief)
  birthYear?: number;                                  // Optional: for exact relief (omit = max relief)
  isPrivateInsurance?: boolean;                        // PKV flag
  privateInsuranceAmount?: number;                     // Monthly PKV premium in cents
  // Tax calculation period
  steuertage?: number;                                 // Tax days per month (default: 30)
}

/**
 * Calculate tax with detailed breakdown (individual components)
 * Internal helper for detailed calculation
 */
function calculateTaxWithBMFDetailed(
  bruttoMonthly: number,
  taxClass: number,
  churchRate: number,
  isChildless: boolean = true,
  actualKvRate?: number,
  actualPvRate?: number,
  childrenCount?: number,
  monthlyTaxAllowance?: number,
  monthlyTaxSurcharge?: number,
  isOver64?: boolean,
  birthYear?: number,
  steuertage: number = 30
): { incomeTax: number; solidaritySurcharge: number; churchTax: number } {
  // Convert monthly cents to annual EUR
  const annualEUR = new Big(bruttoMonthly).times(12).div(100);

  // Calculate ZVE (taxable income)
  const zve = calcTaxableIncome(
    annualEUR,
    taxClass,
    isChildless,
    actualKvRate,
    actualPvRate,
    childrenCount,
    monthlyTaxAllowance,
    monthlyTaxSurcharge,
    isOver64,
    birthYear
  );

  // Calculate income tax based on tax class
  let st: BigJs.Big;
  if (taxClass === 5 || taxClass === 6) {
    st = calcMST5_6(zve);
  } else if (taxClass === 3) {
    const taxable = zve.div(2);
    st = calcIncomeTax2025(taxable).times(2);
  } else {
    st = calcIncomeTax2025(zve);
  }

  // Calculate solidarity surcharge
  const solz = calcSolz(st);

  // Calculate church tax
  const church = calcChurchTax(st, churchRate);

  // Convert to monthly cents using steuertage
  // Formula: annual_cents * (steuertage / 360) = monthly_cents
  return {
    incomeTax: Number(st.times(100).times(steuertage).div(360).round(0, Big.roundHalfUp).toString()),
    solidaritySurcharge: Number(solz.times(100).times(steuertage).div(360).round(0, Big.roundHalfUp).toString()),
    churchTax: Number(church.times(100).times(steuertage).div(360).round(0, Big.roundHalfUp).toString()),
  };
}

/**
 * Calculate social security with detailed breakdown (individual components)
 * Internal helper for detailed calculation
 */
function calculateSocialSecurityWithBMASDetailed(
  bruttoMonthly: number,
  ctx: {
    midijob?: boolean;
    healthInsuranceRate?: number;
    pensionInsuranceRate?: number;
    unemploymentInsuranceRate?: number;
    careInsuranceRate?: number;
    childlessSurcharge?: boolean;
    careInsuranceSurchargeRate?: number;
    childless?: boolean;
    childrenCount?: number;
    isSaxony?: boolean;
    isPrivateInsurance?: boolean;
    privateInsuranceAmount?: number;
    birthYear?: number;  // For PV childless surcharge age check (§55 Abs. 3 SGB XI: only applies to 23+)
  }
): { healthInsurance: number; pensionInsurance: number; unemploymentInsurance: number; careInsurance: number } {
  // PKV (Private Health Insurance) - use fixed amount instead of percentage
  if (ctx.isPrivateInsurance && ctx.privateInsuranceAmount) {
    // For PKV: use the fixed monthly premium (includes both KV and PV)
    // RV and AV are still calculated normally (use custom rates if provided)
    const rvavBase = Math.min(bruttoMonthly, RV_CEILING);
    const rvRate = ctx.pensionInsuranceRate ? ctx.pensionInsuranceRate / 100 : BMAS_2025.RV_RATE;
    const avRate = ctx.unemploymentInsuranceRate ? ctx.unemploymentInsuranceRate / 100 : BMAS_2025.AV_RATE;

    return {
      healthInsurance: ctx.privateInsuranceAmount, // Fixed PKV premium (already in cents)
      pensionInsurance: Math.round(rvavBase * rvRate),
      unemploymentInsurance: Math.round(rvavBase * avRate),
      careInsurance: 0, // PKV premium includes PV
    };
  }

  // Get rates for GKV (statutory health insurance)
  const kvRate = ctx.healthInsuranceRate
    ? ctx.healthInsuranceRate / 100
    : BMAS_2025.KV_RATE + BMAS_2025.KV_ZUSATZ_RATE;

  // Use custom rates if provided, otherwise use BMAS 2025 defaults
  const rvRate = ctx.pensionInsuranceRate ? ctx.pensionInsuranceRate / 100 : BMAS_2025.RV_RATE;
  const avRate = ctx.unemploymentInsuranceRate ? ctx.unemploymentInsuranceRate / 100 : BMAS_2025.AV_RATE;

  // PV rate calculation
  // Use custom rate if provided, otherwise use BMAS default
  let pvRate: number;
  if (ctx.careInsuranceRate !== undefined) {
    pvRate = ctx.careInsuranceRate / 100;
  } else if (ctx.isSaxony) {
    // In Saxony, employees pay 0.775% more of the base rate
    pvRate = BMAS_2025.PV_BASE_RATE + 0.00775;
  } else {
    pvRate = BMAS_2025.PV_BASE_RATE;
  }

  // Add childless surcharge if applicable
  // Use custom surcharge rate if provided, otherwise use default 0.6%
  const surchargeRate = ctx.careInsuranceSurchargeRate !== undefined
    ? ctx.careInsuranceSurchargeRate / 100
    : BMAS_2025.PV_CHILDLESS_SURCHARGE;

  // §55 Abs. 3 SGB XI: Childless surcharge only applies to employees 23 years or older
  const isOver23 = (birthYear?: number): boolean => {
    if (birthYear === undefined) return true; // Conservative: assume over 23 if birth year unknown
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age >= 23;
  };

  // Determine if childless surcharge applies
  // Must be: (1) childless AND (2) age 23 or older
  const isChildless = ctx.childlessSurcharge !== undefined
    ? ctx.childlessSurcharge
    : (ctx.childless ?? (ctx.childrenCount === undefined || ctx.childrenCount === 0));

  if (isChildless && isOver23(ctx.birthYear)) {
    pvRate += surchargeRate;
  }

  // Apply multi-child discount (2nd-5th child under 25)
  // Only if not using custom careInsuranceRate (which would already include discounts)
  if (ctx.careInsuranceRate === undefined && ctx.childrenCount && ctx.childrenCount > 1) {
    const discountableChildren = Math.min(ctx.childrenCount - 1, 4);
    pvRate -= discountableChildren * BMAS_2025.PV_CHILD_DISCOUNT;
  }

  // Midijob handling
  if (ctx.midijob) {
    const f = calculateGleitzonenFaktor(bruttoMonthly);
    if (f === 0) {
      return { healthInsurance: 0, pensionInsurance: 0, unemploymentInsurance: 0, careInsurance: 0 };
    }

    const reduced = bruttoMonthly * f;
    const kvpvBase = Math.min(reduced, BMAS_2025.KV_PV_CEILING);
    const rvavBase = Math.min(reduced, RV_CEILING);

    return {
      healthInsurance: Math.round(kvpvBase * kvRate),
      pensionInsurance: Math.round(rvavBase * rvRate),
      unemploymentInsurance: Math.round(rvavBase * avRate),
      careInsurance: Math.round(kvpvBase * pvRate),
    };
  }

  // Regular calculation
  const kvpvBase = Math.min(bruttoMonthly, BMAS_2025.KV_PV_CEILING);
  const rvavBase = Math.min(bruttoMonthly, RV_CEILING);

  return {
    healthInsurance: Math.round(kvpvBase * kvRate),
    pensionInsurance: Math.round(rvavBase * rvRate),
    unemploymentInsurance: Math.round(rvavBase * avRate),
    careInsurance: Math.round(kvpvBase * pvRate),
  };
}

/**
 * Public Tax Calculator — Calculate with detailed breakdown
 *
 * Supports both directions:
 * - brutto-to-netto: Direct calculation
 * - netto-to-brutto: Binary search to find brutto
 *
 * Returns detailed breakdown of all deductions for UI display.
 *
 * @example
 * ```typescript
 * const result = calculateTaxDetailed({
 *   amount: 250000,  // €2,500.00 in cents
 *   direction: 'netto-to-brutto',
 *   taxClass: 1,
 *   churchTax: true,
 *   childrenCount: 0,
 * });
 * // result.brutto = ~350000 (€3,500.00)
 * // result.incomeTax = ~45600 (€456.00)
 * // etc.
 * ```
 */
export function calculateTaxDetailed(input: TaxCalculationDetailedInput): TaxCalculationDetailedResult {
  const churchRate = input.churchTax ? 9 : 0;
  const isChildless = !input.childrenCount || input.childrenCount === 0;

  // Calculate brutto based on direction
  let brutto: number;

  if (input.direction === 'brutto-to-netto') {
    // Direct: brutto is the input
    brutto = input.amount;
  } else {
    // Reverse: use binary search to find brutto from netto
    const target = input.amount;
    let lo = Math.floor(target / 0.8);
    let hi = Math.ceil(target / 0.4);
    let best = lo;
    let bestDiff = Infinity;

    const ctx: NettoCalculationContext = {
      midijob: input.midijob,
      healthInsuranceRate: input.healthInsuranceRate,
      pensionInsuranceRate: input.pensionInsuranceRate,
      unemploymentInsuranceRate: input.unemploymentInsuranceRate,
      careInsuranceRate: input.careInsuranceRate,
      childless: isChildless,
      childrenCount: input.childrenCount,
      monthlyTaxAllowance: input.monthlyTaxAllowance,
      monthlyTaxSurcharge: input.monthlyTaxSurcharge,
      isOver64: input.isOver64,
      birthYear: input.birthYear,
      steuertage: input.steuertage,
    };

    // Binary search
    for (let i = 0; i < 40; i++) {
      const mid = Math.round((lo + hi) / 2);
      const { netto } = calculateNettoFromBrutto(mid, input.taxClass, churchRate, ctx);

      const diff = Math.abs(netto - target);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = mid;
      }

      if (diff <= 10) break; // Within 10 cents tolerance
      if (netto < target) lo = mid;
      else hi = mid;
    }

    brutto = best;
  }

  // Calculate actual PV rate for VSP calculation
  // Must include childless surcharge if applicable (same logic as social security calculation)
  const actualPvRate = input.careInsuranceRate !== undefined
    ? input.careInsuranceRate + (isChildless && input.childlessSurcharge
        ? (input.careInsuranceSurchargeRate ?? 0.6)
        : 0)
    : undefined;

  // Now calculate detailed breakdown from brutto
  const taxBreakdown = calculateTaxWithBMFDetailed(
    brutto,
    input.taxClass,
    churchRate,
    isChildless,
    input.healthInsuranceRate,
    actualPvRate,
    input.childrenCount,
    input.monthlyTaxAllowance,
    input.monthlyTaxSurcharge,
    input.isOver64,
    input.birthYear,
    input.steuertage ?? 30
  );

  const svBreakdown = calculateSocialSecurityWithBMASDetailed(brutto, {
    midijob: input.midijob,
    healthInsuranceRate: input.healthInsuranceRate,
    pensionInsuranceRate: input.pensionInsuranceRate,
    unemploymentInsuranceRate: input.unemploymentInsuranceRate,
    careInsuranceRate: input.careInsuranceRate,
    childlessSurcharge: input.childlessSurcharge,
    careInsuranceSurchargeRate: input.careInsuranceSurchargeRate,
    childless: isChildless,
    childrenCount: input.childrenCount,
    isSaxony: input.isSaxony,
    isPrivateInsurance: input.isPrivateInsurance,
    privateInsuranceAmount: input.privateInsuranceAmount,
    birthYear: input.birthYear,  // Pass birthYear for PV childless surcharge age check
  });

  // Calculate totals
  const totalTax = taxBreakdown.incomeTax + taxBreakdown.solidaritySurcharge + taxBreakdown.churchTax;
  const totalSocialSecurity =
    svBreakdown.healthInsurance +
    svBreakdown.pensionInsurance +
    svBreakdown.unemploymentInsurance +
    svBreakdown.careInsurance;
  const totalDeductions = totalTax + totalSocialSecurity;
  const netto = brutto - totalDeductions;

  return {
    brutto,
    netto,
    // Tax breakdown
    incomeTax: taxBreakdown.incomeTax,
    solidaritySurcharge: taxBreakdown.solidaritySurcharge,
    churchTax: taxBreakdown.churchTax,
    // Social security breakdown
    healthInsurance: svBreakdown.healthInsurance,
    pensionInsurance: svBreakdown.pensionInsurance,
    unemploymentInsurance: svBreakdown.unemploymentInsurance,
    careInsurance: svBreakdown.careInsurance,
    // Totals
    totalTax,
    totalSocialSecurity,
    totalDeductions,
  };
}

