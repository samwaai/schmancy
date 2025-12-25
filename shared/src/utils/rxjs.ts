import { defer, from, OperatorFunction, pipe } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import type { ITransaction } from '../types/owl/transactions.types';

export function fromPromise<T>(factory: (signal: AbortSignal) => Promise<T>) {
  return defer(() => {
    const controller = new AbortController();
    return from(factory(controller.signal)).pipe(
      finalize(() => controller.abort())
    );
  });
}

/**
 * Result of aggregating transactions for a warehouse
 */
export interface TransactionAggregation {
  /** Map of itemId -> current stock quantity */
  stockQuantities: Map<string, number>;
  /** Map of itemId -> relevance score (recency + frequency weighted) */
  relevanceScores: Map<string, number>;
}

/**
 * Configuration for transaction aggregation
 */
export interface AggregationConfig {
  /** Half-life for relevance decay in days (default: 30) */
  decayHalfLifeDays?: number;
  /** Whether to include relevance scoring (default: true) */
  includeRelevance?: boolean;
}

/**
 * Pure function to calculate relevance score for a single transaction
 * Uses exponential decay: score = e^(-daysAgo / halfLife)
 *
 * @example
 * // Today: 1.0, 30 days ago: 0.37, 60 days ago: 0.14
 * const score = calculateRelevanceScore(transaction.createdAt, 30);
 */
export function calculateRelevanceScore(
  createdAt: string,
  halfLifeDays: number = 30,
  now: number = Date.now()
): number {
  const daysAgo = (now - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-daysAgo / halfLifeDays);
}

/**
 * Pure function to aggregate transactions into stock quantities and relevance scores
 *
 * @param transactions - Array of transactions to aggregate
 * @param config - Optional configuration
 * @returns Aggregated stock and relevance data
 *
 * @example
 * const result = aggregateTransactions(transactions);
 * console.log(result.stockQuantities.get(itemId)); // Current stock
 * console.log(result.relevanceScores.get(itemId)); // Relevance score
 */
export function aggregateTransactions(
  transactions: ITransaction[],
  config: AggregationConfig = {}
): TransactionAggregation {
  const { decayHalfLifeDays = 30, includeRelevance = true } = config;
  const now = Date.now();

  const stockQuantities = new Map<string, number>();
  const relevanceScores = new Map<string, number>();

  for (const tx of transactions) {
    // Aggregate stock quantities
    const currentQty = stockQuantities.get(tx.itemId) ?? 0;
    stockQuantities.set(tx.itemId, currentQty + tx.quantity);

    // Calculate relevance (purchases only - positive quantities)
    if (includeRelevance && tx.quantity > 0 && tx.createdAt) {
      const score = calculateRelevanceScore(tx.createdAt, decayHalfLifeDays, now);
      const currentScore = relevanceScores.get(tx.itemId) ?? 0;
      relevanceScores.set(tx.itemId, currentScore + score);
    }
  }

  return { stockQuantities, relevanceScores };
}

/**
 * RxJS operator to aggregate transactions from a Map into stock and relevance data
 *
 * @param config - Optional configuration for aggregation
 * @returns Pipeable operator
 *
 * @example
 * TransactionsDB.query([...]).pipe(
 *   aggregateTransactionsOperator(),
 *   map(({ stockQuantities, relevanceScores }) => {
 *     // Use aggregated data
 *   })
 * )
 */
export function aggregateTransactionsOperator(
  config: AggregationConfig = {}
): OperatorFunction<Map<string, ITransaction>, TransactionAggregation> {
  return pipe(
    map(transactionsMap => Array.from(transactionsMap.values())),
    map(transactions => aggregateTransactions(transactions, config))
  );
}
