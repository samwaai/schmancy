/**
 * BMF 2025 Employment Type Classification Utility
 *
 * Official thresholds for employment classification in Germany, effective January 2025.
 *
 * ## Legal Basis
 * - Minijob (geringfügige Beschäftigung): §8 Abs. 1 Nr. 1 SGB IV
 * - Midijob (Übergangsbereich): §20 Abs. 2 SGB IV
 *
 * ## Official Sources (November 2025)
 * @see https://www.minijob-zentrale.de/DE/01_minijobs/02_gewerblich/01_grundlagen/01_450_euro_job/node.html
 *      Minijob-Zentrale - Official portal for mini-job regulations
 * @see https://www.bmas.de/DE/Soziales/Sozialversicherung/Sozialversicherungsrechengroessen/sozialversicherungsrechengroessen.html
 *      BMAS - Social security calculation values 2025
 * @see https://www.tk.de/firmenkunden/service/fachthemen/versicherung-fachthema/minijobs-uebergangsbereich-und-mindestlohn-2025-2046998
 *      TK - Minijobs, Übergangsbereich and minimum wage 2025
 *
 * ## Threshold Calculation (2025)
 * - Minimum wage: €12.82/hour (effective Jan 1, 2025)
 * - Monthly hours: 43.33 (520 hours/year ÷ 12 months, per §8 Abs. 1a SGB IV)
 * - Minijob limit: €12.82 × 43.33 ≈ €556/month (Geringfügigkeitsgrenze)
 * - Midijob limit: €2,000/month (Übergangsbereich upper bound, §20 Abs. 2 SGB IV)
 *
 * @module employment-type
 */

import type { PaymentType } from '../types/employees.types'

/**
 * BMF 2025 Employment Thresholds
 *
 * These values are legally mandated and change when minimum wage changes.
 *
 * @see https://www.gesetze-im-internet.de/sgb_4/__8.html
 *      §8 SGB IV - Definition of minor employment (Minijob)
 * @see https://www.gesetze-im-internet.de/sgb_4/__20.html
 *      §20 SGB IV - Gleitzone/Übergangsbereich formula
 */
export const BMF_2025 = {
	/**
	 * Minijob maximum monthly earnings (Geringfügigkeitsgrenze)
	 *
	 * Calculation: Minimum wage × monthly hours
	 * = €12.82/hour × 43.33 hours/month = €555.51 (rounded to €556)
	 *
	 * Legal basis: §8 Abs. 1 Nr. 1 SGB IV
	 * Effective: January 1, 2025
	 * Previous value (2024): €538 (based on €12.41 minimum wage)
	 *
	 * @see https://www.minijob-zentrale.de/
	 */
	MINIJOB_MAX: 556,

	/**
	 * Midijob/Übergangsbereich upper limit
	 *
	 * Employees earning between €556.01 and €2,000 are in the "Übergangsbereich"
	 * (transition zone) with reduced social security contributions.
	 *
	 * Legal basis: §20 Abs. 2 SGB IV
	 * Effective: January 1, 2023 (increased from €1,600)
	 *
	 * Gleitzone factor for 2025: F = 0.6683
	 * Formula: BE = F × 556 + ([2000/(2000-556)] - [556/(2000-556)] × F) × (AE - 556)
	 *
	 * @see https://www.tk.de/firmenkunden/service/fachthemen/versicherung-fachthema/minijobs-uebergangsbereich-und-mindestlohn-2025-2046998
	 */
	MIDIJOB_MAX: 2000,
} as const

/**
 * DEÜV Personengruppenschlüssel (Personnel Group Keys)
 *
 * Official codes per DEÜV (Datenerfassungs- und Übermittlungsverordnung)
 * for social security reporting.
 *
 * IMPORTANT: Midijob (Übergangsbereich) is NOT determined by personnelGroup!
 * Midijob employees typically use personnelGroup 101 (Regular) with the
 * "midijob" flag set to true (Übergangsbereich = ja in payroll systems).
 *
 * @see https://www.gkv-datenaustausch.de/arbeitgeber/deuev/gemeinsame_rundschreiben/gemeinsame_rundschreiben.jsp
 *      GKV-Spitzenverband - DEÜV Rundschreiben (official key catalog)
 * @see https://www.minijob-zentrale.de/DE/02_fuer_unternehmen/01_grundlagen/03_meldepflichten/node.html
 *      Minijob-Zentrale - Personengruppenschlüssel
 */
