import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { Item, PriceHistory, PriceSourceType } from "../types/owl/items.types";

/**
 * Utility class for managing item prices and price history
 * Ensures correct historical price tracking and lookup
 */
export class ItemPriceUtility {
  // Default starting date for price history if none is specified
  static DEFAULT_START_DATE = "2024-08-01T00:00:00.000Z";

  /**
   * Validates a price and date
   * @throws Error if the input is invalid
   */
  private static validatePriceInput(
    price: number,
    effectiveDate: string,
  ): void {
    // Validate price
    if (typeof price !== "number" || isNaN(price) || price < 0) {
      throw new Error("Price must be a valid non-negative number");
    }

    // Validate date
    try {
      new Date(effectiveDate).toISOString();
    } catch (error) {
      throw new Error(`Invalid effectiveDate: ${effectiveDate}`);
    }
  }

  /**
   * Updates an item's price, properly handling price history
   * FIXED: No longer deletes newer price entries when adding a historical price
   */
  static updateItemPrice(
    item: Item,
    newPrice: number,
    effectiveDate: string = this.DEFAULT_START_DATE,
    sourceId?: string,
    sourceType?: PriceSourceType,
    notes?: string,
  ): Item {
    // Validate input
    this.validatePriceInput(newPrice, effectiveDate);

    // Create a deep copy to avoid modifying the original
    const updatedItem = {
      ...item,
      priceHistory: item.priceHistory ? [...item.priceHistory] : [],
    };

    // Ensure price history array exists
    if (!updatedItem.priceHistory) {
      updatedItem.priceHistory = [];
    }

    // Normalize the effective date for consistent comparison
    const normalizedEffectiveDate = this.normalizeDate(effectiveDate);
    const effectiveDateKey = this.getDateKey(normalizedEffectiveDate);

    // Initialize with current price if empty
    if (
      updatedItem.priceHistory.length === 0 &&
      updatedItem.pricePerUnit !== null &&
      updatedItem.pricePerUnit !== undefined
    ) {
      updatedItem.priceHistory.push({
        id: uuidv4(),
        price: updatedItem.pricePerUnit,
        startDate: this.DEFAULT_START_DATE,
        type: "unit",
        notes: "Initial price captured from existing item price",
      });
    }

    // Check if we already have a date match (using date part only)
    const existingEntryIndex = updatedItem.priceHistory.findIndex(
      (entry) => this.getDateKey(entry.startDate) === effectiveDateKey,
    );

    if (existingEntryIndex >= 0) {
      // Update the existing entry
      updatedItem.priceHistory[existingEntryIndex].price = newPrice;
      updatedItem.priceHistory[existingEntryIndex].sourceId = sourceId;
      updatedItem.priceHistory[existingEntryIndex].sourceType = sourceType;
      updatedItem.priceHistory[existingEntryIndex].notes = notes;
      // Update the date to the specified effective date
      updatedItem.priceHistory[existingEntryIndex].startDate =
        normalizedEffectiveDate;
    } else {
      // Add a new entry
      updatedItem.priceHistory.push({
        id: uuidv4(),
        price: newPrice,
        startDate: normalizedEffectiveDate,
        type: "unit",
        sourceId,
        sourceType,
        notes,
      });
    }

    // Sort history by date (oldest first for price lookup consistency)
    updatedItem.priceHistory.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    // Check if this is the most recent price change
    const mostRecentEntry = [...updatedItem.priceHistory].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )[0];

    // Only update current price if this is the most recent change
    // This ensures historical prices don't overwrite current prices
    if (
      mostRecentEntry &&
      this.getDateKey(mostRecentEntry.startDate) === effectiveDateKey
    ) {
      updatedItem.pricePerUnit = newPrice;
      updatedItem.pricePerUnitStartDate = normalizedEffectiveDate;
    }

    // Final check to ensure no duplicates remain
    const finalDateMap = new Map();
    const deduplicatedHistory = [];

    // One more pass to ensure no duplicates
    for (const entry of updatedItem.priceHistory) {
      const dateKey = this.getDateKey(entry.startDate);
      if (!finalDateMap.has(dateKey)) {
        finalDateMap.set(dateKey, true);
        deduplicatedHistory.push(entry);
      }
    }

    updatedItem.priceHistory = deduplicatedHistory;

    // Fix pricePerSet if necessary
    if (!updatedItem.set) {
      updatedItem.pricePerSet = null;
    } else if (updatedItem.pricePerUnit !== null) {
      updatedItem.pricePerSet = this.calculatePricePerSet(updatedItem);
    }

