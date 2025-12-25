# Order-Transaction Reconciliation System

## Overview

This module ensures **data consistency** between orders and their inventory transactions. When orders are processed, they create inventory transactions (purchase, transfer, return). Over time, data can become inconsistent due to bugs, manual edits, or system errors.

### The Problem

```
┌─────────────┐          ┌──────────────────┐
│   ORDER     │          │   TRANSACTIONS   │
├─────────────┤          ├──────────────────┤
│ Item A: 10  │   ≠≠≠    │ Item A: 8        │  ❌ Mismatch
│ Item B: 5   │   ≠≠≠    │ Item B: 5        │  ✅ OK
│ Date: Jun 3 │   ≠≠≠    │ Item C: 2        │  ❌ Orphan
└─────────────┘          │ Date: May 1      │  ❌ Wrong date
                         └──────────────────┘
```

### The Solution

**3-Phase Process:**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. ANALYZE  │ --> │  2. PLAN     │ --> │  3. EXECUTE  │
│              │     │              │     │              │
│ Detect all   │     │ Generate fix │     │ Apply fixes  │
│ issues       │     │ operations   │     │ to database  │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## Phase 1: Analysis - 7 Validation Checks

### Flow Overview

```
analyzeOrderTransactions()
    │
    ├─> 1. checkWrongTypes()        ─────> Delete legacy "Order" type
    ├─> 2. checkPrecision()         ─────> Fix floating-point errors
    ├─> 3. checkOrphans()           ─────> Delete orphaned transactions
    ├─> 4. checkDuplicates()        ─────> Delete duplicate transactions
    ├─> 5. checkDatesAndQuantities()─────> Fix dates & quantities
    ├─> 6. checkTransferPairs()     ─────> Fix transfer mismatches
    └─> 7. checkTransferDates()     ─────> Fix transfer dates
         │
         └─> buildSummary()         ─────> Return analysis report
```

---

## CHECK 1: Wrong Transaction Types

### What It Detects
Legacy transactions with wrong `type` field

### Visual Example

```
BEFORE:
┌────────────────────────────┐
│ Transaction                │
├────────────────────────────┤
│ ID: tx123                  │
│ Item: Tomatoes             │
│ Quantity: 10               │
│ Type: "Order"  ⚠️ LEGACY   │
└────────────────────────────┘

EXPECTED:
┌────────────────────────────┐
│ Transaction                │
├────────────────────────────┤
│ ID: tx123                  │
│ Item: Tomatoes             │
│ Quantity: 10               │
│ Type: "Purchase" ✅        │
└────────────────────────────┘

ACTION: delete_wrong_type
FIX: Delete transaction (it's invalid)
```

### Why This Happens
- Legacy data from old system
- System migration bugs
- Manual database edits

---

## CHECK 2: Precision Errors

### What It Detects
Floating-point arithmetic bugs in quantities

### Visual Example

```
PROBLEM TYPES:

1️⃣ TYPE MISMATCH
┌─────────────────┐
│ quantity: "10"  │  ❌ String instead of number
└─────────────────┘

2️⃣ SCIENTIFIC NOTATION
┌─────────────────────┐
│ quantity: 1e-10     │  ❌ Near-zero artifact
└─────────────────────┘

3️⃣ FLOATING POINT NOISE
┌──────────────────────────┐
│ quantity: 10.00000000001 │  ❌ Should be 10
└──────────────────────────┘

4️⃣ NEAR-ZERO
┌────────────────────────┐
│ quantity: 0.00000001   │  ❌ Should be 0
└────────────────────────┘

ACTION: fix_precision
FIX: Round to 3 decimals or make it 0
     10.00001 → 10.000
     0.00001  → 0
```

### Detection Logic

```
quantity value
    │
    ├─> Is it a string?        YES ─> ❌ Type mismatch
    ├─> Is it not a number?    YES ─> ❌ Invalid type
    ├─> Has "e-" notation?     YES ─> ❌ Scientific notation
    ├─> |value| < 0.0001?      YES ─> ❌ Near-zero
    ├─> Differs from round(3)? YES ─> ❌ Floating noise
    └─> Otherwise              ─────> ✅ OK
```

