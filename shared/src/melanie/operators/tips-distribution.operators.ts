/**
 * Tips Distribution Operators
 *
 * RxJS operators for calculating tips distribution using discriminated union types
 * and integer arithmetic (cents) for precision.
 *
 * Pipeline phases:
 * 1. Transform configuration with sales data to get allocated amounts
 * 2. Distribute allocated amounts to employees based on hours/equal method
 * 3. Validate and finalize the distribution
 */

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import type {
  TipsGroup,
  FixedPercentageGroup,
  CategoryBasedGroup
} from '../types/business.types';
import type { RestaurantTips } from '../types/tips.types';


/**
 * Phase 1: Transform configuration with sales data to get allocated amounts
 */
export function transformTipsConfiguration(
  groups: Record<string, TipsGroup>,
  sales: { totalTips: number; categoryBreakdown: Record<string, number> }
): Array<{
  id: string;
  name: string;
  type: 'fixed' | 'category';
  parentId?: string;
  employeeDistribution: 'by_hours' | 'equal';
  professionIds: string[];
  allocatedAmount: number;
  percentage?: number;
  categoryPercentage?: number;
  fallbackGroupId?: string;
}> {
  const groupsArray = Object.entries(groups).map(([id, group]) => ({ ...group, id }));

  // Pre-calculate fixed group allocations to avoid rounding errors
  const fixedAllocations = new Map<string, number>();
  const rootFixed = groupsArray.filter(g => g.type === 'fixed' && !g.parentId);
  let distributed = 0;

  rootFixed.forEach((g, i) => {
    const fg = g as FixedPercentageGroup;
    const amt = i === rootFixed.length - 1
      ? sales.totalTips - distributed  // Last gets remainder
      : Math.round((fg.percentage / 100) * sales.totalTips);
    fixedAllocations.set(g.id, amt);
    distributed += amt;
  });

  return groupsArray.map(group => {
    if (group.type === 'fixed') {
      // Fixed percentage group - use pre-calculated or calculate
      const fixedGroup = group as FixedPercentageGroup;
      const allocatedAmount = fixedAllocations.get(group.id) ?? Math.round((fixedGroup.percentage / 100) * sales.totalTips);
      return {
        id: group.id,
        name: group.name,
        type: 'fixed' as const,
        parentId: group.parentId,
        employeeDistribution: group.employeeDistribution,
        professionIds: group.professionIds,
        allocatedAmount,
        percentage: fixedGroup.percentage,
        fallbackGroupId: group.fallbackGroupId
      };
    } else {
      // Category-based group - calculate from sales
      const categoryGroup = group as CategoryBasedGroup;

      // Calculate total sales for this group's categories
      const categoryTotal = categoryGroup.categories.reduce(
        (sum, category) => sum + (sales.categoryBreakdown[category] || 0),
        0
      );

      let allocatedAmount = 0;
      let categoryPercentage = 0;

      if (categoryGroup.parentId) {
        // Child group - get percentage of parent's allocation
        const parent = groupsArray.find(g => g.id === categoryGroup.parentId);

        if (parent && parent.type === 'fixed') {
          // Use pre-calculated parent amount to ensure consistency
          const parentAmount = fixedAllocations.get(parent.id) ?? Math.round(((parent as FixedPercentageGroup).percentage / 100) * sales.totalTips);

          // Calculate total sales for all siblings under the same parent
          const siblings = groupsArray.filter(g => g.parentId === categoryGroup.parentId);
          const totalParentCategories = siblings.reduce((sum, sibling) => {
            if (sibling.type === 'category') {
              const siblingCategoryGroup = sibling as CategoryBasedGroup;
              return sum + siblingCategoryGroup.categories.reduce(
                (catSum, cat) => catSum + (sales.categoryBreakdown[cat] || 0),
                0
              );
            }
            return sum;
          }, 0);

          if (totalParentCategories > 0) {
            categoryPercentage = (categoryTotal / totalParentCategories) * 100;
            allocatedAmount = Math.round((categoryPercentage / 100) * parentAmount);
          }
        }
      } else {
        // Root category group - calculate from total tips
        const totalSales = Object.values(sales.categoryBreakdown).reduce((a, b) => a + b, 0);
        if (totalSales > 0) {
          categoryPercentage = (categoryTotal / totalSales) * 100;
          allocatedAmount = Math.round((categoryPercentage / 100) * sales.totalTips);
        }
      }

      return {
        id: group.id,
        name: group.name,
        type: 'category' as const,
        parentId: group.parentId,
        employeeDistribution: group.employeeDistribution,
        professionIds: group.professionIds,
        allocatedAmount,
        categoryPercentage: Math.round(categoryPercentage * 100) / 100, // 2 decimal places
        fallbackGroupId: group.fallbackGroupId
      };
    }
  });
}

