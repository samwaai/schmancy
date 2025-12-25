# Improved Tips Distribution Design

## Problems with Current Interface

1. **The `percentage` field is overloaded**:
   - Sometimes it's a manual percentage (when distributionType = 'percentage')
   - Sometimes it should be calculated (when distributionType = 'category')
   - Having `percentage: 0` with `distributionType: 'category'` makes no sense

2. **`distributionType` is ambiguous**:
   - Does it affect how this group receives tips from its parent?
   - Or how it distributes to its children?
   - The name doesn't make this clear

3. **`categories` field has dual purposes**:
   - For parent groups: "these are all my categories"
   - For child groups: "these determine my share of parent"

4. **No type-level validation**:
   - Can't enforce children sum to 100%
   - Can't prevent 0% leaf nodes
   - Can't ensure professions are lowercase

5. **Mixed concerns**:
   - Runtime computed fields (`level`, `hasChildren`) mixed with stored data

## Improved Design: Discriminated Union Approach

### Core Type Definition

```typescript
// Base properties shared by all groups
interface BaseTipsGroup {
  id: string;  // Readable ID like 'kitchen' or 'kitchen-pizza'
  name: string;  // Display name
  parentId?: string;  // Parent group ID for hierarchy
  employeeDistribution: 'by_hours' | 'equal';  // How to split among employees
  professions: string[];  // Lowercase normalized profession IDs
}

// Discriminated union for different allocation methods
type TipsGroup =
  | FixedPercentageGroup
  | CategoryBasedGroup;

// Group with fixed percentage allocation
interface FixedPercentageGroup extends BaseTipsGroup {
  type: 'fixed';
  percentage: number;  // Percentage of parent (or total if root)
  // No categories field - not needed for fixed percentage
}

// Group with category-based dynamic allocation
interface CategoryBasedGroup extends BaseTipsGroup {
  type: 'category';
  categories: string[];  // Revenue categories that determine this group's share
  // No percentage field - calculated dynamically from sales
}

// The complete tips distribution configuration
interface TipsDistributionConfig {
  groups: Record<string, TipsGroup>;

  // Computed validation metadata
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}
```

### Why This Design is Superior

1. **Type Safety Through Discrimination**
   ```typescript
   function calculateGroupPercentage(group: TipsGroup, sales: SalesData): number {
     switch (group.type) {
       case 'fixed':
         return group.percentage;  // TypeScript knows percentage exists

       case 'category':
         // TypeScript knows categories exists, percentage doesn't
         return calculateFromCategories(group.categories, sales);
     }
   }
   ```

2. **Impossible States Are Unrepresentable**
   ```typescript
   // ❌ IMPOSSIBLE with discriminated union
   const invalid = {
     type: 'category',
     percentage: 50,  // TypeScript error: percentage doesn't exist on CategoryBasedGroup
     categories: ['Pizza']
   };

   // ✅ VALID
   const valid: CategoryBasedGroup = {
     type: 'category',
     id: 'kitchen-pizza',
     name: 'Pizza Station',
     categories: ['Pizza'],
     employeeDistribution: 'by_hours',
     professions: ['pizzaiolo']
   };
   ```

3. **Clear Intent**
   - `type: 'fixed'` → This group gets a fixed percentage
   - `type: 'category'` → This group's percentage varies with sales

### Validation Rules by Type

#### Fixed Percentage Groups
```typescript
function validateFixedGroup(group: FixedPercentageGroup, allGroups: TipsGroup[]): string[] {
  const errors: string[] = [];

  // Rule 1: Percentage must be > 0 for leaf nodes
  const isLeaf = !allGroups.some(g => g.parentId === group.id);
  if (isLeaf && group.percentage === 0) {
    errors.push(`${group.name} is a leaf node with 0% allocation`);
  }

  // Rule 2: If has parent, check siblings sum to 100%
  if (group.parentId) {
    const siblings = allGroups.filter(g =>
      g.parentId === group.parentId && g.type === 'fixed'
    ) as FixedPercentageGroup[];

    const sum = siblings.reduce((acc, s) => acc + s.percentage, 0);
    if (Math.abs(sum - 100) > 0.01) {
      errors.push(`Children of ${group.parentId} sum to ${sum}%, not 100%`);
    }
  }

  return errors;
}
```