    return updatedItem;
  }

  /**
   * Gets the price history for an item, sorted chronologically
   */
  static getPriceHistory(item: Item): PriceHistory[] {
    // Handle missing price history (backward compatibility)
    if (!item || !item.priceHistory) {
      return [];
    }

    // Return a sorted copy of the price history
    return [...item.priceHistory].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }

  /**
   * Creates a price history entry for items that don't have history yet
   * Used to initialize price history for legacy items
   */
  static initializePriceHistory(item: Item): Item {
    const updatedItem = { ...item };

    // Skip if price history already exists
    if (updatedItem.priceHistory && updatedItem.priceHistory.length > 0) {
      return updatedItem;
    }

    // Initialize price history array
    updatedItem.priceHistory = [];

    // Add unit price history if available
    if (
      updatedItem.pricePerUnit !== null &&
      updatedItem.pricePerUnit !== undefined
    ) {
      // Set a default start date if none exists
      if (!updatedItem.pricePerUnitStartDate) {
        updatedItem.pricePerUnitStartDate = this.DEFAULT_START_DATE;
      }

      try {
        // Normalize the date
        const normalizedDate = this.normalizeDate(
          updatedItem.pricePerUnitStartDate,
        );

        // Validate the initial price entry
        this.validatePriceInput(updatedItem.pricePerUnit, normalizedDate);

        // Add current price to history
        updatedItem.priceHistory.push({
          id: uuidv4(),
          price: updatedItem.pricePerUnit,
          startDate: normalizedDate,
          type: "unit",
          notes: "Automatically initialized price history",
        });

        // Update the start date to normalized version
        updatedItem.pricePerUnitStartDate = normalizedDate;
      } catch (error) {
        // Log the error but don't throw to avoid breaking the app
        console.error("Error initializing price history:", error);

        // Use the default start date instead
        updatedItem.pricePerUnitStartDate = this.DEFAULT_START_DATE;
        updatedItem.priceHistory.push({
          id: uuidv4(),
          price: updatedItem.pricePerUnit,
          startDate: this.DEFAULT_START_DATE,
          type: "unit",
          notes: "Automatically initialized price history with default date",
        });
      }
    }

    // Fix pricePerSet if necessary
    if (!updatedItem.set) {
      updatedItem.pricePerSet = null;
    } else if (updatedItem.pricePerUnit !== null) {
      updatedItem.pricePerSet = this.calculatePricePerSet(updatedItem);
    }

    return updatedItem;
  }

  /**
   * Calculates the price per set based on the item's unit price and set quantity
   */
  static calculatePricePerSet(item: Item): number | null {
    // Calculate price per set only if unit price and set quantity are available
    if (
      item.pricePerUnit !== null &&
      item.pricePerUnit !== undefined &&
      item.set?.quantity
    ) {
      return item.pricePerUnit * item.set.quantity;
    }

    // Return null if unable to calculate set price or if set is null
    return null;
  }

  /**
   * Fixes existing price history to ensure a clean, chronological timeline
   * without duplicate prices or invalid entries
   */
  static fixPriceHistory(item: Item): Item {
    if (!item || !item.priceHistory || item.priceHistory.length === 0) {
      return item;
    }

    const updatedItem = { ...item };
    let priceHistory = [...updatedItem.priceHistory];

    // Step 1: Remove any invalid entries
    priceHistory = priceHistory.filter((entry) => {
      try {
        this.validatePriceInput(entry.price, entry.startDate);
        return true;
      } catch (error) {
        console.warn("Removing invalid price history entry:", error);
        return false;
      }
    });

    // Step 2: Normalize all dates for consistent comparison
    priceHistory = priceHistory.map((entry) => ({
      ...entry,
      startDate: this.normalizeDate(entry.startDate),
    }));

    // Step 3: Sort by date (oldest first)
    priceHistory.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    // Step 4: Remove any entries with duplicate dates (keep the last one)
    const dateMap = new Map();
    priceHistory.forEach((entry) => {
      const dateKey = this.getDateKey(entry.startDate);
      dateMap.set(dateKey, entry);
    });
    priceHistory = Array.from(dateMap.values());

    // Step 5: Sort again by date
    priceHistory.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    // Step 6: Remove consecutive entries with the same price
    const cleanedHistory = [];
    for (let i = 0; i < priceHistory.length; i++) {
      const current = priceHistory[i];

      // Skip if this entry has the same price as the previous one
      if (i > 0 && current.price === priceHistory[i - 1].price) {
        continue;
      }

      // Otherwise, keep this entry
      cleanedHistory.push({
        ...current,
      });
    }

    // Update the item with the cleaned history
    updatedItem.priceHistory = cleanedHistory;

    // Update the current price to match the latest history entry
    const latestEntry = cleanedHistory[cleanedHistory.length - 1];
    if (latestEntry) {
      updatedItem.pricePerUnit = latestEntry.price;
      updatedItem.pricePerUnitStartDate = latestEntry.startDate;
    }

    // Fix pricePerSet if set is null
    if (!updatedItem.set) {
      updatedItem.pricePerSet = null;
    } else if (updatedItem.pricePerUnit !== null) {
      // Calculate correct pricePerSet if set exists
      updatedItem.pricePerSet = this.calculatePricePerSet(updatedItem);
    }

    return updatedItem;
  }

  /**
   * Normalizes a date to standard format, handling timezone issues
   * This ensures consistent date comparison regardless of timezone
   */
  static normalizeDate(
    dateInput: string | null | undefined,
    fallback?: string,
  ): string {
    if (!dateInput) {
      return fallback || dayjs().toISOString();
    }

    try {
      // Parse the input date
      const date = dayjs(dateInput);

      // Check if the date is valid
      if (!date.isValid()) {
        throw new Error(`Invalid date: ${dateInput}`);
      }

      // Format as YYYY-MM-DD, then create a new date at midnight UTC
      const dateOnlyStr = date.format("YYYY-MM-DD");
      return dayjs(`${dateOnlyStr}T00:00:00.000Z`).toISOString();
    } catch (error) {
      console.error(`Error normalizing date: "${dateInput}"`, error);
      return fallback || dayjs().toISOString();
    }
  }

  /**
   * Extracts just the date part from an ISO date string (YYYY-MM-DD)
   * For consistent date-only comparisons
   */
  static getDateKey(dateString: string): string {
    try {
      return dateString.split("T")[0];
    } catch (error) {
      console.error(`Error getting date key from: ${dateString}`, error);
      return dateString;
    }
  }

  /**
   * Gets the price at a specific date by finding which price period
   * contains the given date.
   *
   * Improved to handle finding historical prices correctly
   *
   * @param item - The item to get price for
   * @param date - The date to get price at
   * @param preferSourceId - Optional: prefer price from this sourceId if it exists at the target date
   */
  static getPriceAtDate(
    item: Item,
    date: string,
    preferSourceId?: string,
  ): number | null {
    // Add proper null/undefined check first
    if (!item) {
      return null;
    }

    if (!item || !item.priceHistory || item.priceHistory.length === 0) {
      return item.pricePerUnit || null;
    }

    try {
      // Normalize input date for consistent comparison
      const normalizedDate = this.normalizeDate(date);
      const targetDateKey = this.getDateKey(normalizedDate);

      // If preferSourceId provided, first look for a price from that source at this date
      if (preferSourceId) {
        const preferredEntry = item.priceHistory.find(
          (entry) =>
            entry.sourceId === preferSourceId &&
            this.getDateKey(entry.startDate) === targetDateKey,
        );
        if (preferredEntry) {
          return preferredEntry.price;
        }
      }

      // Get target timestamp for comparison
      const targetTimestamp = new Date(normalizedDate).getTime();

      // Get price history and ensure it's sorted chronologically (oldest to newest)
      const history = [...item.priceHistory].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

      // If we only have one price entry, it applies to all dates
      if (history.length === 1) {
        return history[0].price;
      }

      // Find the most recent price entry that is less than or equal to the target date
      let applicablePrice: number | null = null;

      for (let i = 0; i < history.length; i++) {
        const entry = history[i];
        const entryTimestamp = new Date(entry.startDate).getTime();

        // If this entry is after our target date, stop searching
        if (entryTimestamp > targetTimestamp) {
          break;
        }

        // This entry is valid for our date, update the applicable price
        applicablePrice = entry.price;
      }

      // If no applicable price found, fall back to current price
      return applicablePrice ?? item.pricePerUnit ?? null;
    } catch (error) {
      console.error(`Error in getPriceAtDate for date ${date}:`, error);
      return item.pricePerUnit || null;
    }
  }

  /**
   * Creates a timeline of price changes suitable for plotting
   * Returns an array of points with dates and prices
   */
  static getPriceTimeline(item: Item): Array<{ date: string; price: number }> {
    if (!item || !item.priceHistory || item.priceHistory.length === 0) {
      return [];
    }

    // Get sorted price history
    const history = this.getPriceHistory(item);

    // Create timeline points
    return history.map((entry) => ({
      date: entry.startDate,
      price: entry.price,
    }));
  }
}