---

## CHECK 3: Orphan Transactions

### What It Detects
Transactions for items that don't exist in the order

### Visual Example

```
ORDER ITEMS:
┌─────────────────┐
│ Item A (id: 1)  │
│ Item B (id: 2)  │
│ Item C (id: 3)  │
└─────────────────┘

TRANSACTIONS:
┌──────────────────────┐
│ Item A (id: 1) ✅    │  OK - exists in order
│ Item B (id: 2) ✅    │  OK - exists in order
│ Item D (id: 4) ❌    │  ORPHAN - not in order!
└──────────────────────┘

WHY: Item D was removed from order, but transaction remained

ACTION: delete_orphan
FIX: Delete orphaned transaction
```

### Flow Diagram

```
For each transaction:
    │
    └─> Does transaction.itemId exist in order.items?
            │
            ├─> YES ──> ✅ Keep
            └─> NO  ──> ❌ Mark as orphan → Delete
```

---

## CHECK 4: Duplicate Transactions

### What It Detects
Multiple transactions for the same item (should only be one)

### Visual Example

```
ORDER:
┌──────────────────────┐
│ Item: Tomatoes       │
│ Delivered: 10 kg     │
└──────────────────────┘

TRANSACTIONS (3 duplicates!):
┌──────────────────────────┐
│ tx1: 10 kg  ✅ KEEP      │  ← Matches order.delivered
│ tx2: 5 kg   ❌ DELETE    │  ← Duplicate #2
│ tx3: 8 kg   ❌ DELETE    │  ← Duplicate #3
└──────────────────────────┘

STRATEGY: Keep transaction matching order.delivered
          Delete all others

ACTION: delete_duplicate (for tx2, tx3)
FIX: Delete duplicate transactions
```

### Selection Logic

```
For each item with multiple transactions:
    │
    1. Find transaction where quantity matches order.delivered
       ├─> Use fixed quantity from CHECK 2 if available
       └─> Compare: |tx.quantity| ≈ order.delivered
    │
    2. Mark this transaction as "best match" ✅
    │
    3. Mark all others as duplicates ❌
    │
    └─> Delete duplicates
```

---

## CHECK 5: Date & Quantity Mismatches

### 5A: Date Issues

#### What It Detects
1. Wrong date format (not ISO)
2. Date differs from order by >24 hours

#### Visual Example

```
ORDER:
┌─────────────────────────────────┐
│ deliveryDate:                   │
│ "2025-06-03T00:00:00.000Z" ✅   │
└─────────────────────────────────┘

TRANSACTIONS:

PROBLEM 1: Wrong Format
┌─────────────────────────────────┐
│ createdAt: "2025-06-03" ❌      │  Missing time component
└─────────────────────────────────┘
FIX: "2025-06-03T00:00:00.000Z"

PROBLEM 2: Wrong Date
┌─────────────────────────────────┐
│ createdAt:                      │
│ "2025-05-01T00:00:00.000Z" ❌   │  33 days off!
└─────────────────────────────────┘
FIX: "2025-06-03T00:00:00.000Z"

ACTION: fix_date
FIX: Update transaction.createdAt to match order.deliveryDate
```

### 5B: Quantity Issues

#### What It Detects
Transaction quantity doesn't match order delivered quantity

#### Visual Example - Regular Order

```
ORDER:
┌──────────────────────┐
│ Item: Tomatoes       │
│ Delivered: 10 kg     │
└──────────────────────┘

TRANSACTION:
┌──────────────────────┐
│ Item: Tomatoes       │
│ Quantity: 8 kg  ❌   │  Should be 10!
└──────────────────────┘

ACTION: fix_quantity
FIX: Update order.items[].delivered = 8
     (Transaction is source of truth)
```

#### Visual Example - Return Order

```
ORDER (RETURN):
┌──────────────────────┐
│ Item: Tomatoes       │
│ Quantity: -5 kg      │  Negative = return
└──────────────────────┘

TRANSACTION:
┌──────────────────────┐
│ Item: Tomatoes       │
│ Quantity: -3 kg ❌   │  Should be -5!
└──────────────────────┘

ACTION: fix_quantity
FIX: Update order.items[].quantity = -3
     (Transaction is source of truth)
```

