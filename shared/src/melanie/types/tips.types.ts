import { CategoryRevenue } from '../../organization/pos/speedy/types';
import type { Shift } from './attendance.types';

// Hourly category breakdown for detailed analysis
export interface HourlyCategoryBreakdown {
  hour: string;
  category: string;
  sales: number;      // in euros (like individualItemBreakdown.revenue)
  quantity: number;
  receipts: number;
}

// API Request for tips calculation
export interface CalculateTipsRequest {
  businessIds?: string[];      // Array of business IDs (preferred, new field name)
  startDate: string;           // Format: YYYY-MM-DD
  endDate: string;             // Format: YYYY-MM-DD
  orgId: string;              // Organization ID for multi-tenant support
}

// API Response for tips calculation
export type CalculateTipsResponse =
Record<string, RestaurantTips
>
export type RestaurantTips = {
    restaurantName: string;
    salesSummary: {
        totalSales: number;        // in cents
        totalTips: number;         // in cents
        totalReceipts: number;
        individualItemBreakdown: Array<{
            itemName: string;
            category: string;
            quantity: number;
            revenue: number;           // in euros (NOT cents)
            salesSource?: 'speedy' | 'hannah';
            taxAmount?: number;        // VAT amount in euros
        }>;
        hourlyBreakdown: Array<{
            hour: string;
            sales: number;             // in cents
            tips: number;              // in cents
            receipts: number;
        }>;
        paymentMethodBreakdown: Array<{
            method: string;
            amount: number;            // in cents
            count: number;
        }>;
        hourlyCategoryBreakdown: HourlyCategoryBreakdown[];
        categoryRevenue?: CategoryRevenue[];
    };
    employeeDistribution: Array<{
        employeeId: string;
        employeeCode: string;
        name: string;
        hoursWorked: number;           // in hours (decimal)
        tipAmount: number;             // in cents
        group: string;
        excludedFromTips: boolean;
        shifts?: Shift[];
        hourlyRate?: number;           // in euros (NOT cents) - stored in DB as euros
        paymentType?: "flat" | "hourly" | "invoice";
        flatPaymentAmount?: number;    // in euros (NOT cents) - stored in DB as euros
        rateType?: "netto" | "brutto"; // Whether hourlyRate/flatPaymentAmount is netto or brutto
        nettoWage?: number;            // in cents - what employee receives in bank
        bruttoWage?: number;           // in cents - netto + taxes + employee social contributions
        bruttoWithEmployerShare?: number; // in cents - total labor cost (brutto + employer contributions)
    }>;
    warnings: string[];
    errors: string[];
}
