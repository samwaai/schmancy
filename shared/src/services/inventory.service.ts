// // packages/shared/src/services/inventory.service.ts
// import { Observable, of } from 'rxjs';
// import { Item, Transaction, TransactionType } from '../../types/melanie/index.js';

// /**
//  * Inventory snapshot for a specific item in a warehouse
//  */
// export interface InventorySnapshot {
//   itemId: string;
//   warehouseId: string;
//   quantity: number;
//   unitType: string;
// }

// /**
//  * Consumption data for a specific item
//  */
// export interface InventoryConsumption {
//   itemId: string;
//   warehouseId: string;
//   startQuantity: number;
//   endQuantity: number;
//   purchases: number;
//   sales: number;
//   transfers: {
//     in: number;
//     out: number;
//   };
//   calculatedConsumption: number;
//   actualConsumption: number;
//   variance: number;
//   variancePercentage: number;
// }

// /**
//  * Result of the inventory consumption calculation
//  */
// export interface InventoryConsumptionResult {
//   startSnapshot: Map<string, InventorySnapshot>;
//   endSnapshot: Map<string, InventorySnapshot>;
//   consumption: Map<string, InventoryConsumption>;
//   transactions: {
//     purchases: number;
//     sales: number;
//     transfers: number;
//     adjustments: number;
//   };
// }

// /**
//  * Service to handle inventory-related operations
//  */
// export class InventoryService {
//   /**
//    * Get inventory snapshots and consumption for a specified period
//    */
//   static getInventoryConsumption(
//     startDate: string,
//     endDate: string,
//     warehouseIds?: string[],
//     transactionsMap?: Map<string, Transaction>,
//     itemsMap?: Map<string, Item>,
//   ): Observable<InventoryConsumptionResult> {
//     // If we already have the transactions and items, use them
//     if (transactionsMap && itemsMap) {
//       return of(this.processInventoryData(
//         transactionsMap,
//         itemsMap,
//         new Date(startDate),
//         new Date(endDate),
//         warehouseIds
//       ));
//     }

//     // Fallback empty result
//     return of({
//       startSnapshot: new Map<string, InventorySnapshot>(),
//       endSnapshot: new Map<string, InventorySnapshot>(),
//       consumption: new Map<string, InventoryConsumption>(),
//       transactions: {
//         purchases: 0,
//         sales: 0,
//         transfers: 0,
//         adjustments: 0
//       }
//     });
//   }

//   /**
//    * Process inventory data to calculate consumption
//    */
//   private static processInventoryData(
//     transactions: Map<string, Transaction>,
//     items: Map<string, Item>,
//     startDate: Date,
//     endDate: Date,
//     warehouseIds?: string[]
//   ): InventoryConsumptionResult {
//     // Initialize results
//     const startSnapshot = new Map<string, InventorySnapshot>();
//     const endSnapshot = new Map<string, InventorySnapshot>();
//     const consumption = new Map<string, InventoryConsumption>();
    
//     // Transaction counters
//     let purchaseCount = 0;
//     let salesCount = 0;
//     let transferCount = 0;
//     let adjustmentCount = 0;

//     // Get all transactions as array for easier filtering
//     const allTransactions = Array.from(transactions.values());

//     // Filter to transactions for the relevant warehouses
//     const warehouseTransactions = warehouseIds && warehouseIds.length > 0
//       ? allTransactions.filter(tx => warehouseIds.includes(tx.warehouseID))
//       : allTransactions;

//     // Get transactions BEFORE start date (for calculating starting inventory)
//     const beforeStartTransactions = warehouseTransactions.filter(tx => {
//       const txDate = new Date(tx.createdAt);
//       return txDate < startDate;
//     });

//     // Get transactions BEFORE OR ON end date (for calculating ending inventory)
//     const beforeOrOnEndTransactions = warehouseTransactions.filter(tx => {
//       const txDate = new Date(tx.createdAt);
//       return txDate <= endDate;
//     });

//     // Get transactions DURING the period (between start and end dates inclusive)
//     const periodTransactions = warehouseTransactions.filter(tx => {
//       const txDate = new Date(tx.createdAt);
//       return txDate >= startDate && txDate <= endDate;
//     });

