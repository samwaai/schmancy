import { OperatorFunction, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import type { SalesSource } from '../../organization/pos/types.js';
import type { CategoryRevenue } from '../../organization/pos/speedy/types.js';
import type { HourlyCategoryBreakdown } from '../types/tips.types.js';

/**
 * Individual item breakdown with sales details
 */
export interface IndividualItemBreakdown {
  itemName: string;
  category: string;
  quantity: number;
  revenue: number;
  avgPrice: number;
  salesSource?: SalesSource;
  taxAmount?: number;
}

/**
 * Category breakdown with revenue and percentage
 */
export interface CategoryBreakdown {
  category: string;
  revenue: number;
  quantity: number;
  percentage: number;
}

/**
 * Hourly breakdown of sales, tips, and receipts
 */
export interface HourlyBreakdown {
  hour: string;
  sales: number;
  tips: number;
  receipts: number;
}

// HourlyCategoryBreakdown is imported from '../types/tips.types.js'
// Re-export for convenience
export type { HourlyCategoryBreakdown };

/**
 * Payment method breakdown
 */
export interface PaymentMethodBreakdown {
  method: string;
  amount: number;
  count: number;
}

/**
 * Raw Kassenspeicher API data structure for processing
 */
export interface RawKassenspeicherData {
  sales: Array<{
    itemName: string;
    category: string;
    quantity: number;
    revenue: number;
    timestamp: string;
    hour: string;
    paymentMethod: string;
    salesSource?: SalesSource;
    taxAmount?: number;
  }>;
  totalSales: number;
  totalTips: number;
  totalReceipts: number;
}

/**
 * Processes individual item breakdown from raw sales data
 * Aggregates items by name and category, calculating average prices
 */
export function processIndividualItems(): OperatorFunction<RawKassenspeicherData, IndividualItemBreakdown[]> {
  return pipe(
    map((data: RawKassenspeicherData): IndividualItemBreakdown[] => {
      if (!data.sales || data.sales.length === 0) {
        return [];
      }

      // Group by item name and category combination
      const itemMap = new Map<string, {
        itemName: string;
        category: string;
        quantity: number;
        revenue: number;
        salesSource?: SalesSource;
        taxAmount: number;
      }>();

      data.sales.forEach(sale => {
        const key = `${sale.itemName}|${sale.category}`;
        const existing = itemMap.get(key);

        if (existing) {
          existing.quantity += sale.quantity;
          existing.revenue += sale.revenue;
          existing.taxAmount += sale.taxAmount || 0;
        } else {
          itemMap.set(key, {
            itemName: sale.itemName,
            category: sale.category,
            quantity: sale.quantity,
            revenue: sale.revenue,
            salesSource: sale.salesSource,
            taxAmount: sale.taxAmount || 0
          });
        }
      });

      // Convert to IndividualItemBreakdown with average price calculation
      return Array.from(itemMap.values()).map(item => ({
        itemName: item.itemName,
        category: item.category,
        quantity: item.quantity,
        revenue: item.revenue,
        avgPrice: item.quantity > 0 ? item.revenue / item.quantity : 0,
        salesSource: item.salesSource,
        taxAmount: item.taxAmount
      })).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending
    })
  );
}

/**
 * Processes category breakdown with aggregation and percentage calculation
 * Groups items by category and calculates total revenue and percentage of total sales
 */
export function processCategoryBreakdown(): OperatorFunction<RawKassenspeicherData, CategoryBreakdown[]> {
  return pipe(
    map((data: RawKassenspeicherData): CategoryBreakdown[] => {
      if (!data.sales || data.sales.length === 0) {
        return [];
      }

      // Group by category
      const categoryMap = new Map<string, {
        revenue: number;
        quantity: number;
      }>();

      data.sales.forEach(sale => {
        const existing = categoryMap.get(sale.category);

        if (existing) {
          existing.revenue += sale.revenue;
          existing.quantity += sale.quantity;
        } else {
          categoryMap.set(sale.category, {
            revenue: sale.revenue,
            quantity: sale.quantity
          });
        }
      });

      // Calculate total revenue for percentage calculation
      const totalRevenue = data.totalSales || Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.revenue, 0);

      // Convert to CategoryBreakdown with percentage calculation
      return Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        revenue: data.revenue,
        quantity: data.quantity,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
      })).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending
    })
  );
}

/**
 * Processes hourly breakdown of sales data
 * Aggregates sales, tips, and receipts by hour
 */