#### Category-Based Groups
```typescript
function validateCategoryGroup(group: CategoryBasedGroup, allGroups: TipsGroup[]): string[] {
  const errors: string[] = [];

  // Rule 1: Must have at least one category
  if (group.categories.length === 0) {
    errors.push(`${group.name} has no categories assigned`);
  }

  // Rule 2: Categories shouldn't overlap with siblings
  if (group.parentId) {
    const siblings = allGroups.filter(g =>
      g.parentId === group.parentId &&
      g.type === 'category' &&
      g.id !== group.id
    ) as CategoryBasedGroup[];

    for (const sibling of siblings) {
      const overlap = group.categories.filter(c =>
        sibling.categories.includes(c)
      );
      if (overlap.length > 0) {
        errors.push(`${group.name} and ${sibling.name} both claim categories: ${overlap.join(', ')}`);
      }
    }
  }

  return errors;
}
```

### Real-World Examples

#### Example 1: Simple Fixed Distribution
```typescript
const simpleConfig: TipsDistributionConfig = {
  groups: {
    'service': {
      type: 'fixed',
      id: 'service',
      name: 'Service Staff',
      percentage: 50,
      employeeDistribution: 'by_hours',
      professions: ['server', 'runner']
    },
    'kitchen': {
      type: 'fixed',
      id: 'kitchen',
      name: 'Kitchen Staff',
      percentage: 40,
      employeeDistribution: 'by_hours',
      professions: ['chef', 'cook']
    },
    'bar': {
      type: 'fixed',
      id: 'bar',
      name: 'Bar Staff',
      percentage: 10,
      employeeDistribution: 'equal',
      professions: ['bartender']
    }
  }
};
```

#### Example 2: Category-Based Distribution
```typescript
const categoryConfig: TipsDistributionConfig = {
  groups: {
    'service': {
      type: 'fixed',
      id: 'service',
      name: 'Service Staff',
      percentage: 50,
      employeeDistribution: 'by_hours',
      professions: ['server', 'runner']
    },
    'kitchen': {
      type: 'fixed',
      id: 'kitchen',
      name: 'Kitchen Total',
      percentage: 40,
      employeeDistribution: 'by_hours',
      professions: []  // Parent group, no direct employees
    },
    'kitchen-pizza': {
      type: 'category',
      id: 'kitchen-pizza',
      name: 'Pizza Station',
      parentId: 'kitchen',
      categories: ['Pizza'],
      employeeDistribution: 'by_hours',
      professions: ['pizzaiolo']
    },
    'kitchen-pasta': {
      type: 'category',
      id: 'kitchen-pasta',
      name: 'Pasta Station',
      parentId: 'kitchen',
      categories: ['Pasta', 'Starter & Salad'],
      employeeDistribution: 'by_hours',
      professions: ['chef']
    },
    'bar': {
      type: 'category',
      id: 'bar',
      name: 'Bar',
      categories: ['Drinks', 'Alcohol'],
      employeeDistribution: 'equal',
      professions: ['bartender']
      // No percentage - calculated from drink sales
    }
  }
};
```

### Migration from Current Structure

```typescript
function migrateToDiscriminatedUnion(
  old: Record<string, OldTipsGroup>
): TipsDistributionConfig {
  const groups: Record<string, TipsGroup> = {};

  for (const [id, oldGroup] of Object.entries(old)) {
    if (oldGroup.distributionType === 'category') {
      // Convert to CategoryBasedGroup
      groups[id] = {
        type: 'category',
        id,
        name: oldGroup.name,
        parentId: oldGroup.parentId,
        categories: oldGroup.categories || [],
        employeeDistribution: oldGroup.method,
        professions: (oldGroup.professions || []).map(p => p.toLowerCase())
      };
    } else {
      // Convert to FixedPercentageGroup
      groups[id] = {
        type: 'fixed',
        id,
        name: oldGroup.name,
        parentId: oldGroup.parentId,
        percentage: oldGroup.percentage,
        employeeDistribution: oldGroup.method,
        professions: (oldGroup.professions || []).map(p => p.toLowerCase())
      };
    }
  }

  return { groups };
}
```

### Real Migration Example: Zola Ufer Restaurant