/**
 * Phase 1.5: Apply fallback redistribution for groups with no employees
 */
export function applyFallbackRedistribution(
  transformedGroups: Array<{
    id: string;
    name: string;
    type: 'fixed' | 'category';
    parentId?: string;
    employeeDistribution: 'by_hours' | 'equal';
    professionIds: string[];
    allocatedAmount: number;
    percentage?: number;
    categoryPercentage?: number;
    fallbackGroupId?: string;
  }>,
  employees: Array<{
    id: string;
    name: string;
    professionId: string;
    hoursWorked: number;
    excludedFromTips?: boolean;
  }>
): {
  adjustedGroups: typeof transformedGroups;
  redistributions: Array<{ fromGroup: string; toGroup: string; amount: number }>;
} {
  const redistributions: Array<{ fromGroup: string; toGroup: string; amount: number }> = [];
  const adjustments = new Map<string, number>();

  // Check each group for employees
  for (const group of transformedGroups) {
    if (group.allocatedAmount <= 0) continue;

    // Calculate professions to check (considering parent/child relationships)
    const children = transformedGroups.filter(g => g.parentId === group.id);
    let professionIdsToCheck = group.professionIds;

    if (children.length > 0) {
      // Parent with children - check only remainder professions
      const childProfessionIds = new Set(children.flatMap(c => c.professionIds));
      professionIdsToCheck = group.professionIds.filter(profId => !childProfessionIds.has(profId));
    }

    // Check if group has matching employees
    const hasEmployees = employees.some(emp =>
      !emp.excludedFromTips && professionIdsToCheck.includes(emp.professionId)
    );

    if (!hasEmployees && group.fallbackGroupId) {
      // Calculate amount to redistribute
      let amountToRedistribute = group.allocatedAmount;

      if (children.length > 0) {
        // Parent with children - only redistribute remainder
        const childrenAllocated = children.reduce((sum, child) => sum + child.allocatedAmount, 0);
        amountToRedistribute = group.allocatedAmount - childrenAllocated;
      }

      if (amountToRedistribute > 0) {
        // Zero out this group's allocation
        adjustments.set(group.id, -amountToRedistribute);

        // Add to fallback group
        adjustments.set(
          group.fallbackGroupId,
          (adjustments.get(group.fallbackGroupId) || 0) + amountToRedistribute
        );

        // Track for reporting
        const fallbackGroup = transformedGroups.find(g => g.id === group.fallbackGroupId);
        if (fallbackGroup) {
          redistributions.push({
            fromGroup: group.name,
            toGroup: fallbackGroup.name,
            amount: amountToRedistribute
          });
        }
      }
    }
  }

  // Apply adjustments
  const adjustedGroups = transformedGroups.map(g => ({
    ...g,
    allocatedAmount: g.allocatedAmount + (adjustments.get(g.id) || 0)
  }));

  return { adjustedGroups, redistributions };
}

/**
 * Phase 2: Distribute allocated amounts to employees based on hours/equal method
 */