### Decision Flow

```
Get transaction quantity
    │
    ├─> Use fixed quantity from CHECK 2 (if precision was fixed)
    └─> Otherwise use raw tx.quantity
    │
Is order a RETURN order?
    │
    ├─> YES: Compare tx.quantity vs order.quantity (both negative)
    │        If different → fix_quantity
    │
    └─> NO:  Compare |tx.quantity| vs order.delivered
             If different → fix_quantity
```

---

## CHECK 6: Transfer Pair Mismatches

### Background: Transfer Transactions

Transfers move items between warehouses and create **2 transactions**:

```
┌────────────────┐                    ┌────────────────┐
│  Warehouse A   │   Transfer 10 kg   │  Warehouse B   │
│                │ ─────────────────> │                │
└────────────────┘                    └────────────────┘
        │                                     │
        │                                     │
        v                                     v
┌──────────────┐                      ┌──────────────┐
│ SOURCE TX    │                      │ DESTINATION  │
│ Qty: -10 kg  │ ◄────paired────────► │ Qty: +10 kg  │
│ (OUT)        │                      │ (IN)         │
└──────────────┘                      └──────────────┘
```

### 6A: Quantity Mismatch

#### Visual Example

```
PROBLEM: Quantities don't match

┌──────────────────┐              ┌──────────────────┐
│ Warehouse A      │              │ Warehouse B      │
│ SOURCE           │              │ DESTINATION      │
│ tx1: -10 kg      │ ❌ MISMATCH  │ tx2: +8 kg       │
└──────────────────┘              └──────────────────┘
     Should be equal absolute values: |-10| = |8|  ❌

FIX STRATEGY: Destination wins (what was received is truth)
┌──────────────────┐              ┌──────────────────┐
│ Warehouse A      │              │ Warehouse B      │
│ SOURCE           │              │ DESTINATION      │
│ tx1: -8 kg ✅    │              │ tx2: +8 kg ✅    │
└──────────────────┘              └──────────────────┘

ACTION: fix_transfer_mismatch
FIX: Update both transactions:
     source.quantity = -8
     destination.quantity = +8
```

### 6B: Orphaned Transfer - Missing Destination

#### Visual Example

```
PROBLEM: Source exists, no destination

┌──────────────────┐              ┌──────────────────┐
│ Warehouse A      │              │ Warehouse B      │
│ SOURCE           │              │ DESTINATION      │
│ tx1: -10 kg ✅   │     ???      │ MISSING! ❌      │
└──────────────────┘              └──────────────────┘

FIX: Create missing destination transaction
┌──────────────────┐              ┌──────────────────┐
│ Warehouse A      │              │ Warehouse B      │
│ SOURCE           │              │ DESTINATION      │
│ tx1: -10 kg ✅   │              │ NEW: +10 kg ✅   │
└──────────────────┘              └──────────────────┘

ACTION: orphaned_transfer (missingSide: 'destination')
FIX: Create new transaction:
     - itemId: same as source
     - warehouseId: destination warehouse
     - quantity: +10 (positive)
     - orderId: same as source
```

### 6C: Orphaned Transfer - Missing Source

#### Visual Example

```
PROBLEM: Destination exists, no source

┌──────────────────┐              ┌──────────────────┐
│ Warehouse A      │              │ Warehouse B      │
│ SOURCE           │              │ DESTINATION      │
│ MISSING! ❌      │     ???      │ tx2: +10 kg ✅   │
└──────────────────┘              └──────────────────┘

FIX: Create missing source transaction
┌──────────────────┐              ┌──────────────────┐
│ Warehouse A      │              │ Warehouse B      │
│ SOURCE           │              │ DESTINATION      │
│ NEW: -10 kg ✅   │              │ tx2: +10 kg ✅   │
└──────────────────┘              └──────────────────┘

ACTION: orphaned_transfer (missingSide: 'source')
FIX: Create new transaction:
     - itemId: same as destination
     - warehouseId: source warehouse
     - quantity: -10 (negative)
     - orderId: same as destination
```

