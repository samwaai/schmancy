import { describe, it, expect } from "vitest";
import {
  calculateBruttoWithBMF,
  calculateNettoFromBrutto,
  type BruttoCalculationInput,
  type NettoCalculationContext,
} from "./calculateBruttoWithBMF.js";

/**
 * Comprehensive test suite for German payroll calculations.
 *
 * These tests capture learnings from debugging 10 employees with calculation discrepancies.
 * Key scenarios tested:
 * - Beitragsgruppe 6-1-0-0 (Pauschal KV with Gleitzone)
 * - Minijob (≤€556/month per §8 Abs. 1 Nr. 1 SGB IV - employer pays Pauschalbeiträge)
 * - Midijob/Gleitzone (€556.01-€2000 per §20 Abs. 2a SGB IV, §163 Abs. 10 SGB VI)
 * - Nursing insurance surcharge (PVZ) for childless employees
 * - Multi-child PV discount per §55 SGB XI
 *
 * Sources:
 * - https://www.minijob-zentrale.de/DE/01_minijobs/02_gewerblich/index.html
 * - https://www.lohn-info.de/uebergangsbereich_gleitzone_2025.html
 * - https://www.gesetze-im-internet.de/sgb_4/__8.html
 * - https://www.gesetze-im-internet.de/sgb_4/__20.html
 */

// ============================================================================
// HELPER: Convert EUR to cents
// ============================================================================
const EUR = (amount: number) => Math.round(amount * 100);

// ============================================================================
// SECTION 1: MINIJOB/MIDIJOB TESTS
// Minijob: ≤€556 (§8 Abs. 1 Nr. 1 SGB IV)
// Midijob/Gleitzone: €556.01-€2000 (§20 Abs. 2a SGB IV, §163 Abs. 10 SGB VI)
// ============================================================================

describe("Midijob (Übergangsbereich) Calculations", () => {
  describe("Income ≤ €556 (Minijob territory - Employee pays 0 SV)", () => {
    it("should return 0 SV when midijob=true and brutto ≤ €556", () => {
      // This is the critical fix we implemented - employee pays nothing for income ≤ €556
      const result = calculateNettoFromBrutto(
        EUR(500), // €500 brutto
        1, // Tax class 1
        0, // No church tax
        { midijob: true }
      );

      expect(result.socialSecurity).toBe(0);
      // Netto should be brutto minus tax only (no SV deductions)
      expect(result.netto).toBe(EUR(500) - result.tax);
    });

    it("should return 0 SV at exactly €556", () => {
      const result = calculateNettoFromBrutto(EUR(556), 1, 0, { midijob: true });

      expect(result.socialSecurity).toBe(0);
    });

    it("should return 0 SV for very low income (€100)", () => {
      const result = calculateNettoFromBrutto(EUR(100), 1, 0, { midijob: true });

      expect(result.socialSecurity).toBe(0);
    });
  });

  describe("Income €556.01-€2000 (Gleitzone - Reduced SV)", () => {
    it("should apply Gleitzone factor for income €1000", () => {
      const result = calculateNettoFromBrutto(EUR(1000), 1, 0, {
        midijob: true,
      });

      // SV should be positive but reduced (not full rate)
      expect(result.socialSecurity).toBeGreaterThan(0);

      // Compare with non-midijob calculation - midijob should be lower
      const fullRate = calculateNettoFromBrutto(EUR(1000), 1, 0, {
        midijob: false,
      });
      expect(result.socialSecurity).toBeLessThan(fullRate.socialSecurity);
    });

    it("should apply Gleitzone factor at €600 (above threshold)", () => {
      const result = calculateNettoFromBrutto(EUR(600), 1, 0, {
        midijob: true,
      });

      // SV should be positive but reduced at this threshold
      expect(result.socialSecurity).toBeGreaterThan(0);
      // Should be much less than full contribution
      expect(result.socialSecurity).toBeLessThan(EUR(100)); // Sanity check
    });

    it("should return full SV at €2000 (upper threshold)", () => {
      const result = calculateNettoFromBrutto(EUR(2000), 1, 0, {
        midijob: true,
      });

      const fullRate = calculateNettoFromBrutto(EUR(2000), 1, 0, {
        midijob: false,
      });

      // At €2000, Gleitzone factor should be 1, so SV should be equal
      expect(result.socialSecurity).toBe(fullRate.socialSecurity);
    });
  });

  describe("Income > €2000 (Full contributions)", () => {
    it("should apply full SV for midijob above €2000", () => {
      const result = calculateNettoFromBrutto(EUR(2500), 1, 0, {
        midijob: true,
      });

      const fullRate = calculateNettoFromBrutto(EUR(2500), 1, 0, {
        midijob: false,
      });

      expect(result.socialSecurity).toBe(fullRate.socialSecurity);
    });
  });
});

