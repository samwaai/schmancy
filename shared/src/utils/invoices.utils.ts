// In packages/shared/src/utils/invoices.utils.ts

import { numberFormatter } from ".";
// Import OWL Invoice types (not PAM Invoice types)
import type { Invoice, InvoiceItem } from "../types/invoices.types";
import type { Item, Order, Supplier } from "../types";
import { ItemPriceUtility } from "./price-utility";

/**
 * Unified utilities for invoice calculations and formatting
 * Ensures consistent handling across invoice views and reconciliation
 */
export class InvoiceUtils {
  // Constants for comparison
  static readonly PRICE_TOLERANCE = 0.0;
  static readonly QUANTITY_EPSILON = 0.01;

  /**
   * Gets the net amount from invoice with consistent precision
   * Prioritizes stored net_amount when available to ensure consistency
   */
  static getInvoiceNetAmount(invoice: Invoice): number {
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
      // Calculate with proper precision
      const total = invoice.invoice_items.reduce((sum, item) => {
        // Prefer item.amount if available, otherwise calculate
        const itemAmount = this.getLineItemTotal(item);

        // Use precise addition
        const newSum = numberFormatter.roundNumber(sum + itemAmount, 5);
      
        return newSum;
      }, 0);

      return total;
    }

    return 0;
  }

  /**
   * Gets the total gross amount from invoice
   * Consistently sums net and VAT or uses total_amount property
   */
  static getInvoiceGrossTotal(invoice: Invoice): number {
    // Try to calculate from net + VAT
    const netAmount = this.getInvoiceNetAmount(invoice);
    const vatAmount = this.getInvoiceVatAmount(invoice);

    return netAmount + vatAmount;
  }

  /**
   * Gets the historical price for an item based on invoice date
   * @param item - The item to get price for
   * @param invoiceDate - The date to get price at
   * @param preferSourceId - Optional: prefer price from this sourceId if it exists at the date
   */
  static getHistoricalPrice(
    item: Item,
    invoiceDate: string | null,
    preferSourceId?: string,
  ): number {
    if (!item) return 0;

    let price = item.pricePerUnit || 0;

    if (invoiceDate) {
      const historicalPrice = ItemPriceUtility.getPriceAtDate(
        item,
        invoiceDate,
        preferSourceId,
      );
      if (historicalPrice !== null) {
        price = historicalPrice;
      }
    }

    return price;
  }

  /**
   * Gets the order total using historical prices with precise rounding
   * Ensures consistent calculation between invoice table and reconciliation
   * @param order - The order
   * @param invoiceDate - The date to get prices at
   * @param itemsMap - Map of item IDs to items
   * @param invoiceId - Optional: prefer prices from this invoice
   */
  static getOrderTotal(
    order: Order,
    invoiceDate: string | null,
    itemsMap: Map<string, Item>,
    invoiceId?: string,
  ): number {
    if (!order || !order.items || order.items.length === 0) {
      return 0;
    }

    return order.items.reduce((total, orderItem) => {
      const item = itemsMap.get(orderItem.id);
      if (!item) return total;

      const price = this.getHistoricalPrice(item, invoiceDate, invoiceId);
      const quantity =
        orderItem.delivered !== undefined ? orderItem.delivered : 0;

      // Calculate line total with precise rounding
      const lineTotal = numberFormatter.roundNumber(price * quantity, 5);

      // Add to running total with precise rounding
      return numberFormatter.roundNumber(total + lineTotal, 5);
    }, 0);
  }

  /**
   * Checks if two price totals match within an appropriate tolerance
   * Handles both percentage-based and absolute differences
   */
  static totalsMatch(total1: number, total2: number): boolean {
    // For very small amounts, use higher absolute tolerance
    if (total1 < 1 || total2 < 1) {
      return Math.abs(total1 - total2) <= 0.01; // 1 cent absolute tolerance for small amounts
    }

    // For normal amounts, allow both relative and absolute tolerance
    const absoluteDiff = Math.abs(total1 - total2);

    // Allow 1 cent absolute difference
    if (absoluteDiff <= 0.01) return true;

    // For larger amounts, check percentage difference
    // Allow up to 2.5% difference to account for discounts, rounding, and adjustments
    const maxAmount = Math.max(Math.abs(total1), Math.abs(total2), 0.01);
    const percentDiff = (absoluteDiff / maxAmount) * 100;

    return percentDiff <= 2.5; // 2.5% tolerance for discounts and adjustments
  }

  /**
   * Checks if a line item calculation matches within appropriate tolerance
   * Accounts for different rounding methods suppliers might use
   */
  static lineItemCalculationMatches(quantity: number, unitPrice: number, totalAmount: number): boolean {
    // Calculate what we expect
    const calculated = quantity * unitPrice;
    
    // Check various rounding methods that suppliers might use:
    // 1. No rounding (exact)
    // 2. Round to 2 decimals (most common for currency)
    // 3. Round each component first, then multiply
    // 4. Banker's rounding vs regular rounding
    
    const roundingVariations = [
      calculated, // Exact
      Math.round(calculated * 100) / 100, // Round to 2 decimals
      Math.floor(calculated * 100) / 100, // Floor to 2 decimals
      Math.ceil(calculated * 100) / 100, // Ceil to 2 decimals
      numberFormatter.roundNumber(calculated, 2), // Our rounding method
      Math.round(numberFormatter.roundNumber(quantity, 2) * numberFormatter.roundNumber(unitPrice, 2) * 100) / 100, // Round inputs first
    ];
    
    // Check if the total matches any reasonable rounding method
    for (const variation of roundingVariations) {
      if (Math.abs(variation - totalAmount) <= 0.01) {
        return true;
      }
    }
    
    // Also check if difference is within 1 cent per unit (for large quantities)
    const perUnitDifference = Math.abs(calculated - totalAmount) / Math.max(quantity, 1);
    if (perUnitDifference <= 0.01) {
      return true;
    }
    
    return false;
  }

  static getInvoiceOrderDelta(
    invoice: Invoice,
    order: Order,
    itemsMap: Map<string, Item>,
    invoiceId?: string,
  ): number {
    if (!invoice || !order) return 0;

    const invoiceNet = this.getInvoiceNetAmount(invoice);
    const deliveryDate = order.deliveryDate ?? invoice.invoice_date;
    const orderTotal = this.getOrderTotal(
      order,
      deliveryDate,
      itemsMap,
      invoiceId,
    );

    // Apply precise rounding to the difference
    const delta = numberFormatter.roundNumber(invoiceNet - orderTotal, 5);

    // If totals match within tolerance, return exactly zero
    if (this.totalsMatch(invoiceNet, orderTotal)) {
      return 0;
    }

    return delta;
  }

  /**
   * Calculates delta between invoice and order
   */
  static calculateDelta(
    invoice: Invoice,
    order: Order,
    itemsMap: Map<string, Item>,
  ): number {
    const invoiceTotal = this.getInvoiceNetAmount(invoice);
    const orderTotal = this.getOrderTotal(
      order,
      invoice.invoice_date,
      itemsMap,
    );
    return invoiceTotal - orderTotal;
  }

  /**
   * Formats a currency value consistently
   */
  static formatCurrency(amount: number, currency: string = "€"): string {
    return `${currency === "EUR" ? "€" : currency}${numberFormatter.doIt(amount)}`;
  }

  /**
   * Gets CSS class for delta values
   */
  static getDeltaClass(value: number): string {
    return value > 0
      ? "text-error-default"
      : value < 0
        ? "text-primary-default"
        : "text-neutral";
  }

  /**
   * Applies quantity factor to invoice quantity
   */
  static applyFactor(quantity: number, factor: number = 1): number {
    return numberFormatter.roundNumber(quantity * factor, 5);
  }

  /**
   * Checks if quantities match after applying factor
   */
  static quantitiesMatch(
    invoiceQty: number,
    orderQty: number,
    factor: number = 1,
  ): boolean {
    return Math.abs(invoiceQty * factor - orderQty) < this.QUANTITY_EPSILON;
  }

  /**
   * Checks if prices match within tolerance (5 decimal places)
   */
  static pricesMatch(invoicePrice: number, orderPrice: number): boolean {
    // Handle both zero
    if (invoicePrice === 0 && orderPrice === 0) return true;

    // Round both prices to 5 decimal places for comparison
    const roundedInvoicePrice = numberFormatter.roundNumber(invoicePrice, 5);
    const roundedOrderPrice = numberFormatter.roundNumber(orderPrice, 5);

    const priceDiff = Math.abs(roundedInvoicePrice - roundedOrderPrice);

    // Accept very small differences due to floating point
    return priceDiff <= 0.00001;
  }

  /**
   * Calculate VAT amount following the German "cent-genaue Berechnung" method
   * This ensures consistent VAT calculation across the application and
   * compliance with German tax regulations
   *
   * @param {number} amount - Net amount
   * @param {number} vatRate - VAT rate (as decimal or percentage)
   * @param {number} precision - Decimal precision for result (default: 2)
   * @returns {number} - Calculated VAT amount with correct rounding
   */
  static calculateVatAmount(amount, vatRate, precision = 2) {
    if (amount === null || vatRate === null) return 0;

    // Normalize VAT rate to decimal format (handle both 7% and 0.07 inputs)
    const normalizedVatRate = vatRate > 1 ? vatRate / 100 : vatRate;

    // 1. Round the amount to cents (2 decimal places) per German regulations
    const roundedAmount = Math.round(amount * 100) / 100;

    // 2. Calculate VAT
    const vat = roundedAmount * normalizedVatRate;

    // 3. Round to specified precision (usually 2 decimals for currency)
    return Math.round(vat * Math.pow(10, precision)) / Math.pow(10, precision);
  }

  /**
   * Calculate percentage change between two values
   */
  static calculatePercentChange(newValue: number, oldValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  }

  static isOkay(invoice: Invoice, order: Order, items: Map<string, Item>, invoiceId?: string) {
    const delta = InvoiceUtils.getInvoiceOrderDelta(invoice, order, items, invoiceId);
    const isBalanced = Math.abs(delta) === 0; // Allow tiny rounding differences
    return isBalanced;
  }
  // Add this helper function to InvoiceUtils

  /**
   * Checks if an item is deposit-related (Pfand) based on its description
   * @param item The invoice item to check
   * @returns True if it's a deposit item where negative prices are valid
   */
  static isDepositItem(item: InvoiceItem): boolean {
    if (!item?.description) return false;

    const description = item.description.toLowerCase();
    return (
      description.includes("pfand") ||
      description.includes("deposit") ||
      description.includes("leergut") ||
      description.includes("leergebinde") ||
      description.includes("container") ||
      description.includes("mehrweg")
    );
  }

  /**
   * Validates invoice data integrity and returns error messages
   * Designed for both frontend and backend use
   * @param invoice The invoice to validate
   * @return Array of error messages, empty array if no errors
   */
  static validateInvoice(invoice: Invoice): string[] {
    if (!invoice) return ["Invalid invoice data"];

    const errors: string[] = [];

    // 1. Required fields validation
    if (!invoice.invoice_number) {
      errors.push("Missing invoice number");
    }

    if (!invoice.invoice_date) {
      errors.push("Missing invoice date");
    }

    if (!invoice.sender_company_name && !invoice.sender_name) {
      errors.push("Missing sender information");
    }

    if (!invoice.recipient_company_name && !invoice.recipient_name) {
      errors.push("Missing recipient information");
    }

    // Check for invalid VAT rates in line items
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
      const invalidVatItems = this.getInvalidVatRateItems(invoice);
      if (invalidVatItems.length > 0) {
        invalidVatItems.forEach((item) => {
          errors.push(
            `Line item #${item.index + 1} has invalid VAT rate (${item.vatRate}%). Valid rates are 0%, 7%, or 19%.`,
          );
        });
      }
    }

    // 2. Date validation
    if (invoice.invoice_date) {
      try {
        const invoiceDate = new Date(invoice.invoice_date);
        const today = new Date();

        if (invoiceDate > today) {
          errors.push("Invoice date is in the future");
        }

        if (invoice.due_date) {
          const dueDate = new Date(invoice.due_date);
          if (dueDate < invoiceDate) {
            errors.push("Due date is before invoice date");
          }
        }
      } catch (e) {
        errors.push("Invalid date format");
      }
    }

    // 3. Amount calculations validation
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
      // Line items validation
      let hasLineItemErrors = false;

      invoice.invoice_items.forEach((item, index) => {
        // Skip validation for negative values - they're allowed for returns and adjustments
        // Both negative quantities and negative unit prices are valid for:
        // - Returns
        // - Credit notes
        // - Manual adjustments
        // - Deposit items (Pfand)

        // Check line item calculation with appropriate tolerance
        const quantity = item.quantity || 0;
        const unitPrice = item.unit_price || 0;
        const itemAmount = item.amount || 0;

        if (!InvoiceUtils.lineItemCalculationMatches(quantity, unitPrice, itemAmount)) {
          errors.push(
            `Line item #${index + 1} amount doesn't match quantity × price`,
          );
          hasLineItemErrors = true;
        }
      });

      if (!hasLineItemErrors) {
        // Only check totals if line items themselves are valid
        const calculatedNet = InvoiceUtils.getInvoiceNetAmount(invoice);
        const declaredNet = invoice.net_amount;


        // Only validate if net_amount is explicitly set
        if (declaredNet !== null && declaredNet !== undefined && !InvoiceUtils.totalsMatch(calculatedNet, declaredNet)) {
          errors.push("Net amount doesn't match sum of line items");
        }

        // Get declared values for VAT validation
        const declaredTotal = invoice.total_amount || 0;
        const declaredVat = invoice.vat || 0;

        // For VAT, validate that Total = Net + VAT (regardless of line item VAT calculations)
        // This handles mixed VAT rates correctly
        const calculatedVatFromTotals = numberFormatter.roundNumber(
          declaredTotal - declaredNet,
          5,
        );

        if (!InvoiceUtils.totalsMatch(calculatedVatFromTotals, declaredVat)) {
          errors.push("VAT amount should equal (Total Amount - Net Amount)");
        }

        // Also validate that declared total matches net + VAT
        const calculatedTotal = numberFormatter.roundNumber(
          declaredNet + declaredVat,
          5,
        );

        if (!InvoiceUtils.totalsMatch(calculatedTotal, declaredTotal)) {
          errors.push("Total amount should equal (Net Amount + VAT)");
        }
      }
    }

    // 4. IBAN validation (basic format check)
    if (invoice.sender_iban && invoice.sender_iban.length > 0) {
      invoice.sender_iban.forEach((bankInfo, index) => {
        if (bankInfo.iban) {
          // Simple IBAN format check - should be at least 15 chars
          const cleanIban = bankInfo.iban.replace(/\s/g, "");
          if (cleanIban.length < 15 || cleanIban.length > 34) {
            errors.push(`Invalid IBAN format for bank account #${index + 1}`);
          }
        }
      });
    }

    return errors;
  }

  // Add this to the InvoiceUtils class in packages/shared/src/utils/invoices.utils.ts

  /**
   * Calculates VAT based on total and net amounts
   * This is preferred for mixed VAT rates where itemized VAT calculation may not match
   */
  static calculateVatFromTotals(invoice: Invoice): number {
    if (
      invoice.total_amount !== null &&
      invoice.total_amount !== undefined &&
      invoice.net_amount !== null &&
      invoice.net_amount !== undefined
    ) {
      return numberFormatter.roundNumber(
        invoice.total_amount - invoice.net_amount,
        5,
      );
    }
    return 0;
  }

  // Add this to packages/shared/src/utils/invoices.utils.ts

  /**
   * Check if a VAT rate is valid (7% or 19%)
   * @param vatRate The VAT rate to check
   * @returns True if valid, false if invalid
   */
  static isValidVatRate(vatRate: number | null | undefined): boolean {
    if (vatRate === null || vatRate === undefined) return false;

    // Allow for small floating point precision issues
    const validRates = [0, 0.07, 0.19, 7, 19];
    const tolerance = 0.001;

    return validRates.some((rate) => Math.abs(vatRate - rate) <= tolerance);
  }

  /**
   * Gets all invoice items with invalid VAT rates
   * @param invoice The invoice to check
   * @returns Array of invalid items with their index and VAT rate
   */
  static getInvalidVatRateItems(
    invoice: Invoice,
  ): Array<{ index: number; description: string; vatRate: number }> {
    if (!invoice?.invoice_items || invoice.invoice_items.length === 0) {
      return [];
    }

    return invoice.invoice_items
      .map((item, index) => ({
        index,
        description: item.description || `Item #${index + 1}`,
        vatRate: item.vat_rate,
      }))
      .filter((item) => !this.isValidVatRate(item.vatRate));
  }

  /**
   * Checks if an invoice has any items with invalid VAT rates
   * @param invoice The invoice to check
   * @returns True if any items have invalid VAT rates
   */
  static hasInvalidVatRates(invoice: Invoice): boolean {
    return this.getInvalidVatRateItems(invoice).length > 0;
  }

  /**
   * Gets single invoice line item total with precise rounding
   * Pure function that doesn't modify the input
   */
  static getLineItemTotal(item: InvoiceItem): number {
    if (!item) return 0;

    // If amount is directly available, use it
    if (item.amount !== null && item.amount !== undefined) {
      return item.amount;
    }

    const unitPrice = item.unit_price || 0;
    const quantity = item.quantity || 0;

    // Apply precise rounding
    return numberFormatter.roundNumber(unitPrice * quantity, 2);
  }

  /**
   * Gets the correct VAT amount for a line item, regardless of stored value
   */
  static getCorrectItemVatAmount(item: InvoiceItem): number {
    if (!item) return 0;

    const amount = this.getLineItemTotal(item);
    return this.calculateVatAmount(amount, item.vat_rate);
  }

  /**
   * Gets the VAT amount from invoice - Updated to use correct calculation
   */
  static getInvoiceVatAmount(invoice: Invoice): number {
    // First prioritize calculating from line items
    if (invoice.invoice_items && invoice.invoice_items.length > 0) {
      let totalVat = 0;

      // Calculate correct VAT for each line item
      invoice.invoice_items.forEach((item) => {
        totalVat += this.getCorrectItemVatAmount(item);
      });

      return totalVat;
    }

    // Fallback to invoice.vat if no line items
    return invoice.vat || 0;
  }

  /**
   * Enhanced validation that checks if the invoice IBAN matches any supplier IBAN
   * @param invoice The invoice to validate
   * @param supplier The supplier to check against
   * @returns Detailed validation result object
   */
  static validateSupplierIBAN(
    invoice: Invoice,
    supplier: Supplier | null,
  ): {
    isValid: boolean;
    status:
      | "supplier_missing"
      | "iban_missing_invoice"
      | "iban_missing_supplier"
      | "iban_match"
      | "iban_mismatch";
    invoiceIban: string;
    supplierIbans: string[];
  } {
    // Extract first invoice IBAN, if any
    const invoiceIban =
      invoice.sender_iban?.[0]?.iban?.replace(/\s+/g, "") || "";

    // Handle missing supplier case
    if (!supplier) {
      return {
        isValid: false,
        status: "supplier_missing",
        invoiceIban,
        supplierIbans: [],
      };
    }

    // Clean supplier IBANs
    const supplierIbans = [
      supplier.bankIBAN ? supplier.bankIBAN.replace(/\s+/g, "") : null,
      supplier.bankIBAN2 ? supplier.bankIBAN2.replace(/\s+/g, "") : null,
    ].filter(Boolean) as string[];

    // Check missing invoice IBAN
    if (
      !invoice.sender_iban ||
      invoice.sender_iban.length === 0 ||
      !invoiceIban
    ) {
      return {
        isValid: false,
        status: "iban_missing_invoice",
        invoiceIban,
        supplierIbans,
      };
    }

    // Check missing supplier IBANs
    if (supplierIbans.length === 0) {
      return {
        isValid: false,
        status: "iban_missing_supplier",
        invoiceIban,
        supplierIbans,
      };
    }

    // Check for any match between invoice and supplier IBANs
    for (const bankInfo of invoice.sender_iban) {
      if (!bankInfo.iban) continue;

      const cleanInvoiceIban = bankInfo.iban.replace(/\s+/g, "");
      if (supplierIbans.some((iban) => iban === cleanInvoiceIban)) {
        return {
          isValid: true,
          status: "iban_match",
          invoiceIban: cleanInvoiceIban,
          supplierIbans,
        };
      }
    }

    // No match found
    return {
      isValid: false,
      status: "iban_mismatch",
      invoiceIban,
      supplierIbans,
    };
  }
}