### Matching Logic

```
For each item with TRANSFER transactions:
    │
    1. Separate into sources (qty < 0) and destinations (qty > 0)
    │
    2. Match pairs by orderId
       ├─> Found pair? Check if |source| = |destination|
       │   └─> Not equal? → fix_transfer_mismatch
       │
       ├─> Source has no destination? → orphaned_transfer (missing dest)
       │
       └─> Destination has no source? → orphaned_transfer (missing source)
```

---

## CHECK 7: Transfer Date Issues

### What It Detects
Same as CHECK 5A, but specifically for TRANSFER transactions

### Visual Example

```
ORDER:
┌─────────────────────────────────┐
│ deliveryDate:                   │
│ "2025-06-03T00:00:00.000Z" ✅   │
└─────────────────────────────────┘

TRANSFER TRANSACTION:
┌─────────────────────────────────┐
│ type: TRANSFER                  │
│ createdAt: "2025-06-03" ❌      │  Wrong format
└─────────────────────────────────┘

ACTION: fix_date
FIX: "2025-06-03T00:00:00.000Z"
```

---

## Phase 2: Planning - Fix Operations

After analysis, actions are transformed into executable database operations:

```
ACTIONS                          FIX OPERATIONS
──────────────────────────────────────────────────────────
fix_precision         ──────►    update_transaction_quantity
delete_duplicate      ──────►    delete_transaction
delete_orphan         ──────►    delete_transaction
delete_wrong_type     ──────►    delete_transaction
fix_date              ──────►    update_transaction_date
fix_quantity          ──────►    update_order_item_delivered
fix_transfer_mismatch ──────►    fix_transfer_pair
orphaned_transfer     ──────►    create_transfer_transaction
```

### Example Transformation

```typescript
// INPUT: Analysis action
{
  type: 'fix_precision',
  transactionId: 'tx123',
  currentQuantity: 10.00001,
  fixedQuantity: 10
}

// OUTPUT: Fix operation
{
  type: 'update_transaction_quantity',
  transactionId: 'tx123',
  newQuantity: 10
}
```

---

## Phase 3: Execution - Apply Fixes

### Execution Order

```
1. Update transaction quantities    (precision fixes)
2. Delete transactions               (duplicates, orphans, wrong types)
3. Update transaction dates          (date format/mismatch fixes)
4. Update order item delivered       (quantity syncing - batched)
5. Fix transfer pairs                (update both source & dest)
6. Create missing transfers          (orphaned transfers)
7. Apply batched order updates       (commit all quantity changes)
```

### Database Operations

```
┌─────────────────────────────────────────────────────┐
│ ReconciliationDbOps Interface                       │
├─────────────────────────────────────────────────────┤
│ getTransaction(id)              → Read              │
│ updateTransactionFields(id, {}) → Partial update    │
│ upsertTransaction(id, data)     → Create or update  │
│ deleteTransaction(id)           → Delete            │
│ upsertOrder(id, data)           → Create or update  │
└─────────────────────────────────────────────────────┘
```

### Error Handling

```
For each operation:
    │
    ├─> Execute operation
    │   ├─> Success? → fixedCount++
    │   └─> Error?   → errorCount++, log error, continue
    │
    └─> Return { fixedCount, errorCount }
```

---

## Complete Flow Example

### Scenario: Order with Multiple Issues

```
INPUT ORDER:
┌──────────────────────────────────────┐
│ Order #1234                          │
│ Delivery: 2025-06-03T00:00:00.000Z   │
├──────────────────────────────────────┤
│ Items:                               │
│ - Tomatoes (id:1): delivered 10 kg   │
│ - Onions (id:2): delivered 5 kg      │
└──────────────────────────────────────┘

INPUT TRANSACTIONS:
┌──────────────────────────────────────┐
│ tx1: Tomatoes, qty: 10.00001  ❌ 1   │  Precision error
│ tx2: Tomatoes, qty: 8         ❌ 2   │  Duplicate
│ tx3: Onions, qty: 5, date: "2025-06-03" ❌ 3  │  Wrong format
│ tx4: Carrots (id:3), qty: 2   ❌ 4   │  Orphan
│ tx5: Transfer OUT: -10        ❌ 5   │  Missing pair
└──────────────────────────────────────┘
```

