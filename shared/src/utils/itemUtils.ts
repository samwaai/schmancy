import { Item } from "../types";
import { numberFormatter } from "./number";

/**
 * Measurement unit information
 */
export interface MeasurementUnit {
  value: string;
  label: string;
  type?: 'weight' | 'volume' | 'count';
}

export class ItemUtils {
  /**
   * Unit type categorization
   */
  static readonly unitTypes = {
    weight: ['g', 'kg', 'lb', 'oz'],
    volume: ['ml', 'liter', 'fl_oz', 'cup', 'tbsp', 'tsp', 'm³'],
    count: ['pc', 'unit', 'piece', 'stk']
  };

  /**
   * Get the formatted price per unit label
   * @param item The inventory item
   * @returns Formatted price per unit string (e.g. "5.00€/kg")
   */
  static getPricePerUnitLabel(item: Item): string {
    return `${numberFormatter.doIt(
      item.pricePerUnit! / item.unit.measurement?.value,
    )}€/${item.unit.measurement?.label}`;
  }

  /**
   * Get the full item name including brand if available
   * @param item The inventory item
   * @returns Full item name with brand
   */
  static getItemName(item: Item): string {
    return `${item.name} ${item.brand?.name ? `- ${item.brand?.name}` : ""}`;
  }

  /**
   * Calculate the price per package (including set quantity)
   * @param item The inventory item
   * @returns Price per package
   */
  static getPricePerPackage(item: Item): number {
    return item.pricePerUnit! * (item.set?.quantity || 1);
  }

  /**
   * Get a formatted label for the item's unit
   * @param item The inventory item
   * @returns Formatted unit label (e.g. "1 kg") or empty string if item/unit is missing
   */
  static labelForUnit(item: Item | null | undefined): string {
    if (!item?.unit?.measurement) {
      return '';
    }
    return `${item.unit.measurement.value} ${item.unit.measurement.label}`;
  }

  /**
   * Get the unit measurement information from an item
   * @param item The inventory item
   * @returns Measurement unit information or null if not available
   */
  static getMeasurementUnit(item: Item | null | undefined): MeasurementUnit | null {
    if (!item?.unit?.measurement) {
      return null;
    }
    
    const label = item.unit.measurement.label;
    const unitType = this.getUnitType(label);
    
    return {
      value: label,
      label,
      type: unitType
    };
  }

  /**
   * Get the type of unit (weight, volume, count)
   * @param unit Unit label to check
   * @returns Unit type or null if unknown
   */
  static getUnitType(unit: string): 'weight' | 'volume' | 'count' | undefined {
    for (const [type, units] of Object.entries(this.unitTypes)) {
      if (units.includes(unit)) {
        return type as 'weight' | 'volume' | 'count';
      }
    }
    return undefined;
  }

  /**
   * Get a formatted label for the item's package
   * @param item The inventory item
   * @returns Formatted package label (e.g. "1 kg x 10")
   */
  static LabelForPackage(item: Item): string {
    if (!!item.set) {
      return `${item.unit.measurement?.value}${item.unit.measurement?.label}${
        item.unit.type !== item.unit.measurement?.label
          ? " ".concat(item.unit.type)
          : ""
      }${
        item.set?.quantity === 1
          ? ""
          : " x ".concat(item.set!.quantity.toString())
      }`;
    } else {
      return `${item.unit.measurement?.value} ${item.unit.measurement?.label}${
        item.unit.type !== item.unit.measurement?.label
          ? " ".concat(item.unit.type)
          : ""
      }`;
    }
  }

  /**
   * Get a formatted label for the item's package with price
   * @param item The inventory item
   * @returns Formatted package label with price
   */
  static LabelForPackageWithPrice(item: Item): string {
    return `${numberFormatter.doIt(this.getPricePerPackage(item))} €/${
      item.set?.label
        ? item.set?.label.concat(" (", this.LabelForPackage(item), ")")
        : this.LabelForPackage(item)
    }`;
  }

  /**
   * Calculate the total units quantity based on set quantity
   * @param item The inventory item
   * @param quantity The number of packages/sets
   * @returns Total units quantity
   */
  static totalUnitsQuantity(item: Item, quantity: number): number {
    return (item.set?.quantity ?? 1) * quantity;
  }

  /**
   * Get just the unit label without the value
   * @param item The inventory item
   * @returns Unit label only (e.g. "kg", "ml", "pc")
   */
  static getUnitLabel(item: Item | null | undefined): string {
    return item?.unit?.type || '';
  }

  /**
   * Get just the set/package label
   * @param item The inventory item
   * @returns Set label (e.g. "box", "case", "pack") or empty string
   */
  static getSetLabel(item: Item | null | undefined): string {
    return item?.set?.label || '';
  }

  /**
   * Format inventory quantity based on item configuration
   * Shows quantity in sets/packages if the item is tracked by sets, otherwise shows units
   * @param item The inventory item
   * @param quantity The inventory quantity in base units
   * @returns Formatted inventory quantity string (e.g. "64 box" or "192 kg")
   */
  static formatInventoryQuantity(item: Item | null | undefined, quantity: number): string {
    if (!item) return numberFormatter.formatNumber(quantity);

    // Determine tracking method - same logic as item form
    // @ts-ignore - inventoryUpdateBy might not exist on older items
    const trackingMethod = item.inventoryUpdateBy ?? item.minimumOrder?.type ?? 'unit';

    // Check if item is tracked by sets
    if (trackingMethod === 'set' && item.set) {
      const sets = quantity / item.set.quantity;
      return `${numberFormatter.formatNumber(sets)} ${this.getSetLabel(item)}`;
    }

    // Default to units
    return `${numberFormatter.formatNumber(quantity)} ${this.getUnitLabel(item)}`;
  }
}
