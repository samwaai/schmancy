import type { Employee } from '../types/employees.types.js';

/**
 * Check if an employee has the required tax info for netto calculation.
 *
 * Tax info is NOT required when:
 * - Minijob (personnelGroup === '109'): no tax deductions
 * - Invoice employees: handle their own taxes
 * - rateType !== 'brutto': rate is already netto (no conversion needed)
 *
 * Tax info IS required when:
 * - rateType === 'brutto': need to calculate netto from brutto
 */
export function hasTaxInfoForNetto(employee: Employee): boolean {
  // Minijobs have no tax deductions
  if (employee.taxInfo?.personnelGroup === '109') return true;
  // Invoice employees handle their own taxes
  if (employee.paymentType === 'invoice') return true;
  // If rate is already netto (explicit or default), no conversion needed
  // Note: undefined = netto for backwards compatibility
  if (employee.rateType !== 'brutto') return true;

  // Only brutto rates need tax info for conversion
  const taxInfo = employee.taxInfo;
  if (!taxInfo) return false;

  // Check required fields for BMF calculation
  return (
    taxInfo.taxClass !== undefined &&
    taxInfo.healthInsuranceEmployeeRate !== undefined &&
    taxInfo.pensionInsuranceEmployeeRate !== undefined &&
    taxInfo.unemploymentInsuranceEmployeeRate !== undefined &&
    taxInfo.careInsuranceEmployeeRate !== undefined
  );
}

/**
 * Get list of missing tax info fields for an employee.
 * Returns empty array when tax info is not needed.
 */
export function getMissingTaxInfoFields(employee: Employee): string[] {
  // Minijobs and invoice employees don't need tax info
  if (employee.taxInfo?.personnelGroup === '109') return [];
  if (employee.paymentType === 'invoice') return [];
  // If rate is already netto, no tax info needed
  if (employee.rateType !== 'brutto') return [];

  const missing: string[] = [];
  const taxInfo = employee.taxInfo;

  if (!taxInfo?.taxClass) missing.push('Steuerklasse');
  if (taxInfo?.healthInsuranceEmployeeRate === undefined) missing.push('KV-Beitrag');
  if (taxInfo?.pensionInsuranceEmployeeRate === undefined) missing.push('RV-Beitrag');
  if (taxInfo?.unemploymentInsuranceEmployeeRate === undefined) missing.push('AV-Beitrag');
  if (taxInfo?.careInsuranceEmployeeRate === undefined) missing.push('PV-Beitrag');

  return missing;
}
