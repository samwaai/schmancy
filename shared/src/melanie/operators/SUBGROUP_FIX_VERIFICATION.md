# Subgroup Distribution Fix - Verification Scenarios

## Changes Made

### Fix 1: Skip Parent Distribution When Has Children
**Location**: `distributeToEmployees()` lines 153-158

**Before**:
```typescript
if (group.professionIds.length === 0) {
  continue;
}
```

**After**:
```typescript
// Calculate remainder for parent groups with children
const children = groups.filter(g => g.parentId === group.id);
let amountToDistribute = group.allocatedAmount;
let professionIdsToUse = group.professionIds;

if (children.length > 0) {
  // Parent has children - distribute only the remainder
  const childrenAllocated = children.reduce((sum, child) => sum + child.allocatedAmount, 0);
  amountToDistribute = group.allocatedAmount - childrenAllocated;

  // Exclude professions that are already in children
  const childProfessionIds = new Set(children.flatMap(c => c.professionIds));
  professionIdsToUse = group.professionIds.filter(profId => !childProfessionIds.has(profId));

  // Skip if no remainder or no remaining professions
  if (amountToDistribute <= 0 || professionIdsToUse.length === 0) {
    continue;
  }
}
```

**Effect**: Parent groups with children distribute the **REMAINDER** (after children take their share) to professions NOT in children.

---

### Fix 2: Proper Remainder Warnings
**Location**: `validateAndFinalize()` lines 342-382

**Added Logic**:
- Calculates how much children took from parent's allocation
- Shows remainder amount in euros
- Lists professions in parent but not in children (suggests creating subgroups)
- Detects when children allocate MORE than parent (error condition)

**Effect**: Clear, actionable warnings about unallocated amounts from parent groups.

---

### Fix 3: Improved Unassigned Tips Warnings
**Location**: `validateAndFinalize()` lines 319-340

**Added Logic**:
- Separates parent groups (with children) from leaf groups (no children)
- Only warns about leaf groups that couldn't distribute
- Parent remainder is handled by Fix 2 above

**Effect**: No duplicate/confusing warnings. Clear distinction between different types of unassigned tips.

---

## Test Scenarios

### Scenario 1: Parent with Category Child (Bar Team)

**Configuration**:
```typescript
tipsDistribution: {
  "front_of_house": {
    type: "fixed",
    percentage: 80,
    professionIds: ["waiter", "bartender", "host"],
    employeeDistribution: "by_hours"
  },
  "bar_team": {
    type: "category",
    categories: ["Bar", "Drinks"],
    parentId: "front_of_house",
    professionIds: ["bartender"],
    employeeDistribution: "equal"
  },
  "back_of_house": {
    type: "fixed",
    percentage: 20,
    professionIds: ["chef"],
    employeeDistribution: "by_hours"
  }
}
```

**Data**:
- Total Tips: €1000 (100,000 cents)
- Total Sales: €8000
- Bar Sales: €2000 (25%)
- Employees:
  - Alice (waiter): 40 hours
  - Charlie (bartender): 30 hours
  - Eve (host): 20 hours
  - Frank (chef): 40 hours

**Expected Calculation**:

1. **Allocate to Groups**:
   ```
   front_of_house: 100,000 × 0.80 = 80,000 cents
   bar_team (25% of parent): 80,000 × 0.25 = 20,000 cents
   back_of_house: 100,000 × 0.20 = 20,000 cents
   ```

2. **Distribution** (✅ FIXED - parent distributes remainder):
   ```
   bar_team distributes 20,000 to [bartender]:
     - Charlie: 20,000 cents (€200)

   front_of_house calculates remainder:
     - Allocated: 80,000 cents
     - Children took: 20,000 cents
     - Remainder: 60,000 cents
     - Remaining professions: [waiter, host] (bartender excluded, in child)
     - Employees: Alice (waiter, 40h), Eve (host, 20h) = 60h total
     - Alice: 60,000 × (40/60) = 40,000 cents (€400)
     - Eve: 60,000 × (20/60) = 20,000 cents (€200)

   back_of_house distributes 20,000 to [chef]:
     - Frank: 20,000 cents (€200)
   ```

3. **Final Amounts**:
   ```
   Alice (waiter):      €400 ✅
   Charlie (bartender): €200 ✅
   Eve (host):          €200 ✅
   Frank (chef):        €200 ✅
   TOTAL:               €1000 ✅ PERFECT! All tips distributed!
   ```

4. **Warnings**:
   ```
   NONE! ✅ Everything distributed successfully.
   ```

---

### Scenario 2: Parent with Fixed Child