#### Before (Current Structure)
```json
{
  "tipsDistribution": {
    "group_1758883377208": {
      "name": "Pizza",
      "professions": ["Pizzaiolo"],
      "method": "by_hours",
      "categories": ["Pizza"],
      "distributionType": "category",
      "percentage": 0,
      "parentId": "kitchen"
    },
    "dishwasher": {
      "name": "Dishwashing",
      "method": "by_hours",
      "professions": ["dishwasher"],
      "percentage": 10
    },
    "group_1758883409544": {
      "categories": ["Starter & Salad", "Pasta", "Dessert"],
      "professions": ["Chef"],
      "distributionType": "category",
      "parentId": "kitchen",
      "name": "Pasta",
      "method": "by_hours",
      "percentage": 0
    },
    "kitchen": {
      "categories": ["Pizza", "Pasta", "Starter & Salad", "Dessert"],
      "percentage": 40,
      "professions": ["chef", "pizzaiolo"],
      "name": "Kitchen Staff",
      "method": "by_hours"
    },
    "service": {
      "method": "by_hours",
      "percentage": 50,
      "name": "Service Staff",
      "professions": ["server", "runner"]
    }
  }
}
```

#### After (Discriminated Union Structure)
```json
{
  "tipsDistribution": {
    "groups": {
      "service": {
        "type": "fixed",
        "id": "service",
        "name": "Service Staff",
        "percentage": 50,
        "employeeDistribution": "by_hours",
        "professions": ["server", "runner"]
      },

      "kitchen": {
        "type": "fixed",
        "id": "kitchen",
        "name": "Kitchen Staff",
        "percentage": 40,
        "employeeDistribution": "by_hours",
        "professions": []
      },

      "kitchen-pizza": {
        "type": "category",
        "id": "kitchen-pizza",
        "name": "Pizza Station",
        "parentId": "kitchen",
        "categories": ["Pizza"],
        "employeeDistribution": "by_hours",
        "professions": ["pizzaiolo"]
      },

      "kitchen-pasta": {
        "type": "category",
        "id": "kitchen-pasta",
        "name": "Pasta Station",
        "parentId": "kitchen",
        "categories": ["Starter & Salad", "Pasta", "Dessert"],
        "employeeDistribution": "by_hours",
        "professions": ["chef"]
      },

      "dishwasher": {
        "type": "fixed",
        "id": "dishwasher",
        "name": "Dishwashing",
        "percentage": 10,
        "employeeDistribution": "by_hours",
        "professions": ["dishwasher"]
      }
    },

    "validation": {
      "isValid": true,
      "errors": [],
      "warnings": [
        "Kitchen group has employees assigned but also has children - employees will be ignored"
      ]
    }
  }
}
```

#### Migration Improvements

1. **Eliminated Confusion**:
   - Removed `percentage: 0` from category-based groups
   - Removed ambiguous `distributionType` field
   - Type discriminator makes intent crystal clear

2. **Readable IDs**:
   - `group_1758883377208` → `kitchen-pizza`
   - `group_1758883409544` → `kitchen-pasta`

3. **Type Safety**:
   - Category groups can't have percentage field
   - Fixed groups don't need categories for their allocation

4. **Clear Hierarchy**:
   - Kitchen is parent with 40% of total
   - Pizza/Pasta stations split Kitchen's 40% based on actual sales
   - Service and Dishwasher are independent root groups

5. **How Tips Flow**:
   ```
   Total Tips: €1000
   ├── Service (50%): €500 → distributed to servers/runners by hours
   ├── Kitchen (40%): €400 → split by category revenue
   │   ├── Pizza Station: % based on Pizza sales → to pizzaiolos by hours
   │   └── Pasta Station: % based on other sales → to chefs by hours
   └── Dishwasher (10%): €100 → to dishwashers by hours
   ```

### Benefits Summary

1. **Compile-time Safety**: Invalid field combinations are impossible
2. **Self-documenting**: The type tells you exactly what fields are valid
3. **Easier Testing**: Each type can be tested independently
4. **Better IntelliSense**: IDE knows exactly what fields are available
5. **Cleaner Logic**: Switch statements handle each type clearly
6. **Future-proof**: Easy to add new distribution types