export const PERSONNEL_GROUP = {
	/** Sozialversicherungspflichtig Beschäftigte (regular employees with full social security) */
	REGULAR: '101',
	/** Auszubildende (apprentices) */
	APPRENTICE: '102',
	/** Altersteilzeit (partial retirement) */
	PARTIAL_RETIREMENT: '103',
	/** Praktikanten (interns) */
	INTERN: '105',
	/** Werkstudenten (working students) */
	WORKING_STUDENT: '106',
	/** Geringfügig entlohnte Beschäftigte (Minijob - §8 Abs. 1 Nr. 1 SGB IV) */
	MINIJOB: '109',
	/** Kurzfristig Beschäftigte (short-term employment - §8 Abs. 1 Nr. 2 SGB IV) */
	SHORT_TERM: '110',
	/** Altersvollrentner versicherungsfrei (pensioner exempt from insurance) */
	PENSIONER_EXEMPT: '119',
	/** Altersvollrentner versicherungspflichtig (pensioner with insurance obligation) */
	PENSIONER_INSURED: '120',
	/** Ausschließlich unfallversicherungspflichtig (accident insurance only - NOT Midijob!) */
	ACCIDENT_INSURANCE_ONLY: '190',
} as const

export type EmploymentType = 'minijob' | 'midijob' | 'fulltime'

/**
 * Employment status from taxInfo for classification
 */
export interface EmploymentStatusInfo {
	/** DEÜV Personengruppenschlüssel (e.g., "109" for Minijob, "101" for Regular) */
	personnelGroup?: string
	/**
	 * Midijob flag (Übergangsbereich = ja in payroll systems)
	 * This is the AUTHORITATIVE source for Midijob classification.
	 * Midijob employees use personnelGroup 101 with midijob = true.
	 */
	midijob?: boolean
}

/**
 * Determines the employment type based on DEÜV Personengruppe, midijob flag, and monthly earnings.
 *
 * ## Classification Priority (strict)
 * 1. If personnelGroup is "109" → minijob (official DEÜV classification)
 * 2. If midijob is true → midijob (Übergangsbereich flag from payroll)
 * 3. If personnelGroup is "101" or other → use earnings thresholds
 * 4. If no personnelGroup → fallback to earnings-based classification
 *
 * ## IMPORTANT: Midijob Detection
 * Midijob (Übergangsbereich) is determined by the `midijob` flag, NOT by personnelGroup!
 * Midijob employees typically use personnelGroup 101 (Regular) with midijob = true.
 * The old assumption that personnelGroup 190 = Midijob is WRONG.
 * 190 = "Ausschließlich unfallversicherungspflichtig" (Accident Insurance Only).
 *
 * ## Classification Rules (BMF 2025)
 *
 * | Personnel Group | midijob | Monthly Brutto | Result |
 * |-----------------|---------|----------------|--------|
 * | "109" | any | any | minijob |
 * | any | true | any | midijob |
 * | "101" or other | false/undefined | ≤ €556 | minijob (fallback) |
 * | "101" or other | false/undefined | €556.01 - €2,000 | midijob (fallback) |
 * | "101" or other | false/undefined | > €2,000 | fulltime |
 *
 * @see https://www.gkv-datenaustausch.de/arbeitgeber/deuev/gemeinsame_rundschreiben/gemeinsame_rundschreiben.jsp
 *      GKV-Spitzenverband - Official DEÜV Personengruppenschlüssel
 * @see https://www.minijob-zentrale.de/DE/02_fuer_unternehmen/01_grundlagen/03_meldepflichten/node.html
 *      Minijob-Zentrale - Registration requirements
 *
 * @param monthlyBrutto - Monthly gross salary in euros
 * @param statusInfo - Employment status info containing personnelGroup and/or midijob
 * @returns The employment type classification, or null if cannot be determined
 *
 * @example
 * // Minijob by personnelGroup (authoritative)
 * getEmploymentType(500, { personnelGroup: '109' }) // returns 'minijob'
 *
 * @example
 * // Midijob by midijob flag (authoritative)
 * getEmploymentType(1500, { personnelGroup: '101', midijob: true }) // returns 'midijob'
 *
 * @example
 * // Fulltime - regular employee above threshold
 * getEmploymentType(3000, { personnelGroup: '101' }) // returns 'fulltime'
 *
 * @example
 * // Fallback when no status info - use earnings
 * getEmploymentType(500) // returns 'minijob'
 * getEmploymentType(1500) // returns 'midijob'
 * getEmploymentType(3000) // returns 'fulltime'
 */
