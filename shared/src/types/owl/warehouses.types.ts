// packages/shared/src/types/owl/warehouses.types.ts

import { v4 as uuidv4 } from "uuid";

export type WarehouseType = "site" | "storage";
export interface WarehouseItem {
  id: string;
  quantity: number;
}

export interface SuperWarehouse {
  id: string;
  name: string;
  parentID: string | null;
  priority: number | null;
  itemsCount?: number;
}

// Warehouse class with tight business coupling via businessId
export class Warehouse implements SuperWarehouse {
  orgId: string = "";
  deliveryAddress = "";
  gpsLatitude? = null;
  gpsLongitude? = null;
  id: string = uuidv4();
  name: string = "";
  photo?: string = "";
  emoji?: string = "";
  items = [];
  sharedWith?: string[];
  cc: string[] = [];
  type?: WarehouseType;
  // Added itemOrder to store custom item ordering
  itemOrder?: { [itemId: string]: number } = {};
  // Business ID - establishes tight coupling between business and warehouse
  businessId?: string;

  priority: number | null = null;

  constructor(orgId: string) {
    this.orgId = orgId;
    this.parentID = null;
  }
  parentID: string | null = null;
}