### Phase 1: Analysis

```
CHECK 2 - Precision:
  ✓ tx1: fix_precision (10.00001 → 10)

CHECK 3 - Orphans:
  ✓ tx4: delete_orphan (Carrots not in order)

CHECK 4 - Duplicates:
  ✓ tx2: delete_duplicate (tx1 matches delivered=10)

CHECK 5 - Dates:
  ✓ tx3: fix_date ("2025-06-03" → ISO)

CHECK 6 - Transfers:
  ✓ tx5: orphaned_transfer (missing destination)

SUMMARY:
  - Precision errors: 1
  - Orphans: 1
  - Duplicates: 1
  - Date errors: 1
  - Orphaned transfers: 1
  - TOTAL: 5 actions
```

### Phase 2: Planning

```
FIX OPERATIONS:
1. update_transaction_quantity (tx1 → 10)
2. delete_transaction (tx4)
3. delete_transaction (tx2)
4. update_transaction_date (tx3 → ISO)
5. create_transfer_transaction (destination +10)
```

### Phase 3: Execution

```
STEP 1: Update tx1 quantity ✅
STEP 2: Delete tx4 ✅
STEP 3: Delete tx2 ✅
STEP 4: Update tx3 date ✅
STEP 5: Create new transfer tx ✅

RESULT: { fixedCount: 5, errorCount: 0 }
```

### Final State

```
OUTPUT ORDER:
┌──────────────────────────────────────┐
│ Order #1234                          │
│ Delivery: 2025-06-03T00:00:00.000Z   │
├──────────────────────────────────────┤
│ Items:                               │
│ - Tomatoes (id:1): delivered 10 kg   │
│ - Onions (id:2): delivered 5 kg      │
└──────────────────────────────────────┘

OUTPUT TRANSACTIONS:
┌──────────────────────────────────────┐
│ tx1: Tomatoes, qty: 10 ✅            │
│ tx3: Onions, qty: 5, date: ISO ✅    │
│ tx5: Transfer OUT: -10 ✅            │
│ tx6: Transfer IN: +10 ✅ (NEW)       │
└──────────────────────────────────────┘

ALL ISSUES RESOLVED! ✅
```

---

## API Usage

### 1. Analyze

```typescript
import { analyzeOrderTransactions } from './order-transaction-reconciliation'

const analysis = analyzeOrderTransactions(
  order,
  transactionsMap,
  (itemId) => `Item ${itemId}` // Optional: item name resolver
)

// analysis.summary
// {
//   precisionErrors: 1,
//   dateErrors: 1,
//   quantityErrors: 0,
//   duplicates: 1,
//   orphans: 1,
//   wrongTypes: 0,
//   transferMismatches: 0,
//   orphanedTransfers: 1,
//   total: 5
// }
```

### 2. Plan Fixes

```typescript
import { getFixOperations } from './order-transaction-reconciliation'

const fixOps = getFixOperations(
  analysis.actions,
  order.id,
  sourceWarehouseId,    // For creating missing transfers
  destinationWarehouseId
)

// fixOps = [
//   { type: 'update_transaction_quantity', ... },
//   { type: 'delete_transaction', ... },
//   ...
// ]
```

### 3. Execute Fixes

```typescript
import { executeReconciliationFixes } from './order-transaction-reconciliation'

// Implement database operations
const dbOps = {
  getTransaction: async (id) => await db.transactions.get(id),
  updateTransactionFields: async (id, fields) => await db.transactions.update(id, fields),
  upsertTransaction: async (id, data) => await db.transactions.upsert(id, data),
  deleteTransaction: async (id) => await db.transactions.delete(id),
  upsertOrder: async (id, data) => await db.orders.upsert(id, data),
}

const orderLookup = {
  getOrder: (orderId) => ordersMap.get(orderId)
}

const result = await executeReconciliationFixes(
  fixOps,
  orderLookup,
  dbOps
)

// result = { fixedCount: 5, errorCount: 0 }
```

