import { Order, ORDER_STATUSES } from '../types/owl/orders.types'

/**
 * Detects if an order is or was a transfer order
 */
export function isOrWasTransferOrder(order: Order): boolean {
  return (
    order.status === ORDER_STATUSES.Transfer ||
    // Check if fromWarehouseID exists (also indicates a transfer)
    Boolean(order.fromWarehouseID)
  )
}