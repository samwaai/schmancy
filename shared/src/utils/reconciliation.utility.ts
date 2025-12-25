// packages/shared/src/utils/reconciliation.utility.ts

import { InvoiceItem, Item } from "../types";

/**
 * Shared utility class for invoice reconciliation logic
 * Centralizes reconciliation functions that can be used by both frontend and backend
 */
export class ReconciliationUtility {
  // Price comparison tolerance (0.1% - much stricter)
  static PRICE_EPSILON = 0.001;

  /**
   * Normalize a quantity based on item configuration (units/sets)
   */
  static normalizeQuantity(
    quantity: number,
    item: Item | null,
    unitType: "unit" | "set" = "unit",
  ): number {
    if (!item) return quantity;

    const hasSetConfig = !!item.set;
    const setQuantity = item.set ? item.set.quantity : 1;

    // If unitType is 'set' and we have set configuration, convert to units
    if (unitType === "set" && hasSetConfig) {
      return quantity * setQuantity;
    }

    return quantity;
  }

  /**
   * Compare two normalized quantities and determine if they match
   */
  static compareQuantities(quantity1: number, quantity2: number): boolean {
    // Use a small epsilon for floating point comparison
    return Math.abs(quantity1 - quantity2) < 0.01;
  }

  /**
   * Compare two normalized prices and determine if they match within tolerance
   * Uses a relative error threshold of 0.1% (0.001) for strict price matching
   */
  static comparePrices(price1: number, price2: number): boolean {
    if (price1 === 0 && price2 === 0) return true;

    const priceDifference = Math.abs(price1 - price2);

    // Calculate relative error using the max of both prices
    const relativeError =
      priceDifference /
      Math.max(
        price1,
        price2,
        0.01, // Minimum divisor to avoid divide-by-zero
      );

    return relativeError <= this.PRICE_EPSILON;
  }

  /**
   * Calculate percentage change between two values
   */
  static calculatePercentChange(newValue: number, oldValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  }