export function getEmploymentType(
	monthlyBrutto: number,
	statusInfo?: EmploymentStatusInfo | boolean,
): EmploymentType | null {
	// Handle legacy boolean parameter (midijob only)
	const normalizedStatus: EmploymentStatusInfo | undefined =
		typeof statusInfo === 'boolean' ? { midijob: statusInfo } : statusInfo

	const personnelGroup = normalizedStatus?.personnelGroup
	const midijob = normalizedStatus?.midijob

	// Priority 1: Minijob by Personengruppe 109 (authoritative)
	if (personnelGroup === PERSONNEL_GROUP.MINIJOB) {
		return 'minijob'
	}

	// Priority 2: Midijob by midijob flag (authoritative)
	// This is the CORRECT way to detect Midijob - via Übergangsbereich flag
	if (midijob === true) {
		return 'midijob'
	}

	// Priority 3: Use earnings-based classification

	// Minijob: ≤ €556
	if (monthlyBrutto <= BMF_2025.MINIJOB_MAX) {
		return 'minijob'
	}

	// Fulltime: > €2000 (above Übergangsbereich)
	if (monthlyBrutto > BMF_2025.MIDIJOB_MAX) {
		return 'fulltime'
	}

	// Übergangsbereich (€556-€2000): return midijob if not explicitly opted out
	if (midijob === false) {
		// Explicitly opted out of Übergangsbereich
		return null
	}

	// Default to midijob for earnings in Übergangsbereich range
	return 'midijob'
}

/**
 * DEÜV Personengruppenschlüssel labels (German and English)
 *
 * Human-readable labels for each personnel group code.
 * Used by getContractType for display purposes.
 */
export const PERSONNEL_GROUP_LABELS: Record<string, string> = {
	'101': 'Regular',              // Sozialversicherungspflichtig Beschäftigte
	'102': 'Apprentice',           // Auszubildende
	'103': 'Partial Retirement',   // Altersteilzeit
	'105': 'Intern',               // Praktikanten
	'106': 'Working Student',      // Werkstudenten
	'109': 'Minijob',              // Geringfügig entlohnt
	'110': 'Short-term',           // Kurzfristig Beschäftigte
	'119': 'Pensioner (exempt)',   // Altersvollrentner versicherungsfrei
	'120': 'Pensioner (insured)',  // Altersvollrentner versicherungspflichtig
	'190': 'Accident Ins. Only',   // Ausschließlich unfallversicherungspflichtig (NOT Midijob!)
}

/**
 * Tax info object for contract type determination.
 * Uses `midijob` field (Übergangsbereich = ja in payslips).
 */
export interface TaxInfoForContractType {
	personnelGroup?: string
	midijob?: boolean
}