export function distributeToEmployees(
  groups: Array<{
    id: string;
    name: string;
    type: 'fixed' | 'category';
    parentId?: string;
    employeeDistribution: 'by_hours' | 'equal';
    professionIds: string[];
    allocatedAmount: number;
    percentage?: number;
    categoryPercentage?: number;
  }>,
  employees: Array<{
    id: string;
    name: string;
    professionId: string;
    hoursWorked: number;
    excludedFromTips?: boolean;
  }>
): Array<RestaurantTips['employeeDistribution'][0] & {
  groupId: string;
  groupName: string;
  professionId: string;
}> {
  const distributions: Array<RestaurantTips['employeeDistribution'][0] & {
    groupId: string;
    groupName: string;
    professionId: string;
  }> = [];

  // Process each group
  for (const group of groups) {
    // Skip parent groups with empty professionIds array
    if (group.professionIds.length === 0) {
      continue;
    }

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

    // Filter employees for this group
    const groupEmployees = employees.filter(emp =>
      !emp.excludedFromTips &&
      professionIdsToUse.includes(emp.professionId)
    );

    if (groupEmployees.length === 0) {
      continue;
    }

    if (group.employeeDistribution === 'by_hours') {
      // Calculate distribution based on hours worked
      const totalHours = groupEmployees.reduce((sum, emp) => sum + emp.hoursWorked, 0);

      if (totalHours === 0) {
        // Edge case: all employees have 0 hours, fall back to equal distribution
        const equalAmount = Math.floor(amountToDistribute / groupEmployees.length);
        let remainder = amountToDistribute - (equalAmount * groupEmployees.length);

        groupEmployees.forEach((employee, index) => {
          distributions.push({
            employeeId: employee.id,
            employeeCode: employee.id, // Using id as code for compatibility
            name: employee.name,
            hoursWorked: employee.hoursWorked,
            tipAmount: equalAmount + (index < remainder ? 1 : 0), // Distribute remainder
            group: group.name,
            excludedFromTips: employee.excludedFromTips || false,
            groupId: group.id,
            groupName: group.name,
            professionId: employee.professionId
          });
        });
      } else {
        // Normal case: distribute by hours
        let distributedTotal = 0;
        groupEmployees.forEach((employee, index) => {
          let tipAmount: number;
          if (index === groupEmployees.length - 1) {
            // Last employee gets the remainder to ensure exact distribution
            tipAmount = amountToDistribute - distributedTotal;
          } else {
            tipAmount = Math.round((employee.hoursWorked / totalHours) * amountToDistribute);
            distributedTotal += tipAmount;
          }

          distributions.push({
            employeeId: employee.id,
            employeeCode: employee.id, // Using id as code for compatibility
            name: employee.name,
            hoursWorked: employee.hoursWorked,
            tipAmount,
            group: group.name,
            excludedFromTips: employee.excludedFromTips || false,
            groupId: group.id,
            groupName: group.name,
            professionId: employee.professionId
          });
        });
      }
    } else {
      // Equal distribution
      const equalAmount = Math.floor(amountToDistribute / groupEmployees.length);
      let remainder = amountToDistribute - (equalAmount * groupEmployees.length);

      groupEmployees.forEach((employee, index) => {
        distributions.push({
          employeeId: employee.id,
          employeeCode: employee.id, // Using id as code for compatibility
          name: employee.name,
          hoursWorked: employee.hoursWorked,
          tipAmount: equalAmount + (index < remainder ? 1 : 0), // Distribute remainder
          group: group.name,
          excludedFromTips: employee.excludedFromTips || false,
          groupId: group.id,
          groupName: group.name,
          professionId: employee.professionId
        });
      });
    }
  }

  return distributions;
}

/**
 * Phase 3: Validate the final distribution and handle edge cases
 */
