import { ItemUtils } from "./itemUtils";

/**
 * Utility class for unit conversions and unit-related operations
 */
export class UnitConversionUtils {
  /**
   * Conversion factors to base units
   * Each unit maps to a base unit and conversion factor
   */
  static readonly toBaseUnit: Record<string, { unit: string; factor: number }> = {
    // Weight conversions (base: grams)
    kg: { unit: 'g', factor: 1000 },
    lb: { unit: 'g', factor: 453.592 },
    oz: { unit: 'g', factor: 28.3495 },
    
    // Volume conversions (base: milliliters)
    liter: { unit: 'ml', factor: 1000 },
    fl_oz: { unit: 'ml', factor: 29.5735 },
    cup: { unit: 'ml', factor: 236.588 },
    tbsp: { unit: 'ml', factor: 14.7868 },
    tsp: { unit: 'ml', factor: 4.92892 },
    
    // Area conversions
    'm³': { unit: 'ml', factor: 1000000 }, // 1 cubic meter = 1,000,000 ml
  };
  
  /**
   * Reverse conversions for displaying quantities in appropriate units
   * Based on quantity thresholds
   */
  static readonly fromBaseUnit: Record<string, Array<{ unit: string; factor: number; threshold: number }>> = {
    // Weight conversions from grams
    g: [
      { unit: 'g', factor: 1, threshold: 1000 },
      { unit: 'kg', factor: 0.001, threshold: Infinity },
    ],
    
    // Volume conversions from milliliters
    ml: [
      { unit: 'ml', factor: 1, threshold: 1000 },
      { unit: 'liter', factor: 0.001, threshold: Infinity },
    ],
  };
  
  /**
   * Priority order for display units in recipes
   * For recipes, we prefer smaller, more precise units (g and ml)
   */
  static readonly DISPLAY_UNIT_PRIORITY = ['g', 'ml', 'pc', 'kg', 'liter', 'lb', 'oz', 'fl_oz', 'm³'];
  
  /**
   * Check if conversion between units is valid
   * @param fromUnit Source unit
   * @param toUnit Target unit
   * @returns Boolean indicating if conversion is valid
   */
  static isValidConversion(fromUnit: string, toUnit: string): boolean {
    const fromType = ItemUtils.getUnitType(fromUnit);
    const toType = ItemUtils.getUnitType(toUnit);
    
    // Can only convert between units of the same type
    return fromType !== undefined && fromType === toType;
  }
  
  /**
   * Convert quantity from one unit to another
   * @param quantity Quantity to convert
   * @param fromUnit Source unit
   * @param toUnit Target unit
   * @returns Converted quantity or null if conversion is invalid
   */
  static convert(quantity: number, fromUnit: string, toUnit: string): number | null {
    // Same unit - no conversion needed
    if (fromUnit === toUnit) return quantity;
    
    // Check if conversion is valid
    if (!this.isValidConversion(fromUnit, toUnit)) {
      console.warn(`Invalid unit conversion attempted: ${fromUnit} to ${toUnit}`);
      return null;
    }
    
    try {
      // Convert to base unit first
      let baseQuantity = quantity;
      const fromConversion = this.toBaseUnit[fromUnit];
      
      if (fromConversion) {
        baseQuantity = quantity * fromConversion.factor;
        
        // Then convert from base unit to target
        const toConversion = this.toBaseUnit[toUnit];
        if (toConversion && toConversion.unit === fromConversion.unit) {
          return parseFloat((baseQuantity / toConversion.factor).toFixed(3));
        }
      }
      
      // Direct conversion using fromBaseUnit if available
      const baseUnit = fromConversion?.unit;
      if (baseUnit && this.fromBaseUnit[baseUnit]) {
        const options = this.fromBaseUnit[baseUnit];
        const option = options.find(o => o.unit === toUnit);
        if (option) {
          return parseFloat((baseQuantity * option.factor).toFixed(3));
        }
      }
    } catch (error) {
      console.error(`Error converting ${quantity} ${fromUnit} to ${toUnit}:`, error);
    }
    
    return null;
  }
  
  /**
   * Determines the best unit to display a quantity in
   * @param quantity The quantity to display
   * @param unit The current unit of the quantity
   * @returns The best unit for display
   */
  static determineBestDisplayUnit(quantity: number, unit: string): string {
    const unitType = ItemUtils.getUnitType(unit);
    
    if (!unitType) return unit; // If unknown type, keep as is
    
    // For weight, switch between g and kg based on quantity
    if (unitType === 'weight') {
      if (unit === 'g' && quantity >= 1000) return 'kg';
      if (unit === 'kg' && quantity < 1) return 'g';
    }
    
    // For volume, switch between ml and liter based on quantity
    if (unitType === 'volume') {
      if (unit === 'ml' && quantity >= 1000) return 'liter';
      if (unit === 'liter' && quantity < 1) return 'ml';
    }
    
    return unit; // Default to keeping the same unit
  }
  
  /**
   * Format a unit quantity for display
   * @param quantity The quantity to format
   * @param unit The unit of measurement
   * @returns Formatted string
   */
  static formatQuantity(quantity: number, unit: string): string {
    if (quantity === undefined || quantity === null || isNaN(quantity)) {
      return '0';
    }
    
    // Determine if we need decimal places
    const needsDecimals = quantity % 1 !== 0;
    const decimalPlaces = needsDecimals ? 2 : 0;
    
    return `${quantity.toFixed(decimalPlaces)} ${unit}`;
  }
}