/**
 * Gets the contract type display string based on taxInfo and paymentType.
 *
 * ## IMPORTANT: Midijob Detection
 * Midijob is determined by `midijob` flag (Übergangsbereich = ja), NOT by personnelGroup.
 *
 * ## Output Format
 * - If paymentType is "invoice": "Freelancer" (freelancers/contractors)
 * - If midijob is true: "Midijob (personnelGroup)" or just "Midijob"
 * - If personnelGroup is known: "Label (code)" e.g., "Minijob (109)"
 * - If personnelGroup is unknown: "Other (code)"
 * - If no personnelGroup: empty string
 *
 * @param taxInfo - Tax info object containing personnelGroup and midijob flag
 * @param paymentType - Optional payment type (flat, hourly, invoice)
 * @returns Display string like "Freelancer", "Midijob (101)", "Minijob (109)", or ""
 *
 * @example
 * getContractType({ personnelGroup: '109' })                 // returns "Minijob (109)"
 * getContractType({ personnelGroup: '101', midijob: true })  // returns "Midijob (101)"
 * getContractType({ personnelGroup: '101' })                 // returns "Regular (101)"
 * getContractType({ personnelGroup: '190' })                 // returns "Accident Ins. Only (190)"
 * getContractType(undefined, 'invoice')                      // returns "Freelancer"
 * getContractType(undefined)                                 // returns ""
 */
export function getContractType(taxInfo?: TaxInfoForContractType, paymentType?: PaymentType): string {
	// Invoice payment type = freelancer/contractor
	if (paymentType === 'invoice') return 'Freelancer'

	if (!taxInfo) return ''

	const personnelGroup = taxInfo.personnelGroup
	const isMidijob = taxInfo.midijob === true

	// Midijob is determined by midijob flag (Übergangsbereich=ja), not by personnelGroup
	if (isMidijob) {
		return personnelGroup ? `Midijob (${personnelGroup})` : 'Midijob'
	}

	if (!personnelGroup) return ''

	const label = PERSONNEL_GROUP_LABELS[personnelGroup] || 'Other'
	return `${label} (${personnelGroup})`
}

/**
 * Contract type value for filtering/comparison (without parenthetical code)
 *
 * @example
 * getContractTypeValue('109')                    // returns "minijob"
 * getContractTypeValue('101', true)              // returns "midijob"
 * getContractTypeValue('101')                    // returns "regular"
 * getContractTypeValue(undefined, false, 'invoice') // returns "freelancer"
 */
export function getContractTypeValue(personnelGroup: string | undefined, midijob?: boolean, paymentType?: PaymentType): string {
	// Invoice payment type = freelancer
	if (paymentType === 'invoice') return 'freelancer'
	if (midijob === true) return 'midijob'
	if (!personnelGroup) return ''

	const labels: Record<string, string> = {
		'101': 'regular',
		'102': 'apprentice',
		'103': 'partial_retirement',
		'105': 'intern',
		'106': 'working_student',
		'109': 'minijob',
		'110': 'short_term',
		'119': 'pensioner_exempt',
		'120': 'pensioner_insured',
		'190': 'accident_insurance_only',
	}

	return labels[personnelGroup] || 'other'
}

/**
 * All possible contract type values for filtering
 */
export const CONTRACT_TYPE_VALUES = [
	'freelancer',
	'minijob',
	'midijob',
	'regular',
	'apprentice',
	'partial_retirement',
	'intern',
	'working_student',
	'short_term',
	'pensioner_exempt',
	'pensioner_insured',
	'accident_insurance_only',
	'other',
] as const

export type ContractTypeValue = typeof CONTRACT_TYPE_VALUES[number]

/**
 * Display labels for contract type values
 */
export const CONTRACT_TYPE_LABELS: Record<ContractTypeValue, string> = {
	freelancer: 'Freelancer',
	minijob: 'Minijob',
	midijob: 'Midijob',
	regular: 'Regular',
	apprentice: 'Apprentice',
	partial_retirement: 'Partial Retirement',
	intern: 'Intern',
	working_student: 'Working Student',
	short_term: 'Short-term',
	pensioner_exempt: 'Pensioner (exempt)',
	pensioner_insured: 'Pensioner (insured)',
	accident_insurance_only: 'Accident Ins. Only',
	other: 'Other',
}