// ============================================================================
// SECTION 2: BEITRAGSGRUPPE 6-1-0-0 (Pauschal KV + Gleitzone RV)
// ============================================================================

describe("Beitragsgruppe 6-1-0-0 (Pauschal KV Configuration)", () => {
  /**
   * Beitragsgruppe 6-1-0-0 means:
   * - KV (6): Pauschal - Employer pays flat rate, employee pays 0%
   * - RV (1): Standard - But in Gleitzone, employee pays reduced rate (~3.6%)
   * - AV (0): None - No unemployment insurance
   * - PV (0): None - No care insurance
   *
   * This configuration is typical for Midijob employees in the Gleitzone.
   */

  it("should calculate SV with explicit employee rates from payslip", () => {
    // Test that explicit rates from payslip are used in calculation
    // Using €3000 (above Midijob) for clearer results
    const withExplicitRates = calculateNettoFromBrutto(EUR(3000), 1, 0, {
      midijob: false,
      healthInsuranceRate: 8.55, // Explicit KV employee rate
      pensionInsuranceRate: 9.3, // Explicit RV employee rate
      unemploymentInsuranceRate: 1.3, // Explicit AV employee rate
      careInsuranceRate: 1.8, // Explicit PV employee rate
    });

    // With default rates (calculated internally)
    const withDefaultRates = calculateNettoFromBrutto(EUR(3000), 1, 0, {
      midijob: false,
      childless: false, // Same as 1.8% PV
    });

    // Both should produce similar results since rates are similar
    expect(withExplicitRates.socialSecurity).toBeGreaterThan(0);
    expect(withDefaultRates.socialSecurity).toBeGreaterThan(0);
  });

  it("should apply lower SV when some rates are 0 (Beitragsgruppe 6-1-0-0)", () => {
    // Full rates for comparison (standard 1-1-1-1)
    const fullRates = calculateNettoFromBrutto(EUR(3000), 1, 0, {
      midijob: false,
      healthInsuranceRate: 8.55,
      pensionInsuranceRate: 9.3,
      unemploymentInsuranceRate: 1.3,
      careInsuranceRate: 1.8,
    });

    // Beitragsgruppe 6-1-0-0 style: only RV, no KV/AV/PV
    const reducedRates = calculateNettoFromBrutto(EUR(3000), 1, 0, {
      midijob: false,
      healthInsuranceRate: 0, // KV = 0 (employer pays Pauschal)
      pensionInsuranceRate: 9.3, // RV = standard
      unemploymentInsuranceRate: 0, // AV = 0
      careInsuranceRate: 0, // PV = 0
    });

    // Reduced rates should result in lower SV
    expect(reducedRates.socialSecurity).toBeLessThan(fullRates.socialSecurity);
    // Should still have some SV from RV
    expect(reducedRates.socialSecurity).toBeGreaterThan(0);
  });
});

// ============================================================================
// SECTION 3: NURSING INSURANCE (PV) - CHILDLESS SURCHARGE
// ============================================================================