export function validateAndFinalize(
  distributions: Array<RestaurantTips['employeeDistribution'][0] & {
    groupId: string;
    groupName: string;
    professionId: string;
  }>,
  groups: Array<{
    id: string;
    name: string;
    type: 'fixed' | 'category';
    parentId?: string;
    employeeDistribution: 'by_hours' | 'equal';
    professionIds: string[];
    allocatedAmount: number;
    percentage?: number;
    categoryPercentage?: number;
  }>,
  originalTotal: number,
  redistributions: Array<{ fromGroup: string; toGroup: string; amount: number }> = []
): {
  distributions: Array<RestaurantTips['employeeDistribution'][0] & {
    groupId: string;
    groupName: string;
    professionId: string;
  }>;
  summary: {
    totalTips: number;
    distributedTotal: number;
    unassignedAmount: number;
    distributionPercentage: number;
  };
  groupSummaries?: Array<{
    groupId: string;
    groupName: string;
    allocatedAmount: number;
    employeeCount: number;
    distributedAmount: number;
  }>;
  warnings: string[];
  errors: string[];
} {
  const distributedTotal = distributions.reduce((sum, dist) => sum + dist.tipAmount, 0);
  const unassignedAmount = originalTotal - distributedTotal;
  const warnings: string[] = [];
  const errors: string[] = [];

  // Add redistribution info to warnings
  redistributions.forEach(({ fromGroup, toGroup, amount }) => {
    const amountEuros = (amount / 100).toFixed(2);
    warnings.push(`${fromGroup} (no employees): €${amountEuros} redistributed to ${toGroup}`);
  });

  // Check for unassigned tips
  if (unassignedAmount > 0) {
    const unassignedEuros = (unassignedAmount / 100).toFixed(2);

    // Check which groups couldn't distribute their allocation
    const groupSummaries = groups.map(group => {
      const groupDistributions = distributions.filter(d => d.groupId === group.id);
      const distributedAmount = groupDistributions.reduce((sum, d) => sum + d.tipAmount, 0);
      return {
        groupId: group.id,
        groupName: group.name,
        allocatedAmount: group.allocatedAmount,
        employeeCount: groupDistributions.length,
        distributedAmount
      };
    });

    const undistributedGroups = groupSummaries.filter(g =>
      g.allocatedAmount > 0 && g.distributedAmount === 0
    );

    if (undistributedGroups.length > 0) {
      // Separate parent groups (with children) from leaf groups (without children)
      const parentUndistributed = undistributedGroups.filter(g =>
        groups.some(child => child.parentId === g.groupId)
      );
      const leafUndistributed = undistributedGroups.filter(g =>
        !groups.some(child => child.parentId === g.groupId)
      );

      // Only warn about leaf groups that couldn't distribute
      // Parent groups are handled by the remainder warning above
      if (leafUndistributed.length > 0) {
        warnings.push(
          `€${unassignedEuros} unassigned. Groups with no matching employees: ${
            leafUndistributed.map(g => `${g.groupName} (€${(g.allocatedAmount / 100).toFixed(2)})`).join(', ')
          }`
        );
      }
    } else if (unassignedAmount > 0) {
      // Small amount unassigned, likely due to rounding
      warnings.push(`€${unassignedEuros} unassigned due to rounding`);
    }
  }

  // Check for over-distribution (should not happen with integer math)
  if (unassignedAmount < 0) {
    errors.push(`Over-distributed tips by €${Math.abs(unassignedAmount / 100).toFixed(2)}`);
  }

  // Validate individual distributions
  distributions.forEach(dist => {
    if (dist.tipAmount < 0) {
      errors.push(`Negative tip amount for ${dist.name}: €${(dist.tipAmount / 100).toFixed(2)}`);
    }
  });

  // Check for parent groups with children and provide remainder info
  groups.forEach(parent => {
    const children = groups.filter(g => g.parentId === parent.id);

    if (children.length > 0 && parent.allocatedAmount > 0) {
      // Calculate how much children took from parent's allocation
      const childrenAllocated = children.reduce((sum, child) => sum + child.allocatedAmount, 0);
      const remainder = parent.allocatedAmount - childrenAllocated;

      // Find professions in parent but not in any child
      const childProfessionIds = new Set(
        children.flatMap(c => c.professionIds)
      );
      const remainingProfessions = parent.professionIds.filter(
        profId => !childProfessionIds.has(profId)
      );

      if (remainder > 0) {
        const remainderEuros = (remainder / 100).toFixed(2);

        // Check if remainder was distributed
        const parentDistributions = distributions.filter(d =>
          d.groupId === parent.id && remainingProfessions.includes(d.professionId)
        );
        const parentDistributedAmount = parentDistributions.reduce((sum, d) => sum + d.tipAmount, 0);

        if (parentDistributedAmount === 0 && remainingProfessions.length > 0) {
          // Remainder exists but wasn't distributed (no matching employees)
          warnings.push(
            `${parent.name} has €${remainderEuros} remainder after children. ` +
            `No employees found for professions: ${remainingProfessions.join(', ')}`
          );
        } else if (parentDistributedAmount > 0 && parentDistributedAmount < remainder) {
          // Partial distribution
          const undistributed = (remainder - parentDistributedAmount) / 100;
          warnings.push(
            `${parent.name} has €${undistributed.toFixed(2)} unallocated from €${remainderEuros} remainder. ` +
            `Some employees in remainder professions (${remainingProfessions.join(', ')}) may not have worked.`
          );
        }
      } else if (remainder < 0) {
        // Children allocated more than parent - this is an error in configuration
        const overageEuros = (Math.abs(remainder) / 100).toFixed(2);
        errors.push(
          `${parent.name} children allocate €${overageEuros} more than parent's total. ` +
          `Parent: €${(parent.allocatedAmount / 100).toFixed(2)}, Children total: €${(childrenAllocated / 100).toFixed(2)}`
        );
      }
      // If remainder === 0 or fully distributed, no warning needed
    }
  });

  // Check for category groups with no sales
  groups.forEach(group => {
    if (group.type === 'category' && group.allocatedAmount === 0) {
      const categoryGroup = group as typeof group & { categoryPercentage?: number };
      if (categoryGroup.categoryPercentage === 0 || categoryGroup.categoryPercentage === undefined) {
        warnings.push(`${group.name} has no sales in its categories and receives no tips`);
      }
    }
  });

  // Calculate group summaries for output
  const groupSummaries = groups.map(group => {
    const groupDistributions = distributions.filter(d => d.groupId === group.id);
    return {
      groupId: group.id,
      groupName: group.name,
      allocatedAmount: group.allocatedAmount,
      employeeCount: groupDistributions.length,
      distributedAmount: groupDistributions.reduce((sum, d) => sum + d.tipAmount, 0)
    };
  });

  return {
    distributions,
    summary: {
      totalTips: originalTotal,
      distributedTotal,
      unassignedAmount,
      distributionPercentage: Math.round((distributedTotal / originalTotal) * 10000) / 100 // 2 decimal places
    },
    groupSummaries,
    warnings,
    errors
  };
}