  /**
   * Generate a consistent ID for reconciliation decisions
   * Used by both frontend and backend for stable references
   */
  static generateDecisionId(
    invoiceId: string,
    itemId: string | null,
    description: string,
  ): string {
    const safeInvoiceId = invoiceId || "unknown";
    const safeItemId = itemId || "unknown";
    const safeDesc = description || "";

    // Create a Base64 encoded suffix from the description
    let encodedDesc = "";
    try {
      encodedDesc = btoa(
        encodeURIComponent(safeDesc).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16)),
        ),
      ).substring(0, 20);
    } catch (e) {
      // Fallback for environments where btoa might not be available
      encodedDesc = safeDesc
        .substring(0, 20)
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
    }

    return `recon_${safeInvoiceId}_${safeItemId}_${encodedDesc}`;
  }

  /**
   * Apply post-processing rules to reconciliation results
   * This standardizes processing previously done only on backend
   */
  static applyPostProcessingRules(
    result: any,
    item: Item | null,
    invoiceItem: any,
    orderItem: any,
  ): void {
    // 1. Enforce zero quantity rule
    if (
      (invoiceItem?.quantity === 0 && orderItem?.delivered !== 0) ||
      (invoiceItem?.quantity !== 0 && orderItem?.delivered === 0)
    ) {
      result.quantityMatch = false;
    }

    // 2. Apply set conversion rules
    if (item?.set?.quantity) {
      const setQuantity = item.set.quantity;

      // Check for potential issues with price normalization
      const suspiciouslyCloseToOriginal =
        Math.abs(result.normalizedInvoicePrice - invoiceItem.unit_price) < 0.01;

      // Look for clues that price is per set/carton
      const isLikelySetPricing =
        orderItem?.unitType === "set" ||
        (item.set.quantity > 1 &&
          (item.set.label || "").toLowerCase().includes("set"));

      if (suspiciouslyCloseToOriginal && isLikelySetPricing) {
        // Correct the price to per-unit basis
        result.normalizedInvoicePrice =
          result.normalizedInvoicePrice / setQuantity;

        // Recalculate price match
        result.priceMatch = this.comparePrices(
          result.normalizedInvoicePrice,
          result.normalizedOrderPrice,
        );
      }
    }

    // 3. Re-check price match with correct tolerance
    if (result.normalizedInvoicePrice > 0 && result.normalizedOrderPrice > 0) {
      result.priceMatch = this.comparePrices(
        result.normalizedInvoicePrice,
        result.normalizedOrderPrice,
      );
    }
  }

  /**
   * Process an invoice item with a known quantity factor
   * Used for fast-path reconciliation without needing AI
   */
  static processWithQuantityFactor(
    invoiceItem: InvoiceItem,
    invoiceId: string,
    item: Item,
    orderItem: any,
    quantityFactor: number,
  ): any {
    if (!invoiceItem || !orderItem || !item) return null;

    try {
      // Calculate normalized quantities
      const normalizedInvoiceQuantity =
        (invoiceItem.quantity || 1) * quantityFactor;

      // Convert order quantity based on unit type
      const unitType = orderItem.unitType || "unit";
      let normalizedOrderQuantity = orderItem.delivered ?? orderItem.quantity;

      if (unitType === "set" && item.set) {
        normalizedOrderQuantity = normalizedOrderQuantity * item.set.quantity;
      }

      // Normalize invoice price
      let normalizedInvoicePrice = invoiceItem.unit_price || 0;
      if (quantityFactor !== 1) {
        normalizedInvoicePrice = normalizedInvoicePrice / quantityFactor;
      }

      // Get historical price if available
      let normalizedOrderPrice = orderItem.price || 0;

      // Compare values
      const quantityMatch = this.compareQuantities(
        normalizedInvoiceQuantity,
        normalizedOrderQuantity,
      );

      const priceMatch = this.comparePrices(
        normalizedInvoicePrice,
        normalizedOrderPrice,
      );

      // Generate decision ID
      const decisionId = this.generateDecisionId(
        invoiceId,
        item.id,
        invoiceItem.description || "",
      );

      return {
        quantityMatch,
        priceMatch,
        normalizedInvoiceQuantity,
        normalizedOrderQuantity,
        normalizedInvoicePrice,
        normalizedOrderPrice,
        explanation: `Fast-path reconciliation using quantity factor ${quantityFactor}`,
        confidence: 0.95,
        decisionId,
        alreadyExists: false,
      };
    } catch (error) {
      console.error("Error in fast path reconciliation:", error);
      return null;
    }
  }

  /**
   * Determines if an invoice item can be reconciled locally without needing AI.
   * Simplified to check only quantity factor and exact matches.
   */
  static canReconcileLocally(
    invoiceItem: any,
    orderItem: any,
    item: Item | null,
    quantityFactor?: number,
  ): boolean {
    // Skip if essential data is missing
    if (!invoiceItem || !orderItem || !item) return false;

    // 1. Quantity factor takes absolute priority if available
    if (quantityFactor !== undefined && quantityFactor > 0) {
      return true;
    }

    // 2. Direct exact match at the unit level (both quantity and price)
    const invoiceQuantity = invoiceItem.quantity || 0;
    const invoicePrice = invoiceItem.unit_price || 0;
    const orderQuantity = orderItem.delivered || orderItem.quantity || 0;
    const orderPrice = orderItem.price || 0;

    // Only consider exact matches for local reconciliation
    const quantityMatches = this.compareQuantities(
      invoiceQuantity,
      orderQuantity,
    );
    const priceMatches = this.comparePrices(invoicePrice, orderPrice);

    if (quantityMatches && priceMatches) {
      return true;
    }

    // 3. If sets are involved, defer to AI for safety
    // Let AI handle all set conversions for accuracy

    // Not safe to reconcile locally, use AI
    return false;
  }

  /**
   * Handle simple reconciliation cases locally.
   * Simplified to focus on quantity factor and exact matches.
   */
  static reconcileLocally(
    invoiceItem: any,
    orderItem: any,
    item: Item | null,
    invoiceId: string,
    quantityFactor?: number,
  ): any {
    if (!invoiceItem || !orderItem || !item) return null;

    const invoiceQuantity = invoiceItem.quantity || 0;
    const invoicePrice = invoiceItem.unit_price || 0;
    const orderQuantity = orderItem.delivered || orderItem.quantity || 0;
    const orderPrice = orderItem.price || 0;

    // 1. If quantity factor exists, use it as the primary reconciliation method
    if (quantityFactor !== undefined && quantityFactor > 0) {
      return this.processWithQuantityFactor(
        invoiceItem,
        invoiceId,
        item,
        orderItem,
        quantityFactor,
      );
    }

    // 2. Handle direct exact matches at unit level
    const quantityMatches = this.compareQuantities(
      invoiceQuantity,
      orderQuantity,
    );
    const priceMatches = this.comparePrices(invoicePrice, orderPrice);

    if (quantityMatches) {
      // Create a standardized result object
      const result = {
        quantityMatch: true,
        priceMatch: priceMatches,
        normalizedInvoiceQuantity: invoiceQuantity,
        normalizedOrderQuantity: orderQuantity,
        normalizedInvoicePrice: invoicePrice,
        normalizedOrderPrice: orderPrice,
        explanation: "Direct comparison",
        confidence: 0.95,
        decisionId: this.generateDecisionId(
          invoiceId,
          item.id,
          invoiceItem.description || "",
        ),
        alreadyExists: false,
      };

      // Apply any post-processing rules
      this.applyPostProcessingRules(result, item, invoiceItem, orderItem);

      return result;
    }

    // 3. Cannot reconcile with a simple approach, defer to AI
    return null;
  }
}