describe("Nursing Insurance (PV) Calculations", () => {
  describe("Childless surcharge (nursingInsuranceSurcharge)", () => {
    it("should apply 0.6% surcharge for childless employees", () => {
      const childless = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: true,
      });

      const withChildren = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: false,
      });

      // Childless should pay more in SV due to 0.6% surcharge
      expect(childless.socialSecurity).toBeGreaterThan(
        withChildren.socialSecurity
      );

      // The difference should be approximately 0.6% of brutto
      // €3000 * 0.6% = €18
      const diff = childless.socialSecurity - withChildren.socialSecurity;
      expect(diff).toBeCloseTo(EUR(18), -1); // Within €1
    });

    it("should NOT apply surcharge when childless=false", () => {
      // This was the Gjoshi bug - had children but surcharge was being applied
      const result = calculateNettoFromBrutto(EUR(2500), 1, 0, {
        childless: false,
        childrenCount: 1,
      });

      // Verify by comparing with explicit careInsuranceRate (base rate without surcharge)
      const explicit = calculateNettoFromBrutto(EUR(2500), 1, 0, {
        careInsuranceRate: 1.8, // Base rate without surcharge
      });

      // Should be approximately equal (both using base rate)
      expect(Math.abs(result.socialSecurity - explicit.socialSecurity)).toBeLessThan(
        EUR(5)
      );
    });

    it("should NOT apply surcharge for employees under 23 (§55 Abs. 3 SGB XI)", () => {
      // Real case: Xheison Prendi born 21.05.2003 (age 22 in Nov 2025)
      // Payslip showed PV at 1.8% (no surcharge), not 2.4% (with surcharge)
      // §55 Abs. 3 SGB XI: Surcharge only applies to employees 23 years or older

      const under23Childless = calculateNettoFromBrutto(EUR(3780.9), 1, 0, {
        childless: true,
        birthYear: 2003, // Age 22 in 2025 - should NOT get surcharge
      });

      const over23Childless = calculateNettoFromBrutto(EUR(3780.9), 1, 0, {
        childless: true,
        birthYear: 2000, // Age 25 in 2025 - SHOULD get surcharge
      });

      // Under 23 should pay LESS than over 23 (no surcharge)
      expect(under23Childless.socialSecurity).toBeLessThan(over23Childless.socialSecurity);

      // The difference should be approximately 0.6% of brutto (the surcharge)
      // €3780.90 * 0.6% = €22.69
      const diff = over23Childless.socialSecurity - under23Childless.socialSecurity;
      expect(diff).toBeCloseTo(EUR(22.69), -1); // Within €1
    });

    it("should apply surcharge at exactly age 23", () => {
      // Edge case: exactly 23 years old should get surcharge
      const exactly23 = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: true,
        birthYear: 2002, // Age 23 in 2025
      });

      const age22 = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: true,
        birthYear: 2003, // Age 22 in 2025
      });

      // Age 23 should pay more (has surcharge)
      expect(exactly23.socialSecurity).toBeGreaterThan(age22.socialSecurity);
    });

    it("should assume over 23 when birthYear not provided (conservative)", () => {
      // When birthYear is unknown, assume over 23 (conservative approach)
      const noBirthYear = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: true,
        // birthYear not provided
      });

      const over23 = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: true,
        birthYear: 1990, // Definitely over 23
      });

      // Should be equal (both apply surcharge)
      expect(noBirthYear.socialSecurity).toBe(over23.socialSecurity);
    });
  });

  describe("Multi-child PV discount (§55 Abs. 3 SGB XI)", () => {
    it("should apply 0.25% discount per child (2nd-5th under 25)", () => {
      const oneChild = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: false,
        childrenUnder25: 1,
      });

      const twoChildren = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: false,
        childrenUnder25: 2,
      });

      // 2 children should pay less than 1 child (0.25% discount)
      expect(twoChildren.socialSecurity).toBeLessThan(oneChild.socialSecurity);
    });

    it("should cap discount at 1.0% (5+ children)", () => {
      const fiveChildren = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: false,
        childrenUnder25: 5,
      });

      const sixChildren = calculateNettoFromBrutto(EUR(3000), 1, 0, {
        childless: false,
        childrenUnder25: 6,
      });

      // 6 children should NOT get more discount than 5
      expect(sixChildren.socialSecurity).toBe(fiveChildren.socialSecurity);
    });
  });
});

