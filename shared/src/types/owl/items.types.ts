import { v4 as uuidv4 } from "uuid";

// Unit type - predefined values from unitsLabel.data.ts
export type UnitType = 
  | 'pack'
  | 'box'
  | 'case'
  | 'pallet'
  | 'bundle'
  | 'bottle'
  | 'can'
  | 'bag'
  | 'sack'
  | 'carton'
  | 'crt'
  | 'jar'
  | 'tin'
  | 'roll'
  | 'pc'
  | 'unit'
  | 'kg'
  | 'barrel';

// Measurement label - predefined values from measuringUnits.data.ts
export type MeasurementLabel = 
  | 'g'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'ml'
  | 'liter'
  | 'fl_oz'
  | 'm³'
  | 'pc';

// Wholesale unit type - predefined values from wholeSaleUnits.data.ts
export type WholesaleUnitType = 
  | 'pack'
  | 'box'
  | 'case'
  | 'pallet'
  | 'bundle'
  | 'bag'
  | 'sack'
  | 'carton'
  | 'crate'
  | 'tray'
  | 'roll'
  | 'drum'
  | 'pouch'
  | 'bundle_sticks'
  | 'wrap';

// Price type
export type PriceType = 'unit' | 'set';

// Source type for price history
export type PriceSourceType = 'invoice' | 'manual' | 'import' | 'reconciliation';

// Inventory update type
export type InventoryUpdateType = 'unit' | 'set';

// Price history entry interface
export interface PriceHistory {
  id: string;
  price: number;
  startDate: string; // ISO date when price became effective
  endDate?: string; // ISO date when price ended (null if current)
  type: PriceType; // Whether this is for unit or set pricing
  sourceId?: string; // ID of source (e.g., invoiceId)
  sourceType?: PriceSourceType; // Type of source
  notes?: string; // Optional notes
}

// Enhanced interface for storing invoice description matches with quantity factors
export interface InvoiceDescriptionMatch {
  description: string;
  quantityFactor: number; // Critical for quantity normalization
  lastUsed: string; // ISO date when last used
  confidence: number; // Match confidence level (0-1)
  sourceId?: string; // Invoice ID that created this match
  sourceName?: string; // Source type (e.g., "manual", "ai", "reconciliation")
}

export class Item {
  id: string = uuidv4();
  categoryID: string | null = null;
  supplierID: string | null = null;
  name: string = "";
  itemNumber?: string; // Article number / SKU (e.g., 19000030)
  brand: {
    name: string;
  } = {
    name: "",
  };
  unit: {
    type: UnitType;
    measurement: {
      label: MeasurementLabel;
      value: number;
    };
  } = {
    type: "unit",
    measurement: {
      label: "pc",
      value: 1,
    },
  };
  set: {
    label: WholesaleUnitType;
    quantity: number;
  } | null = null;
  minimumOrder: {
    quantity: number;
    type: InventoryUpdateType;
  } = {
    quantity: 1,
    type: "unit",
  };
  inventoryUpdateBy?: InventoryUpdateType = "unit";
  pricePerUnit: number | null = null;
  pricePerUnitStartDate?: string;

  pricePerSet: number | null = null;
  priceHistory: PriceHistory[] = [];

  // Tax rate in decimal format (0.07 for 7%, 0.19 for 19%)
  taxRate?: number;

  image: string | null = null;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;

  // Enhanced field with structured type for storing known invoice descriptions
  // This will gradually replace the item_matches collection
  invoiceDescriptions?: InvoiceDescriptionMatch[] = [];

  ingredient?: string;
  tags?: string[];
  allergens?: string[];
  notes?: string;
  nutrition?: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
    saturatedFat: number;
    transFat: number;
    vitaminA: number;
    vitaminC: number;
    calcium: number;
    iron: number;
  };

  constructor() {}
}