//     // Count transaction types in the period
//     for (const tx of periodTransactions) {
//       if (tx.quantity > 0) {
//         if (tx.type === TransactionType.TRANSFER) {
//           transferCount++;
//         } else {
//           purchaseCount++;
//         }
//       } else if (tx.type === TransactionType.SALE) {
//         salesCount++;
//       } else if (tx.type === TransactionType.TRANSFER) {
//         transferCount++;
//       } else if (tx.type === TransactionType.ADJUSTMENT) {
//         adjustmentCount++;
//       }
//     }

//     // Calculate start and end inventory quantities by warehouse and item
//     const startQuantities = this.calculateInventoryState(beforeStartTransactions);
//     const endQuantities = this.calculateInventoryState(beforeOrOnEndTransactions);

//     // Create a set of all item-warehouse combinations
//     const itemWarehousePairs = new Set<string>();
    
//     // Add from all transactions to ensure we catch everything
//     for (const tx of warehouseTransactions) {
//       itemWarehousePairs.add(`${tx.warehouseID}:${tx.itemId}`);
//     }

//     // Process each warehouse-item pair
//     for (const key of itemWarehousePairs) {
//       const [warehouseId, itemId] = key.split(':');
//       const item = items.get(itemId);
      
//       if (!item) continue;

//       // Get quantities at start and end
//       const startQuantity = startQuantities.get(key)?.quantity || 0;
//       const endQuantity = endQuantities.get(key)?.quantity || 0;
      
//       // Get transactions during period for this item-warehouse pair
//       const itemPeriodTransactions = periodTransactions.filter(
//         tx => tx.itemId === itemId && tx.warehouseID === warehouseId
//       );

//       // Calculate purchases, sales, and transfers during the period
//       let periodPurchases = 0;
//       let periodSales = 0;
//       let periodTransfersIn = 0;
//       let periodTransfersOut = 0;

//       for (const tx of itemPeriodTransactions) {
//         // Convert to standard units if needed
//         const standardizedQuantity = this.standardizeQuantity(Math.abs(tx.quantity), item, tx.unitType);
        
//         if (tx.quantity > 0) {
//           // Purchase (positive quantity, not a transfer)
//           if (tx.type === TransactionType.TRANSFER) {
//             periodTransfersIn += standardizedQuantity;
//           } else {
//             periodPurchases += standardizedQuantity;
//           }
//         } else {
//           // Negative quantity transactions
//           if (tx.type === TransactionType.TRANSFER) {
//             // Transfer out (negative quantity, transfer type)
//             periodTransfersOut += standardizedQuantity;
//           } else if (tx.type === TransactionType.SALE) {
//             // Sale (negative quantity, sale type)
//             periodSales += standardizedQuantity;
//           }
//         }
//       }

//       // Store inventory snapshots
//       startSnapshot.set(key, {
//         itemId,
//         warehouseId,
//         quantity: startQuantity,
//         unitType: item.unit?.type || 'unit'
//       });
      
//       endSnapshot.set(key, {
//         itemId,
//         warehouseId,
//         quantity: endQuantity,
//         unitType: item.unit?.type || 'unit'
//       });

//       // Calculate expected consumption based on known sales transactions
//       const calculatedConsumption = periodSales;
      
//       // Correct formula: endQuantity = startQuantity - consumption + purchases - transfersOut
//       // Re-arranged: consumption = startQuantity + purchases - transfersOut - endQuantity
//       // Which is simpler: consumption = startQuantity - endQuantity + purchases - transfersOut
//       const actualConsumption = endQuantity - startQuantity + periodPurchases + periodTransfersOut;
      
//       // Calculate variance (difference between actual and calculated consumption)
//       const variance = actualConsumption - calculatedConsumption;
//       const variancePercentage = calculatedConsumption !== 0 
//         ? (variance / calculatedConsumption) * 100 
//         : 0;

//       // Store consumption data
//       consumption.set(key, {
//         itemId,
//         warehouseId,
//         startQuantity,
//         endQuantity,
//         purchases: periodPurchases,
//         sales: periodSales,
//         transfers: {
//           in: periodTransfersIn,
//           out: periodTransfersOut
//         },
//         calculatedConsumption,
//         actualConsumption,
//         variance,
//         variancePercentage
//       });
//     }