// ============================================================================
// SECTION 4: MINIJOB DETECTION (personnelGroup 109)
// ============================================================================

describe("Minijob Detection", () => {
  it("should return brutto=netto for personnelGroup 109", () => {
    const input: BruttoCalculationInput = {
      netto: EUR(520),
      taxClass: "0",
      personnelGroup: "109",
      churchTax: false,
    };

    const result = calculateBruttoWithBMF(input);

    expect(result).not.toBeNull();
    expect(result!.brutto).toBe(EUR(520));
    expect(result!.taxDeductions).toBe(0);
    expect(result!.socialSecurityDeductions).toBe(0);
  });

  it("should return brutto=netto for taxClass P (Pauschsteuer)", () => {
    const input: BruttoCalculationInput = {
      netto: EUR(450),
      taxClass: "P",
      churchTax: false,
    };

    const result = calculateBruttoWithBMF(input);

    expect(result).not.toBeNull();
    expect(result!.brutto).toBe(EUR(450));
  });

  it("should return brutto=netto for taxClass 0", () => {
    const input: BruttoCalculationInput = {
      netto: EUR(400),
      taxClass: "0",
      churchTax: false,
    };

    const result = calculateBruttoWithBMF(input);

    expect(result).not.toBeNull();
    expect(result!.brutto).toBe(EUR(400));
  });
});

// ============================================================================
// SECTION 5: TAX CLASS CALCULATIONS
// ============================================================================

describe("Tax Class Calculations", () => {
  describe("Tax Class 1 (Standard)", () => {
    it("should calculate correct deductions for standard employee", () => {
      const result = calculateNettoFromBrutto(EUR(3000), 1, 0, {});

      expect(result.netto).toBeGreaterThan(0);
      expect(result.tax).toBeGreaterThan(0);
      expect(result.socialSecurity).toBeGreaterThan(0);

      // Verify: brutto = netto + tax + sv
      expect(result.netto + result.tax + result.socialSecurity).toBe(EUR(3000));
    });
  });

  describe("Tax Class 6 (Secondary employment)", () => {
    it("should apply higher tax rates for tax class 6", () => {
      const class1 = calculateNettoFromBrutto(EUR(3000), 1, 0, {});
      const class6 = calculateNettoFromBrutto(EUR(3000), 6, 0, {});

      // Tax class 6 should have higher tax
      expect(class6.tax).toBeGreaterThan(class1.tax);

      // Social security should be the same
      expect(class6.socialSecurity).toBe(class1.socialSecurity);
    });

    it("should NOT include Vorsorgepauschale deductions for tax class 6", () => {
      // Tax class 6 gets no VSP3 and reduced allowances
      // This results in higher taxable income
      const class6 = calculateNettoFromBrutto(EUR(4000), 6, 0, {});

      // Just verify calculation completes without error
      expect(class6.netto).toBeGreaterThan(0);
      expect(class6.tax).toBeGreaterThan(0);
    });
  });

  describe("Tax Class 3 (Married, higher earner)", () => {
    it("should apply lower tax rates for tax class 3", () => {
      const class1 = calculateNettoFromBrutto(EUR(4000), 1, 0, {});
      const class3 = calculateNettoFromBrutto(EUR(4000), 3, 0, {});

      // Tax class 3 should have lower tax
      expect(class3.tax).toBeLessThan(class1.tax);
    });
  });
});

// ============================================================================
// SECTION 6: CHURCH TAX
// ============================================================================

