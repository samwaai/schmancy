/**
 * Payslip Types - For payslip management following Jose's pattern
 */

export interface Payslip {
	id?: string;
	orgId: string;
	month: string;         // "01" - "12"
	year: string;          // "2025"
	tag: string;   // Tag to identify multiple payslips per month (e.g. "Initial", "Revised", "Final")
	downloadURL: string;   // Firebase Storage URL for PDF
	uploadedAt: string;    // ISO timestamp
	uploadedBy: string;    // User ID who uploaded
	uploadedByName?: string; // Name of uploader for display
	fileSize?: number;     // File size in bytes
	fileName?: string;     // Original file name
}

// For individual employee payslip requests (generated on-demand)
export interface EmployeePayslipRequest {
	orgId: string;
	employeeId: string;
	employeeName: string;
	month: string;
	year: string;
}

// Response for individual employee payslip extraction
export interface EmployeePayslipResponse {
	success: boolean;
	downloadURL?: string;
	pdfBase64?: string;
	message?: string;
}