//     return {
//       startSnapshot,
//       endSnapshot,
//       consumption,
//       transactions: {
//         purchases: purchaseCount,
//         sales: salesCount,
//         transfers: transferCount,
//         adjustments: adjustmentCount
//       }
//     };
//   }

//   /**
//    * Calculate inventory state at a point in time by summing all transactions
//    * This matches the warehouse component's approach
//    */
//   private static calculateInventoryState(transactions: Transaction[]): Map<string, InventorySnapshot> {
//     const state = new Map<string, InventorySnapshot>();
    
//     for (const tx of transactions) {
//       const key = `${tx.warehouseID}:${tx.itemId}`;
      
//       if (!state.has(key)) {
//         state.set(key, {
//           itemId: tx.itemId,
//           warehouseId: tx.warehouseID,
//           quantity: 0,
//           unitType: tx.unitType
//         });
//       }
      
//       // Add transaction quantity to current total
//       const current = state.get(key)!;
//       current.quantity += tx.quantity;
      
//       // Ensure non-negative quantities
//       if (current.quantity < 0) {
//         current.quantity = 0;
//       }
//     }
    
//     return state;
//   }

//   /**
//    * Standardize quantity to a common unit of measurement
//    */
//   private static standardizeQuantity(
//     quantity: number,
//     item: Item,
//     unitType: 'unit' | 'set'
//   ): number {
//     // For set quantities, convert to units
//     if (unitType === 'set' && item.set?.quantity) {
//       return quantity * item.set.quantity;
//     }
//     return quantity;
//   }

//   /**
//    * Calculate inventory levels for menu items based on their inventory mappings
//    */
//   static calculateMenuItemConsumption(
//     menuItemId: string,
//     menuItems: Map<string, any>,
//     inventoryConsumption: Map<string, InventoryConsumption>
//   ): {
//     expectedConsumption: number,
//     actualConsumption: number,
//     variance: number,
//     variancePercentage: number
//   } {
//     const menuItem = menuItems.get(menuItemId);
//     if (!menuItem) {
//       return {
//         expectedConsumption: 0,
//         actualConsumption: 0,
//         variance: 0,
//         variancePercentage: 0
//       };
//     }

//     let expectedConsumption = 0;
//     let actualConsumption = 0;
//     let foundConsumptionData = false;

//     // Handle inventory mappings with ratio
//     if (menuItem.inventoryMappings && menuItem.inventoryMappings.length > 0) {
//       for (const mapping of menuItem.inventoryMappings) {
//         const itemId = mapping.itemId;
//         const ratio = mapping.ratio || 1;
        
//         // Find consumption data for this item across all warehouses
//         for (const [key, consumption] of inventoryConsumption.entries()) {
//           if (consumption.itemId === itemId) {
//             foundConsumptionData = true;
//             expectedConsumption += consumption.calculatedConsumption * ratio;
//             actualConsumption += consumption.actualConsumption * ratio;
//           }
//         }
//       }
//     }
//     // Handle legacy inventory item IDs
//     else if (menuItem.inventoryItemIds && menuItem.inventoryItemIds.length > 0) {
//       for (const itemId of menuItem.inventoryItemIds) {
//         // Find consumption data for this item across all warehouses
//         for (const [key, consumption] of inventoryConsumption.entries()) {
//           if (consumption.itemId === itemId) {
//             foundConsumptionData = true;
//             expectedConsumption += consumption.calculatedConsumption;
//             actualConsumption += consumption.actualConsumption;
//           }
//         }
//       }
//     }

//     // If we found no consumption data but have menu item quantities,
//     // use the totalInventoryQuantity as a fallback
//     if (!foundConsumptionData) {
//       if (menuItem.totalInventoryQuantity > 0) {
//         // Use direct quantity values from the menu item
//         expectedConsumption = menuItem.totalPosQuantity || 0;
//         actualConsumption = menuItem.totalInventoryQuantity || 0;
//       }
//     }

//     // Calculate variance and percentage
//     const variance = actualConsumption - expectedConsumption;
//     const variancePercentage = expectedConsumption !== 0 
//       ? (variance / expectedConsumption) * 100 
//       : 0;

//     return {
//       expectedConsumption,
//       actualConsumption,
//       variance,
//       variancePercentage
//     };
//   }
// }