export function processHourlyBreakdown(): OperatorFunction<RawKassenspeicherData, HourlyBreakdown[]> {
  return pipe(
    map((data: RawKassenspeicherData): HourlyBreakdown[] => {
      if (!data.sales || data.sales.length === 0) {
        return [];
      }

      // Group by hour
      const hourlyMap = new Map<string, {
        sales: number;
        tips: number;
        receipts: number;
      }>();

      data.sales.forEach(sale => {
        // Extract hour from timestamp or use provided hour field
        const hour = sale.hour || sale.timestamp?.substring(11, 13) || '00';
        const hourKey = `${hour}:00`;

        const existing = hourlyMap.get(hourKey);

        if (existing) {
          existing.sales += sale.revenue;
          existing.receipts += 1; // Count each sale as a receipt item
        } else {
          hourlyMap.set(hourKey, {
            sales: sale.revenue,
            tips: 0, // Tips will be distributed proportionally
            receipts: 1
          });
        }
      });

      // Distribute tips proportionally based on sales
      const totalSales = Array.from(hourlyMap.values()).reduce((sum, hour) => sum + hour.sales, 0);
      const totalTips = data.totalTips || 0;

      // Convert to HourlyBreakdown with proportional tip distribution
      return Array.from(hourlyMap.entries()).map(([hour, hourData]) => ({
        hour,
        sales: hourData.sales,
        tips: totalSales > 0 ? (hourData.sales / totalSales) * totalTips : 0,
        receipts: hourData.receipts
      })).sort((a, b) => a.hour.localeCompare(b.hour)); // Sort by hour ascending
    })
  );
}

/**
 * Processes payment method breakdown
 * Aggregates payment amounts and counts by payment method
 */
export function processPaymentMethods(): OperatorFunction<RawKassenspeicherData, PaymentMethodBreakdown[]> {
  return pipe(
    map((data: RawKassenspeicherData): PaymentMethodBreakdown[] => {
      if (!data.sales || data.sales.length === 0) {
        return [];
      }

      // Group by payment method
      const paymentMap = new Map<string, {
        amount: number;
        count: number;
      }>();

      data.sales.forEach(sale => {
        const method = sale.paymentMethod || 'Unknown';
        const existing = paymentMap.get(method);

        if (existing) {
          existing.amount += sale.revenue;
          existing.count += 1;
        } else {
          paymentMap.set(method, {
            amount: sale.revenue,
            count: 1
          });
        }
      });

      // Convert to PaymentMethodBreakdown
      return Array.from(paymentMap.entries()).map(([method, methodData]) => ({
        method,
        amount: methodData.amount,
        count: methodData.count
      })).sort((a, b) => b.amount - a.amount); // Sort by amount descending
    })
  );
}

/**
 * Complete sales processing pipeline that combines all breakdown operators
 * Processes raw Kassenspeicher data into all breakdown formats
 */
export function completeSalesProcessingPipeline(): OperatorFunction<RawKassenspeicherData, {
  individualItems: IndividualItemBreakdown[];
  categories: CategoryBreakdown[];
  hourly: HourlyBreakdown[];
  hourlyCategoryBreakdown: HourlyCategoryBreakdown[];
  paymentMethods: PaymentMethodBreakdown[];
}> {
  return pipe(
    map((data: RawKassenspeicherData) => {
      // Process all breakdowns using synchronous helper functions
      return {
        individualItems: processIndividualItemsSync(data),
        categories: processCategoryBreakdownSync(data),
        hourly: processHourlyBreakdownSync(data),
        hourlyCategoryBreakdown: processHourlyCategoryBreakdownSync(data),
        paymentMethods: processPaymentMethodsSync(data)
      };
    })
  );
}

/**
 * Synchronous version of processIndividualItems for use in completeSalesProcessingPipeline
 */
function processIndividualItemsSync(data: RawKassenspeicherData): IndividualItemBreakdown[] {
  if (!data.sales || data.sales.length === 0) {
    return [];
  }

  const itemMap = new Map<string, {
    itemName: string;
    category: string;
    quantity: number;
    revenue: number;
    salesSource?: SalesSource;
    taxAmount: number;
  }>();

  data.sales.forEach(sale => {
    const key = `${sale.itemName}|${sale.category}`;
    const existing = itemMap.get(key);

    if (existing) {
      existing.quantity += sale.quantity;
      existing.revenue += sale.revenue;
      existing.taxAmount += sale.taxAmount || 0;
    } else {
      itemMap.set(key, {
        itemName: sale.itemName,
        category: sale.category,
        quantity: sale.quantity,
        revenue: sale.revenue,
        salesSource: sale.salesSource,
        taxAmount: sale.taxAmount || 0
      });
    }
  });

  return Array.from(itemMap.values()).map(item => ({
    itemName: item.itemName,
    category: item.category,
    quantity: item.quantity,
    revenue: item.revenue,
    avgPrice: item.quantity > 0 ? item.revenue / item.quantity : 0,
    salesSource: item.salesSource,
    taxAmount: item.taxAmount
  })).sort((a, b) => b.revenue - a.revenue);
}

/**
 * Synchronous version of processCategoryBreakdown for use in completeSalesProcessingPipeline
 */