---

## Key Design Principles

### 1. Transaction as Source of Truth
For quantities, the transaction's recorded quantity is considered authoritative. The order's `delivered` field is updated to match.

### 2. Order Date as Source of Truth
For dates, the order's `deliveryDate` is considered authoritative. Transaction dates are updated to match.

### 3. Destination Wins for Transfers
When transfer pairs mismatch, the destination quantity (what was received) is considered truth.

### 4. Immutable Analysis
The `analyzeOrderTransactions` function is **pure** - it never modifies input data. It only detects issues and returns actions.

### 5. Fail-Safe Execution
If one fix fails, execution continues with others. All errors are logged and counted.

---

## Common Scenarios

### Scenario 1: Import from Legacy System
**Problem**: Old data has wrong types and formats
**Detected**: CHECK 1 (wrong types), CHECK 5A (date formats)
**Fixed**: Delete wrong types, update dates to ISO

### Scenario 2: Manual Database Edit
**Problem**: Admin deleted order item but not transaction
**Detected**: CHECK 3 (orphan)
**Fixed**: Delete orphaned transaction

### Scenario 3: Floating Point Bug
**Problem**: JavaScript calculation created `10.000000001`
**Detected**: CHECK 2 (precision)
**Fixed**: Round to `10.000`

### Scenario 4: Incomplete Transfer
**Problem**: System crash during transfer, only created source
**Detected**: CHECK 6B (orphaned transfer)
**Fixed**: Create missing destination transaction

### Scenario 5: Duplicate Submission
**Problem**: User double-clicked submit, created 2 transactions
**Detected**: CHECK 4 (duplicates)
**Fixed**: Keep best match, delete duplicate

---

## Performance Considerations

### Time Complexity
- **Analysis**: O(n) where n = number of transactions
- **Grouping**: O(n) per check (using Maps)
- **Execution**: O(m) where m = number of fixes

### Space Complexity
- **Context**: O(n) - stores all transactions and actions
- **Operations**: O(m) - stores fix operations

### Optimization
- Transactions grouped by `itemId` using `Map` for O(1) lookups
- Batch order updates to minimize database writes
- All checks run in single pass where possible

---

## Testing Recommendations

### Unit Tests
```typescript
describe('CHECK 2: Precision', () => {
  it('should detect floating point noise', () => {
    const issue = detectPrecisionIssue(10.00000001)
    expect(issue).toMatchObject({ type: 'Floating point noise' })
  })

  it('should fix near-zero to 0', () => {
    expect(fixPrecision(0.00000001)).toBe(0)
  })
})
```

### Integration Tests
```typescript
describe('Full reconciliation', () => {
  it('should fix all issues in mixed scenario', () => {
    const analysis = analyzeOrderTransactions(mockOrder, mockTransactions)
    expect(analysis.summary.total).toBe(5)

    const ops = getFixOperations(analysis.actions, mockOrder.id)
    expect(ops).toHaveLength(5)
  })
})
```

---

## Troubleshooting

### Issue: Fixes Not Applied
**Check**:
1. Are operations being executed in correct order?
2. Is database connection working?
3. Check `errorCount` in result

### Issue: Quantities Still Wrong
**Check**:
1. Was precision check run first?
2. Is `precisionFixed` map being used?
3. Are return orders using correct logic?

### Issue: Transfers Not Matching
**Check**:
1. Are transfers matched by `orderId`?
2. Are source/destination warehouses correct?
3. Is `missingSide` correctly identified?

---

## Future Enhancements

- [ ] Add support for partial deliveries
- [ ] Handle multiple transfer hops
- [ ] Dry-run mode (preview without executing)
- [ ] Undo/rollback support
- [ ] Audit trail for all fixes
- [ ] Scheduled batch reconciliation
- [ ] Real-time reconciliation on order changes

---

## License

Part of Samwa/Melanie project