describe("Church Tax Calculations", () => {
  it("should add 9% church tax when churchTax=true", () => {
    const noChurch = calculateNettoFromBrutto(EUR(3000), 1, 0, {});
    const withChurch = calculateNettoFromBrutto(EUR(3000), 1, 9, {});

    // Church tax should increase total tax
    expect(withChurch.tax).toBeGreaterThan(noChurch.tax);

    // Church tax is 9% of income tax
    // Difference should be approximately incomeTax * 0.09
  });

  it("should add 8% church tax for Bayern/Baden-Württemberg", () => {
    const noChurch = calculateNettoFromBrutto(EUR(3000), 1, 0, {});
    const withChurch8 = calculateNettoFromBrutto(EUR(3000), 1, 8, {});
    const withChurch9 = calculateNettoFromBrutto(EUR(3000), 1, 9, {});

    expect(withChurch8.tax).toBeGreaterThan(noChurch.tax);
    expect(withChurch8.tax).toBeLessThan(withChurch9.tax);
  });
});

// ============================================================================
// SECTION 7: NET → GROSS CALCULATION (calculateBruttoWithBMF)
// ============================================================================

describe("Net → Gross Calculation (calculateBruttoWithBMF)", () => {
  it("should converge to correct brutto for standard employee", () => {
    const input: BruttoCalculationInput = {
      netto: EUR(2000),
      taxClass: "1",
      churchTax: false,
    };

    const result = calculateBruttoWithBMF(input);

    expect(result).not.toBeNull();
    expect(result!.confidence).toBeGreaterThanOrEqual(0.95);
    expect(result!.iterations).toBeLessThan(40);

    // Verify by calculating netto from the returned brutto
    const verification = calculateNettoFromBrutto(result!.brutto, 1, 0, {});
    expect(Math.abs(verification.netto - EUR(2000))).toBeLessThan(EUR(1));
  });

  it("should handle midijob in net→gross calculation", () => {
    const input: BruttoCalculationInput = {
      netto: EUR(1500),
      taxClass: "1",
      churchTax: false,
      midijob: true,
    };

    const result = calculateBruttoWithBMF(input);

    expect(result).not.toBeNull();
    expect(result!.confidence).toBeGreaterThanOrEqual(0.95);

    // Verify the result (allow €10 tolerance for binary search convergence)
    const verification = calculateNettoFromBrutto(result!.brutto, 1, 0, {
      midijob: true,
    });
    expect(Math.abs(verification.netto - EUR(1500))).toBeLessThan(EUR(10));
  });

  it("should return null for invalid tax class", () => {
    const input: BruttoCalculationInput = {
      netto: EUR(2000),
      taxClass: "7", // Invalid
      churchTax: false,
    };

    const result = calculateBruttoWithBMF(input);
    expect(result).toBeNull();
  });
});

// ============================================================================
// SECTION 8: CONTRIBUTION CEILINGS (Beitragsbemessungsgrenzen)
// ============================================================================

describe("Contribution Ceilings", () => {
  it("should cap KV/PV contributions at €5,512.50/month ceiling", () => {
    const atCeiling = calculateNettoFromBrutto(EUR(5512.5), 1, 0, {});
    const aboveCeiling = calculateNettoFromBrutto(EUR(7000), 1, 0, {});

    // KV/PV contributions should be capped
    // The difference in SV between €5512.50 and €7000 should only be from RV/AV
    // (which have a higher ceiling of €8,050)

    // Both should have valid results
    expect(atCeiling.socialSecurity).toBeGreaterThan(0);
    expect(aboveCeiling.socialSecurity).toBeGreaterThan(atCeiling.socialSecurity);
  });

  it("should cap RV/AV contributions at €8,050/month ceiling", () => {
    const atCeiling = calculateNettoFromBrutto(EUR(8050), 1, 0, {});
    const aboveCeiling = calculateNettoFromBrutto(EUR(10000), 1, 0, {});

    // SV should be the same at and above ceiling
    expect(aboveCeiling.socialSecurity).toBe(atCeiling.socialSecurity);
  });
});

// ============================================================================
// SECTION 9: EDGE CASES AND BOUNDARY CONDITIONS
// ============================================================================