function processCategoryBreakdownSync(data: RawKassenspeicherData): CategoryBreakdown[] {
  if (!data.sales || data.sales.length === 0) {
    return [];
  }

  const categoryMap = new Map<string, {
    revenue: number;
    quantity: number;
  }>();

  data.sales.forEach(sale => {
    const existing = categoryMap.get(sale.category);

    if (existing) {
      existing.revenue += sale.revenue;
      existing.quantity += sale.quantity;
    } else {
      categoryMap.set(sale.category, {
        revenue: sale.revenue,
        quantity: sale.quantity
      });
    }
  });

  const totalRevenue = data.totalSales || Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.revenue, 0);

  return Array.from(categoryMap.entries()).map(([category, categoryData]) => ({
    category,
    revenue: categoryData.revenue,
    quantity: categoryData.quantity,
    percentage: totalRevenue > 0 ? (categoryData.revenue / totalRevenue) * 100 : 0
  })).sort((a, b) => b.revenue - a.revenue);
}

/**
 * Synchronous version of processHourlyBreakdown for use in completeSalesProcessingPipeline
 */
function processHourlyBreakdownSync(data: RawKassenspeicherData): HourlyBreakdown[] {
  if (!data.sales || data.sales.length === 0) {
    return [];
  }

  const hourlyMap = new Map<string, {
    sales: number;
    tips: number;
    receipts: number;
  }>();

  data.sales.forEach(sale => {
    const hour = sale.hour || sale.timestamp?.substring(11, 13) || '00';
    const hourKey = `${hour}:00`;

    const existing = hourlyMap.get(hourKey);

    if (existing) {
      existing.sales += sale.revenue;
      existing.receipts += 1;
    } else {
      hourlyMap.set(hourKey, {
        sales: sale.revenue,
        tips: 0,
        receipts: 1
      });
    }
  });

  const totalSales = Array.from(hourlyMap.values()).reduce((sum, hour) => sum + hour.sales, 0);
  const totalTips = data.totalTips || 0;

  return Array.from(hourlyMap.entries()).map(([hour, hourData]) => ({
    hour,
    sales: hourData.sales,
    tips: totalSales > 0 ? (hourData.sales / totalSales) * totalTips : 0,
    receipts: hourData.receipts
  })).sort((a, b) => a.hour.localeCompare(b.hour));
}

/**
 * Synchronous version - processes hourly breakdown with category detail
 * Groups sales by hour and category, sorted by hour then by sales descending within each hour
 */
function processHourlyCategoryBreakdownSync(data: RawKassenspeicherData): HourlyCategoryBreakdown[] {
  if (!data.sales || data.sales.length === 0) {
    return [];
  }

  const hourlyCategoryMap = new Map<string, {
    hour: string;
    category: string;
    sales: number;
    quantity: number;
    receipts: number;
  }>();

  data.sales.forEach(sale => {
    const hour = sale.hour || sale.timestamp?.substring(11, 13) || '00';
    const hourKey = `${hour}:00`;
    const category = sale.category || 'Other';
    const compositeKey = `${hourKey}|${category}`;

    const existing = hourlyCategoryMap.get(compositeKey);

    if (existing) {
      existing.sales += sale.revenue;
      existing.quantity += sale.quantity;
      existing.receipts += 1;
    } else {
      hourlyCategoryMap.set(compositeKey, {
        hour: hourKey,
        category,
        sales: sale.revenue,
        quantity: sale.quantity,
        receipts: 1
      });
    }
  });

  // Sort by hour, then by sales descending within each hour
  return Array.from(hourlyCategoryMap.values())
    .sort((a, b) => {
      const hourCompare = a.hour.localeCompare(b.hour);
      if (hourCompare !== 0) return hourCompare;
      return b.sales - a.sales;  // Highest sales first within hour
    });
}

/**
 * Synchronous version of processPaymentMethods for use in completeSalesProcessingPipeline
 */
function processPaymentMethodsSync(data: RawKassenspeicherData): PaymentMethodBreakdown[] {
  if (!data.sales || data.sales.length === 0) {
    return [];
  }

  const paymentMap = new Map<string, {
    amount: number;
    count: number;
  }>();

  data.sales.forEach(sale => {
    const method = sale.paymentMethod || 'Unknown';
    const existing = paymentMap.get(method);

    if (existing) {
      existing.amount += sale.revenue;
      existing.count += 1;
    } else {
      paymentMap.set(method, {
        amount: sale.revenue,
        count: 1
      });
    }
  });

  return Array.from(paymentMap.entries()).map(([method, methodData]) => ({
    method,
    amount: methodData.amount,
    count: methodData.count
  })).sort((a, b) => b.amount - a.amount);
}

/**
 * Merge category revenue arrays from multiple sources
 * Combines revenues for matching categories
 */
export function mergeCategoryRevenue(
  source1: CategoryRevenue[] | undefined,
  source2: CategoryRevenue[] | undefined
): CategoryRevenue[] {
  const revenueMap = new Map<string, number>();
  (source1 || []).forEach((item) => {
    const existing = revenueMap.get(item.category) || 0;
    revenueMap.set(item.category, existing + item.revenue);
  });
  (source2 || []).forEach((item) => {
    const existing = revenueMap.get(item.category) || 0;
    revenueMap.set(item.category, existing + item.revenue);
  });
  return Array.from(revenueMap.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}
