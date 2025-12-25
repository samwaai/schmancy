/**
 * Get Revolut Orders API Types
 * @see https://developer.revolut.com/docs/merchant/retrieve-order-list
 *
 * Fetches ALL orders using automatic cursor-based pagination
 */

import type { RevolutOrder } from './revolut-orders.types';

export interface Request {
  orgId: string;
  fromCreatedDate?: string;
  toCreatedDate?: string;
  state?: string[];
  merchantOrderRef?: string;
}

export interface Response {
  success: boolean;
  orders?: RevolutOrder[];
  error?: string;
}