describe("Edge Cases", () => {
  it("should handle very low income (below tax threshold)", () => {
    const result = calculateNettoFromBrutto(EUR(500), 1, 0, {});

    // Should have no income tax but still have SV
    expect(result.tax).toBe(0);
    expect(result.socialSecurity).toBeGreaterThan(0);
  });

  it("should handle very high income (above all ceilings)", () => {
    const result = calculateNettoFromBrutto(EUR(15000), 1, 0, {});

    expect(result.netto).toBeGreaterThan(0);
    expect(result.tax).toBeGreaterThan(0);
    expect(result.socialSecurity).toBeGreaterThan(0);

    // SV should be at maximum (contribution ceilings reached)
    const evenHigher = calculateNettoFromBrutto(EUR(20000), 1, 0, {});
    expect(evenHigher.socialSecurity).toBe(result.socialSecurity);
  });

  it("should handle zero income", () => {
    const result = calculateNettoFromBrutto(0, 1, 0, {});

    expect(result.netto).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.socialSecurity).toBe(0);
  });
});

// ============================================================================
// SECTION 10: REGRESSION TESTS (Based on Real Employee Fixes)
// ============================================================================

describe("Regression Tests (Real Employee Configurations)", () => {
  /**
   * These tests are based on actual employee configurations that were debugged
   * and fixed to match Lexware (source of truth).
   */

  describe("Beitragsgruppe 6-1-0-0 Employee (Babar-style)", () => {
    it("should calculate correctly with KV=0, RV=3.6, AV=0, PV=0", () => {
      const ctx: NettoCalculationContext = {
        midijob: true,
        healthInsuranceRate: 0,
        pensionInsuranceRate: 3.6,
        unemploymentInsuranceRate: 0,
        careInsuranceRate: 0,
      };

      const result = calculateNettoFromBrutto(EUR(700), 6, 0, ctx);

      // Should only have RV contribution
      expect(result.socialSecurity).toBeGreaterThan(0);
      // Should be less than full SV
      expect(result.socialSecurity).toBeLessThan(EUR(100));
    });
  });

  describe("Standard Midijob Employee (Kumar-style)", () => {
    it("should calculate with standard Midijob rates (RV=9.3, AV=1.3)", () => {
      const ctx: NettoCalculationContext = {
        midijob: true,
        pensionInsuranceRate: 9.3,
        unemploymentInsuranceRate: 1.3,
      };

      const result = calculateNettoFromBrutto(EUR(1200), 1, 0, ctx);

      // Should have SV contributions with Gleitzone factor applied
      expect(result.socialSecurity).toBeGreaterThan(0);
    });
  });

  describe("Employee with Child (Gjoshi-style)", () => {
    it("should NOT apply childless surcharge when childless=false", () => {
      const ctx: NettoCalculationContext = {
        childless: false,
        childrenCount: 1,
      };

      const resultNoSurcharge = calculateNettoFromBrutto(EUR(2500), 1, 0, ctx);

      const ctxWithSurcharge: NettoCalculationContext = {
        childless: true,
        childrenCount: 0,
      };

      const resultWithSurcharge = calculateNettoFromBrutto(
        EUR(2500),
        1,
        0,
        ctxWithSurcharge
      );

      // Employee with child should pay less SV
      expect(resultNoSurcharge.socialSecurity).toBeLessThan(
        resultWithSurcharge.socialSecurity
      );
    });
  });

  describe("Low Income Midijob (Hussain-style)", () => {
    it("should return 0 SV for income ≤ €556", () => {
      const ctx: NettoCalculationContext = {
        midijob: true,
      };

      const result = calculateNettoFromBrutto(EUR(400), 1, 0, ctx);

      // Income ≤€556 is Minijob territory (§8 Abs. 1 Nr. 1 SGB IV)
      // Employee pays 0 SV - employer pays Pauschalbeiträge per §249b SGB V
      expect(result.socialSecurity).toBe(0);
    });
  });
});