/**
 * Main RxJS pipeline combining all operators
 */
export function calculateTipsDistribution(
  config: { groups: Record<string, TipsGroup> },
  sales: { totalTips: number; categoryBreakdown: Record<string, number> },
  employees: Array<{
    id: string;
    name: string;
    professionId: string;
    hoursWorked: number;
    excludedFromTips?: boolean;
  }>
): Observable<{
  distributions: Array<RestaurantTips['employeeDistribution'][0] & {
    groupId: string;
    groupName: string;
    professionId: string;
  }>;
  summary: {
    totalTips: number;
    distributedTotal: number;
    unassignedAmount: number;
    distributionPercentage: number;
  };
  groupSummaries?: Array<{
    groupId: string;
    groupName: string;
    allocatedAmount: number;
    employeeCount: number;
    distributedAmount: number;
  }>;
  warnings: string[];
  errors: string[];
}> {
  return of({ config, sales, employees }).pipe(
    // Phase 1: Transform configuration
    map(({ config, sales, employees }) => ({
      transformedGroups: transformTipsConfiguration(config.groups, sales),
      sales,
      employees
    })),

    // Phase 1.5: Apply fallback redistribution
    map(({ transformedGroups, sales, employees }) => {
      const { adjustedGroups, redistributions } = applyFallbackRedistribution(transformedGroups, employees);
      return {
        transformedGroups: adjustedGroups,
        redistributions,
        sales,
        employees
      };
    }),

    // Phase 2: Distribute to employees
    map(({ transformedGroups, redistributions, sales, employees }) => ({
      distributions: distributeToEmployees(transformedGroups, employees),
      transformedGroups,
      redistributions,
      originalTotal: sales.totalTips
    })),

    // Phase 3: Validate and finalize
    map(({ distributions, transformedGroups, redistributions, originalTotal }) =>
      validateAndFinalize(distributions, transformedGroups, originalTotal, redistributions)
    ),

    // Handle errors
    catchError(error => {
      console.error('Tips distribution calculation failed:', error);
      return of({
        distributions: [],
        summary: {
          totalTips: 0,
          distributedTotal: 0,
          unassignedAmount: 0,
          distributionPercentage: 0
        },
        warnings: [],
        errors: [`Calculation failed: ${error.message}`]
      });
    })
  );
}