**Configuration**:
```typescript
tipsDistribution: {
  "service": {
    type: "fixed",
    percentage: 70,
    professionIds: ["waiter", "bartender"],
    employeeDistribution: "by_hours"
  },
  "bar_only": {
    type: "fixed",
    percentage: 40,  // 40% of parent's 70%
    parentId: "service",
    professionIds: ["bartender"],
    employeeDistribution: "equal"
  },
  "kitchen": {
    type: "fixed",
    percentage: 30,
    professionIds: ["chef"],
    employeeDistribution: "by_hours"
  }
}
```

**Data**:
- Total Tips: €1000 (100,000 cents)
- Employees:
  - Alice (waiter): 40 hours
  - Charlie (bartender): 30 hours
  - Frank (chef): 35 hours

**Expected Calculation**:

1. **Allocate**:
   ```
   service: 100,000 × 0.70 = 70,000 cents
   bar_only (40% of parent): 70,000 × 0.40 = 28,000 cents
   kitchen: 100,000 × 0.30 = 30,000 cents
   ```

2. **Distribution**:
   ```
   bar_only distributes 28,000 to [bartender]:
     - Charlie: 28,000 cents (€280)

   service calculates remainder:
     - Allocated: 70,000 cents
     - Children took: 28,000 cents
     - Remainder: 42,000 cents
     - Remaining professions: [waiter] (bartender excluded, in child)
     - Employees: Alice (waiter, 40h)
     - Alice: 42,000 cents (€420)

   kitchen distributes 30,000 to [chef]:
     - Frank: 30,000 cents (€300)
   ```

3. **Final Amounts**:
   ```
   Alice (waiter):      €420 ✅
   Charlie (bartender): €280 ✅
   Frank (chef):        €300 ✅
   TOTAL:               €1000 ✅ PERFECT!
   ```

4. **Warning**:
   ```
   NONE! ✅ All distributed successfully.
   ```

---

### Scenario 3: Parent with Multiple Children - Full Coverage

**Configuration**:
```typescript
tipsDistribution: {
  "front": {
    type: "fixed",
    percentage: 100,
    professionIds: ["waiter", "bartender"],
    employeeDistribution: "by_hours"
  },
  "waiters": {
    type: "fixed",
    percentage: 60,  // 60% of parent
    parentId: "front",
    professionIds: ["waiter"],
    employeeDistribution: "by_hours"
  },
  "bartenders": {
    type: "fixed",
    percentage: 40,  // 40% of parent
    parentId: "front",
    professionIds: ["bartender"],
    employeeDistribution: "equal"
  }
}
```

**Data**:
- Total Tips: €1000 (100,000 cents)
- Employees:
  - Alice (waiter): 40 hours
  - Bob (waiter): 20 hours
  - Charlie (bartender): 30 hours

**Expected Calculation**:

1. **Allocate**:
   ```
   front: 100,000 × 1.00 = 100,000 cents
   waiters: 100,000 × 0.60 = 60,000 cents
   bartenders: 100,000 × 0.40 = 40,000 cents
   Total children: 100,000 cents (exactly matches parent!)
   ```

2. **Distribution**:
   ```
   waiters distributes 60,000 by hours:
     - Alice (40h): 60,000 × (40/60) = 40,000 cents (€400)
     - Bob (20h): 60,000 × (20/60) = 20,000 cents (€200)

   bartenders distributes 40,000 equally:
     - Charlie: 40,000 cents (€400)

   front calculates remainder:
     - Allocated: 100,000 cents
     - Children took: 100,000 cents (60,000 + 40,000)
     - Remainder: 0 cents ✅
     - SKIPS distribution (no remainder)
   ```

3. **Final Amounts**:
   ```
   Alice (waiter):      €400 ✅
   Bob (waiter):        €200 ✅
   Charlie (bartender): €400 ✅
   TOTAL:               €1000 ✅ PERFECT!
   ```

4. **Warning**:
   ```
   NONE! ✅ Children allocated exactly parent's amount, no remainder.
   ```

---

### Scenario 4: Parent Children Over-Allocate (ERROR)

**Configuration**:
```typescript
tipsDistribution: {
  "service": {
    type: "fixed",
    percentage: 60,  // 60% of total
    professionIds: ["waiter", "bartender"],
    employeeDistribution: "by_hours"
  },
  "waiters": {
    type: "fixed",
    percentage: 50,  // 50% of parent = 30% of total
    parentId: "service",
    professionIds: ["waiter"],
    employeeDistribution: "by_hours"
  },
  "bartenders": {
    type: "fixed",
    percentage: 60,  // 60% of parent = 36% of total
    parentId: "service",
    professionIds: ["bartender"],
    employeeDistribution: "equal"
  }
}
```

**Data**:
- Total Tips: €1000 (100,000 cents)

**Expected Calculation**:

1. **Allocate**:
   ```
   service: 100,000 × 0.60 = 60,000 cents
   waiters: 60,000 × 0.50 = 30,000 cents
   bartenders: 60,000 × 0.60 = 36,000 cents
   Total children: 66,000 cents (EXCEEDS parent by 6,000!)
   ```

2. **ERROR**:
   ```
   "Service children allocate €60.00 more than parent's total.
    Parent: €600.00, Children total: €660.00"
   ```

---

### Scenario 5: Parent Remainder with No Employees (WARNING)

**Configuration**:
```typescript
tipsDistribution: {
  "all_staff": {
    type: "fixed",
    percentage: 100,
    professionIds: ["waiter", "bartender", "host"],
    employeeDistribution: "by_hours"
  },
  "bartenders": {
    type: "category",
    categories: ["Bar", "Drinks"],
    parentId: "all_staff",
    professionIds: ["bartender"],
    employeeDistribution: "equal"
  }
}
```

**Data**:
- Total Tips: €1000 (100,000 cents)
- Bar Sales: €300 out of €1000 total = 30%
- Employees:
  - Charlie (bartender): 30 hours
  - NO waiters or hosts employed

**Expected Calculation**:

1. **Allocate**:
   ```
   all_staff: 100,000 cents
   bartenders (30% of parent): 30,000 cents
   ```

2. **Distribution**:
   ```
   bartenders distributes 30,000:
     - Charlie: 30,000 cents (€300)

   all_staff calculates remainder:
     - Allocated: 100,000 cents
     - Children took: 30,000 cents
     - Remainder: 70,000 cents
     - Remaining professions: [waiter, host]
     - Employees matching [waiter, host]: NONE!
     - SKIPS distribution (no employees)
   ```

3. **Final Amounts**:
   ```
   Charlie (bartender): €300
   TOTAL:               €300 (€700 unassigned)
   ```

4. **Warning**:
   ```
   "All Staff has €700.00 remainder after children.
    No employees found for professions: waiter, host"
   ```

---

## Verification Checklist

### ✅ Fix Verification

- [ ] Parent groups with children distribute ONLY remainder (not full allocation)
- [ ] Remainder = parent.allocatedAmount - sum(children.allocatedAmount)
- [ ] Parent excludes professions that are in children from remainder distribution
- [ ] Children still distribute their allocated amounts correctly
- [ ] Positive remainder with matching employees → distributes successfully
- [ ] Positive remainder without matching employees → warning shown
- [ ] Negative remainder (children over-allocate) → error shown
- [ ] Zero remainder → no warning (perfect coverage)
- [ ] Leaf groups without employees → separate warning
- [ ] Parent groups are NOT in "groups with no matching employees" warning
- [ ] Total distributed + unassigned = total tips (no over-distribution)

### 🔍 Edge Cases to Test

- [ ] Parent with no children and no professionIds (should skip)
- [ ] Parent with no children but has professionIds (should distribute normally)
- [ ] Child with no matching employees (should show warning)
- [ ] Category child with no sales in categories (should show warning)
- [ ] Multiple levels of nesting (grandparent → parent → child)
- [ ] Parent with 100% children coverage (no remainder)
- [ ] Parent with partial children coverage (remainder exists)
- [ ] Parent with children over-allocating (error condition)

---

## Manual Testing Steps

1. **Setup Test Business**:
   - Create business with Scenario 1 configuration
   - Assign employees as specified
   - Add punches for specified hours

2. **Run Tips Calculation**:
   - Select date range with data
   - Run calculation
   - Check results

3. **Verify Results**:
   - Check employee distribution matches expected amounts
   - Verify warnings match expected messages
   - Confirm no over-distribution errors
   - Check total distributed + unassigned = total tips

4. **Test UI Configuration**:
   - Create parent group with professionIds
   - Add child groups
   - Verify UI shows appropriate warnings/guidance
   - Test preview calculation shows correct amounts

---

## Expected Behavior Summary

### Before Fix
- ❌ Parent distributed FULL allocation to professionIds even with children → OVER-DISTRIBUTION
- ❌ Children ALSO distributed their allocation → DOUBLE DISTRIBUTION
- ❌ Warning said "only children receive tips" but was FALSE
- ❌ No visibility into remainder amounts
- ❌ Total distributed > total tips (ERROR!)

### After Fix
- ✅ Parent distributes ONLY REMAINDER (parent allocation - children allocation)
- ✅ Parent excludes professions already in children from remainder
- ✅ Clear warnings about remainder with specific professions
- ✅ Warnings show if remainder couldn't be distributed (no employees)
- ✅ Separate warnings for different unassignment scenarios
- ✅ Error when children over-allocate beyond parent
- ✅ Total distributed = total tips (CORRECT!)
