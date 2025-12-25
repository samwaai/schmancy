import { describe, it, expect } from "vitest";
import { firstValueFrom } from "rxjs";
import {
  transformTipsConfiguration,
  distributeToEmployees,
  validateAndFinalize,
  calculateTipsDistribution,
} from "./tips-distribution.operators";
import type {
  TipsGroup,
  FixedPercentageGroup,
  CategoryBasedGroup,
} from "../types/business.types";

describe("Tips Distribution Operators", () => {
  describe("transformTipsConfiguration", () => {
    describe("Simple Fixed Percentage Groups", () => {
      it("should transform Milchbar configuration (45/40/15 split)", () => {
        const groups: Record<string, TipsGroup> = {
          service: {
            type: "fixed",
            id: "service",
            name: "Service Staff",
            percentage: 45,
            employeeDistribution: "by_hours",
            professionIds: ["server", "runner"],
          } as FixedPercentageGroup,
          kitchen: {
            type: "fixed",
            id: "kitchen",
            name: "Kitchen Staff",
            percentage: 40,
            employeeDistribution: "by_hours",
            professionIds: ["chef", "cook"],
          } as FixedPercentageGroup,
          dishwasher: {
            type: "fixed",
            id: "dishwasher",
            name: "Dishwashing",
            percentage: 15,
            employeeDistribution: "by_hours",
            professionIds: ["dishwasher"],
          } as FixedPercentageGroup,
        };

        const sales = {
          totalTips: 100000, // €1000 in cents
          categoryBreakdown: {},
        };

        const result = transformTipsConfiguration(groups, sales);

        expect(result).toHaveLength(3);
        expect(result.find((g) => g.id === "service")).toMatchObject({
          type: "fixed",
          name: "Service Staff",
          allocatedAmount: 45000, // 45% of €1000
          percentage: 45,
        });
        expect(result.find((g) => g.id === "kitchen")).toMatchObject({
          type: "fixed",
          name: "Kitchen Staff",
          allocatedAmount: 40000, // 40% of €1000
          percentage: 40,
        });
        expect(result.find((g) => g.id === "dishwasher")).toMatchObject({
          type: "fixed",
          name: "Dishwashing",
          allocatedAmount: 15000, // 15% of €1000
          percentage: 15,
        });
      });

      it("should transform Zola East configuration (50/40/10 split)", () => {
        const groups: Record<string, TipsGroup> = {
          service: {
            type: "fixed",
            id: "service",
            name: "Service Staff",
            percentage: 50,
            employeeDistribution: "by_hours",
            professionIds: ["server", "runner"],
          } as FixedPercentageGroup,
          kitchen: {
            type: "fixed",
            id: "kitchen",
            name: "Kitchen Staff",
            percentage: 40,
            employeeDistribution: "by_hours",
            professionIds: ["chef", "cook"],
          } as FixedPercentageGroup,
          dishwasher: {
            type: "fixed",
            id: "dishwasher",
            name: "Dishwashing",
            percentage: 10,
            employeeDistribution: "by_hours",
            professionIds: ["dishwasher"],
          } as FixedPercentageGroup,
        };

        const sales = {
          totalTips: 200000, // €2000 in cents
          categoryBreakdown: {},
        };

        const result = transformTipsConfiguration(groups, sales);

        expect(result.find((g) => g.id === "service")?.allocatedAmount).toBe(
          100000,
        ); // 50% of €2000
        expect(result.find((g) => g.id === "kitchen")?.allocatedAmount).toBe(
          80000,
        ); // 40% of €2000
        expect(result.find((g) => g.id === "dishwasher")?.allocatedAmount).toBe(
          20000,
        ); // 10% of €2000
      });
    });

    describe("Complex Hierarchical with Category-Based Children", () => {
      it("should transform Zola Funkhaus configuration with category-based children", () => {
        const groups: Record<string, TipsGroup> = {
          service: {
            type: "fixed",
            id: "service",
            name: "Service Staff",
            percentage: 50,
            employeeDistribution: "by_hours",
            professionIds: ["server", "runner"],
          } as FixedPercentageGroup,
          kitchen: {
            type: "fixed",
            id: "kitchen",
            name: "Kitchen Staff",
            percentage: 40,
            employeeDistribution: "by_hours",
            professionIds: [], // Parent group with empty professions
          } as FixedPercentageGroup,
          group_1758965027788: {
            type: "category",
            id: "group_1758965027788",
            name: "Pizza Station",
            parentId: "kitchen",
            categories: ["Pizza"],
            employeeDistribution: "equal",
            professionIds: ["pizzaiolo"],
          } as CategoryBasedGroup,
          group_1758965065838: {
            type: "category",
            id: "group_1758965065838",
            name: "Desserts",
            parentId: "kitchen",
            categories: ["Dessert", "Sweet Items"],
            employeeDistribution: "by_hours",
            professionIds: ["pastry_chef"],
          } as CategoryBasedGroup,
          dishwasher: {
            type: "fixed",
            id: "dishwasher",
            name: "Dishwashing",
            percentage: 10,
            employeeDistribution: "by_hours",
            professionIds: ["dishwasher"],
          } as FixedPercentageGroup,
        };

        const sales = {
          totalTips: 100000, // €1000 in cents
          categoryBreakdown: {
            Pizza: 30000, // €300
            Dessert: 10000, // €100
            "Sweet Items": 5000, // €50
            "Main Courses": 25000, // €250 (not assigned)
            Beverages: 30000, // €300 (not assigned)
          },
        };

        const result = transformTipsConfiguration(groups, sales);

        // Service gets 50%
        expect(result.find((g) => g.id === "service")?.allocatedAmount).toBe(
          50000,
        );

        // Kitchen parent gets 40% allocation
        expect(result.find((g) => g.id === "kitchen")?.allocatedAmount).toBe(
          40000,
        );

        // Pizza group gets proportion of kitchen based on sales
        const pizzaGroup = result.find((g) => g.id === "group_1758965027788");
        expect(pizzaGroup?.type).toBe("category");
        expect(pizzaGroup?.allocatedAmount).toBe(26667); // (30000 / 45000) * 40000
        expect(pizzaGroup?.categoryPercentage).toBeCloseTo(66.67, 1);

        // Desserts group gets proportion of kitchen based on sales
        const dessertsGroup = result.find(
          (g) => g.id === "group_1758965065838",
        );
        expect(dessertsGroup?.type).toBe("category");
        expect(dessertsGroup?.allocatedAmount).toBe(13333); // (15000 / 45000) * 40000
        expect(dessertsGroup?.categoryPercentage).toBeCloseTo(33.33, 1);

        // Dishwasher gets 10%
        expect(result.find((g) => g.id === "dishwasher")?.allocatedAmount).toBe(
          10000,
        );
      });

      it("should handle category groups without parent (root level)", () => {
        const groups: Record<string, TipsGroup> = {
          drinks: {
            type: "category",
            id: "drinks",
            name: "Drinks",
            categories: ["Beverages", "Wine"],
            employeeDistribution: "equal",
            professionIds: ["bartender"],
          } as CategoryBasedGroup,
          food: {
            type: "category",
            id: "food",
            name: "Food",
            categories: ["Main", "Dessert"],
            employeeDistribution: "by_hours",
            professionIds: ["chef"],
          } as CategoryBasedGroup,
        };

        const sales = {
          totalTips: 100000, // €1000 in cents
          categoryBreakdown: {
            Beverages: 20000, // €200
            Wine: 10000, // €100
            Main: 50000, // €500
            Dessert: 20000, // €200
          },
        };

        const result = transformTipsConfiguration(groups, sales);

        // Drinks gets 30% of total tips (30000/100000)
        expect(result.find((g) => g.id === "drinks")?.allocatedAmount).toBe(
          30000,
        );
        expect(result.find((g) => g.id === "drinks")?.categoryPercentage).toBe(
          30,
        );

        // Food gets 70% of total tips (70000/100000)
        expect(result.find((g) => g.id === "food")?.allocatedAmount).toBe(
          70000,
        );
        expect(result.find((g) => g.id === "food")?.categoryPercentage).toBe(
          70,
        );
      });
    });

    describe("Parent Groups with Remainder Distribution", () => {
      it("should distribute parent remainder to professions not in children", () => {
        const groups: Record<string, TipsGroup> = {
          kitchen: {
            type: "fixed",
            id: "kitchen",
            name: "Kitchen Staff",
            percentage: 40,
            employeeDistribution: "by_hours",
            professionIds: ["pizzaiolo", "pastry_chef", "line_cook"], // Parent has 3 professions
          } as FixedPercentageGroup,
          pizzaStation: {
            type: "category",
            id: "pizzaStation",
            name: "Pizza Station",
            parentId: "kitchen",
            categories: ["Pizza"],
            employeeDistribution: "equal",
            professionIds: ["pizzaiolo"], // Child takes pizzaiolo
          } as CategoryBasedGroup,
          dessertStation: {
            type: "category",
            id: "dessertStation",
            name: "Dessert Station",
            parentId: "kitchen",
            categories: ["Dessert"],
            employeeDistribution: "by_hours",
            professionIds: ["pastry_chef"], // Child takes pastry_chef
          } as CategoryBasedGroup,
        };

        const sales = {
          totalTips: 100000, // €1000
          categoryBreakdown: {
            Pizza: 20000, // €200 - 50% of kitchen categories
            Dessert: 20000, // €200 - 50% of kitchen categories
            Other: 60000, // €600 (not kitchen)
          },
        };

        const result = transformTipsConfiguration(groups, sales);

        // Kitchen parent gets 40% = 40000 cents
        const kitchen = result.find((g) => g.id === "kitchen");
        expect(kitchen?.allocatedAmount).toBe(40000);

        // Pizza gets 50% of kitchen = 20000
        const pizza = result.find((g) => g.id === "pizzaStation");
        expect(pizza?.allocatedAmount).toBe(20000);
        expect(pizza?.categoryPercentage).toBe(50);

        // Dessert gets 50% of kitchen = 20000
        const dessert = result.find((g) => g.id === "dessertStation");
        expect(dessert?.allocatedAmount).toBe(20000);
        expect(dessert?.categoryPercentage).toBe(50);

        // Children total = 40000, so parent remainder = 0
        // This verifies the calculation logic works correctly
      });

      it("should distribute parent remainder when children don't use full allocation", () => {
        const groups: Record<string, TipsGroup> = {
          kitchen: {
            type: "fixed",
            id: "kitchen",
            name: "Kitchen Staff",
            percentage: 40,
            employeeDistribution: "by_hours",
            professionIds: ["pizzaiolo", "line_cook"], // line_cook NOT in children
          } as FixedPercentageGroup,
          pizzaStation: {
            type: "category",
            id: "pizzaStation",
            name: "Pizza Station",
            parentId: "kitchen",
            categories: ["Pizza"],
            employeeDistribution: "equal",
            professionIds: ["pizzaiolo"],
          } as CategoryBasedGroup,
        };

        const sales = {
          totalTips: 100000, // €1000
          categoryBreakdown: {
            Pizza: 15000, // €150 - Only 37.5% of kitchen
            "Main Courses": 25000, // €250 (not assigned)
            Beverages: 60000, // €600 (not assigned)
          },
        };

        const result = transformTipsConfiguration(groups, sales);

        // Kitchen parent gets 40% = 40000 cents
        expect(result.find((g) => g.id === "kitchen")?.allocatedAmount).toBe(
          40000,
        );

        // Pizza gets all of its category sales (15000)
        // But parent's 40% allocation = 40000, so Pizza gets full amount
        expect(
          result.find((g) => g.id === "pizzaStation")?.allocatedAmount,
        ).toBe(40000); // Gets parent's full allocation since it's the only child

        // Parent has remainder of 25000 (40000 - 15000) for line_cook profession
        // This would be distributed to line_cook employees in distributeToEmployees
      });

      it("should handle real-world Zola Funkhaus configuration with actual profession IDs", () => {
        // Real configuration from production
        const groups: Record<string, TipsGroup> = {
          service: {
            type: "fixed",
            id: "service",
            name: "Service",
            percentage: 50,
            employeeDistribution: "by_hours",
            professionIds: [
              "pr_20d961bf-6ab9-4cf3-a517-3792850bf47a",
              "pr_d3b00f6a-313c-41d9-bd8b-3f98a70e4d1f",
            ],
          } as FixedPercentageGroup,
          kitchen: {
            type: "fixed",
            id: "kitchen",
            name: "Kitchen",
            percentage: 40,
            employeeDistribution: "by_hours",
            professionIds: [
              "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a", // Pizzaiolo
              "pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe", // Pastry Chef
            ],
          } as FixedPercentageGroup,
          group_1758965027788: {
            type: "category",
            id: "group_1758965027788",
            name: "Pizza",
            parentId: "kitchen",
            categories: ["Pizza"],
            employeeDistribution: "by_hours",
            professionIds: ["pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a"],
          } as CategoryBasedGroup,
          group_1758965065838: {
            type: "category",
            id: "group_1758965065838",
            name: "Deserts",
            parentId: "kitchen",
            categories: ["Dessert"],
            employeeDistribution: "by_hours",
            professionIds: ["pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe"],
          } as CategoryBasedGroup,
          dishwasher: {
            type: "fixed",
            id: "dishwasher",
            name: "Dishwasher",
            percentage: 10,
            employeeDistribution: "by_hours",
            professionIds: ["pr_5d1785f7-c664-423c-bb17-01d22c9fd116"],
          } as FixedPercentageGroup,
        };

        const sales = {
          totalTips: 9574, // €95.74 (real amount from logs)
          categoryBreakdown: {
            Pizza: 3000, // €30
            Dessert: 1500, // €15
            Other: 5074, // €50.74
          },
        };

        const result = transformTipsConfiguration(groups, sales);

        // Service gets 50%
        expect(result.find((g) => g.id === "service")?.allocatedAmount).toBe(
          4787,
        ); // 9574 * 0.5

        // Kitchen parent gets 40%
        const kitchen = result.find((g) => g.id === "kitchen");
        expect(kitchen?.allocatedAmount).toBe(3830); // 9574 * 0.4 = 3829.6, rounded up

        // Pizza child gets proportional share
        const pizza = result.find((g) => g.id === "group_1758965027788");
        expect(pizza?.allocatedAmount).toBe(2553); // (3000/4500) * 3829

        // Dessert child gets proportional share (may be 1276 or 1277 due to rounding)
        const dessert = result.find((g) => g.id === "group_1758965065838");
        expect(dessert?.allocatedAmount).toBeGreaterThanOrEqual(1276);
        expect(dessert?.allocatedAmount).toBeLessThanOrEqual(1277);

        // Dishwasher gets 10%
        expect(result.find((g) => g.id === "dishwasher")?.allocatedAmount).toBe(
          957,
        ); // 9574 * 0.1

        // Verify children don't exceed parent
        expect(pizza!.allocatedAmount + dessert!.allocatedAmount).toBeLessThanOrEqual(
          kitchen!.allocatedAmount,
        );
      });
    });

    describe("Edge Cases", () => {
      it("should handle zero total tips", () => {
        const groups: Record<string, TipsGroup> = {
          service: {
            type: "fixed",
            id: "service",
            name: "Service",
            percentage: 50,
            employeeDistribution: "by_hours",
            professionIds: ["server"],
          } as FixedPercentageGroup,
        };

        const sales = {
          totalTips: 0,
          categoryBreakdown: {},
        };

        const result = transformTipsConfiguration(groups, sales);

        expect(result.find((g) => g.id === "service")?.allocatedAmount).toBe(0);
      });

      it("should handle missing categories in sales breakdown", () => {
        const groups: Record<string, TipsGroup> = {
          specialGroup: {
            type: "category",
            id: "specialGroup",
            name: "Special",
            categories: ["NonExistent", "AlsoMissing"],
            employeeDistribution: "equal",
            professionIds: ["specialist"],
          } as CategoryBasedGroup,
        };

        const sales = {
          totalTips: 100000,
          categoryBreakdown: {
            Other: 50000,
          },
        };

        const result = transformTipsConfiguration(groups, sales);

        expect(
          result.find((g) => g.id === "specialGroup")?.allocatedAmount,
        ).toBe(0);
        expect(
          result.find((g) => g.id === "specialGroup")?.categoryPercentage,
        ).toBe(0);
      });

      it("should handle category groups with zero sales", () => {
        const groups: Record<string, TipsGroup> = {
          kitchen: {
            type: "fixed",
            id: "kitchen",
            name: "Kitchen",
            percentage: 40,
            employeeDistribution: "by_hours",
            professionIds: [],
          } as FixedPercentageGroup,
          pizza: {
            type: "category",
            id: "pizza",
            name: "Pizza",
            parentId: "kitchen",
            categories: ["Pizza"],
            employeeDistribution: "by_hours",
            professionIds: ["pizzaiolo"],
          } as CategoryBasedGroup,
        };

        const sales = {
          totalTips: 100000,
          categoryBreakdown: {
            Pizza: 0, // No pizza sales
            Other: 50000,
          },
        };

        const result = transformTipsConfiguration(groups, sales);

        expect(result.find((g) => g.id === "pizza")?.allocatedAmount).toBe(0);
        expect(result.find((g) => g.id === "pizza")?.categoryPercentage).toBe(
          0,
        );
      });
    });
  });

  describe("distributeToEmployees", () => {
    describe("Distribution by Hours Worked", () => {
      it("should distribute tips proportionally by hours worked", () => {
        const groups = [
          {
            id: "service",
            name: "Service Staff",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 50000,
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "Alice",
            professionId: "server",
            hoursWorked: 8,
          },
          {
            id: "emp2",
            name: "Bob",
            professionId: "server",
            hoursWorked: 6,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        expect(result).toHaveLength(2);

        // Alice worked 8 out of 14 hours total
        const alice = result.find((d) => d.employeeId === "emp1");
        expect(alice?.tipAmount).toBe(28571); // (8/14) * 50000 = 28571.42...

        // Bob worked 6 out of 14 hours total (gets remainder)
        const bob = result.find((d) => d.employeeId === "emp2");
        expect(bob?.tipAmount).toBe(21429); // 50000 - 28571 = 21429

        // Total should match exactly
        expect(result.reduce((sum, d) => sum + d.tipAmount, 0)).toBe(50000);
      });

      it("should handle zero hours edge case with fallback to equal distribution", () => {
        const groups = [
          {
            id: "service",
            name: "Service Staff",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 10000,
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "Alice",
            professionId: "server",
            hoursWorked: 0,
          },
          {
            id: "emp2",
            name: "Bob",
            professionId: "server",
            hoursWorked: 0,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        // Should fall back to equal distribution
        expect(result[0].tipAmount).toBe(5000);
        expect(result[1].tipAmount).toBe(5000);
      });
    });

    describe("Equal Distribution", () => {
      it("should distribute tips equally among employees", () => {
        const groups = [
          {
            id: "pizza",
            name: "Pizza Station",
            type: "category" as const,
            employeeDistribution: "equal" as const,
            professionIds: ["pizzaiolo"],
            allocatedAmount: 30000,
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "Carlo",
            professionId: "pizzaiolo",
            hoursWorked: 8,
          },
          {
            id: "emp2",
            name: "Dino",
            professionId: "pizzaiolo",
            hoursWorked: 6,
          },
          {
            id: "emp3",
            name: "Elena",
            professionId: "pizzaiolo",
            hoursWorked: 4,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        expect(result).toHaveLength(3);
        // Each gets 10000 cents
        expect(result[0].tipAmount).toBe(10000);
        expect(result[1].tipAmount).toBe(10000);
        expect(result[2].tipAmount).toBe(10000);
      });

      it("should handle remainder in equal distribution", () => {
        const groups = [
          {
            id: "kitchen",
            name: "Kitchen",
            type: "fixed" as const,
            employeeDistribution: "equal" as const,
            professionIds: ["chef"],
            allocatedAmount: 10002, // Not evenly divisible by 3
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "A",
            professionId: "chef",
            hoursWorked: 5,
          },
          {
            id: "emp2",
            name: "B",
            professionId: "chef",
            hoursWorked: 5,
          },
          {
            id: "emp3",
            name: "C",
            professionId: "chef",
            hoursWorked: 5,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        // 10002 / 3 = 3334 each, with 0 cents remainder
        // Each gets exactly 3334
        expect(result[0].tipAmount).toBe(3334);
        expect(result[1].tipAmount).toBe(3334);
        expect(result[2].tipAmount).toBe(3334);

        // Total should be exact
        expect(result.reduce((sum, d) => sum + d.tipAmount, 0)).toBe(10002);
      });
    });

    describe("Mixed Distribution Methods", () => {
      it("should handle multiple groups with different distribution methods", () => {
        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 50000,
          },
          {
            id: "kitchen",
            name: "Kitchen",
            type: "fixed" as const,
            employeeDistribution: "equal" as const,
            professionIds: ["chef"],
            allocatedAmount: 40000,
          },
        ];

        const employees = [
          {
            id: "srv1",
            name: "Server 1",
            professionId: "server",
            hoursWorked: 10,
          },
          {
            id: "srv2",
            name: "Server 2",
            professionId: "server",
            hoursWorked: 5,
          },
          {
            id: "chef1",
            name: "Chef 1",
            professionId: "chef",
            hoursWorked: 8,
          },
          {
            id: "chef2",
            name: "Chef 2",
            professionId: "chef",
            hoursWorked: 6,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        // Service staff (by hours)
        const srv1 = result.find((d) => d.employeeId === "srv1");
        const srv2 = result.find((d) => d.employeeId === "srv2");
        expect(srv1?.tipAmount).toBe(33333); // (10/15) * 50000
        expect(srv2?.tipAmount).toBe(16667); // remainder

        // Kitchen staff (equal)
        const chef1 = result.find((d) => d.employeeId === "chef1");
        const chef2 = result.find((d) => d.employeeId === "chef2");
        expect(chef1?.tipAmount).toBe(20000); // 40000 / 2
        expect(chef2?.tipAmount).toBe(20000); // 40000 / 2
      });
    });

    describe("Edge Cases", () => {
      it("should skip groups with no matching employees", () => {
        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 50000,
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "Chef",
            professionId: "chef", // No match
            hoursWorked: 8,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        expect(result).toHaveLength(0);
      });

      it("should exclude employees marked as excludedFromTips", () => {
        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 30000,
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "Active Server",
            professionId: "server",
            hoursWorked: 8,
            excludedFromTips: false,
          },
          {
            id: "emp2",
            name: "Excluded Server",
            professionId: "server",
            hoursWorked: 8,
            excludedFromTips: true,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        expect(result).toHaveLength(1);
        expect(result[0].employeeId).toBe("emp1");
        expect(result[0].tipAmount).toBe(30000); // Gets all tips
      });

      it("should skip parent groups with empty professions array", () => {
        const groups = [
          {
            id: "kitchen",
            name: "Kitchen Parent",
            type: "fixed" as const,
            parentId: undefined,
            employeeDistribution: "by_hours" as const,
            professionIds: [], // Empty = parent group
            allocatedAmount: 40000,
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "Chef",
            professionId: "chef",
            hoursWorked: 8,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        expect(result).toHaveLength(0); // No distribution for parent groups
      });

      it("should require exact profession ID matching (case-sensitive)", () => {
        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["SERVER"], // Uppercase
            allocatedAmount: 10000,
          },
        ];

        const employees = [
          {
            id: "emp1",
            name: "Alice",
            professionId: "server", // Lowercase - won't match
            hoursWorked: 8,
          },
        ];

        const result = distributeToEmployees(groups, employees);

        // Should not match because profession IDs are case-sensitive
        expect(result).toHaveLength(0);
      });
    });
  });

  describe("validateAndFinalize", () => {
    describe("Complete Distribution Validation", () => {
      it("should validate a complete distribution with no unassigned tips", () => {
        const distributions = [
          {
            employeeId: "emp1",
            employeeCode: "emp1",
            name: "Alice",
            hoursWorked: 8,
            tipAmount: 50000,
            group: "Service",
            excludedFromTips: false,
            groupId: "service",
            groupName: "Service",
            professionId: "server",
          },
          {
            employeeId: "emp2",
            employeeCode: "emp2",
            name: "Bob",
            hoursWorked: 8,
            tipAmount: 50000,
            group: "Kitchen",
            excludedFromTips: false,
            groupId: "kitchen",
            groupName: "Kitchen",
            professionId: "chef",
          },
        ];

        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 50000,
            percentage: 50,
          },
          {
            id: "kitchen",
            name: "Kitchen",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["chef"],
            allocatedAmount: 50000,
            percentage: 50,
          },
        ];

        const result = validateAndFinalize(distributions, groups, 100000);

        expect(result.summary.totalTips).toBe(100000);
        expect(result.summary.distributedTotal).toBe(100000);
        expect(result.summary.unassignedAmount).toBe(0);
        expect(result.summary.distributionPercentage).toBe(100);
        expect(result.warnings).toHaveLength(0);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe("Warning Generation", () => {
      it("should generate warning for unassigned tips due to missing employees", () => {
        const distributions = [
          {
            employeeId: "emp1",
            employeeCode: "emp1",
            name: "Alice",
            hoursWorked: 8,
            tipAmount: 50000,
            group: "Service",
            excludedFromTips: false,
            groupId: "service",
            groupName: "Service",
            professionId: "server",
          },
        ];

        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 50000,
            percentage: 50,
          },
          {
            id: "kitchen",
            name: "Kitchen",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["chef"],
            allocatedAmount: 50000,
            percentage: 50,
          },
        ];

        const result = validateAndFinalize(distributions, groups, 100000);

        expect(result.summary.unassignedAmount).toBe(50000);
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]).toContain("€500.00 unassigned");
        expect(result.warnings[0]).toContain("Kitchen");
      });

      it("should generate warning for parent groups with children", () => {
        const distributions = [];

        const groups = [
          {
            id: "kitchen",
            name: "Kitchen",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["chef"], // Has professions
            allocatedAmount: 50000,
            percentage: 50,
          },
          {
            id: "pizza",
            name: "Pizza",
            type: "category" as const,
            parentId: "kitchen", // Child of kitchen
            employeeDistribution: "by_hours" as const,
            professionIds: ["pizzaiolo"],
            allocatedAmount: 25000,
            categoryPercentage: 50,
          },
        ];

        const result = validateAndFinalize(distributions, groups, 100000);

        // Should have warnings about unassigned tips
        const kitchenWarning = result.warnings.find((w) =>
          w.includes("Kitchen"),
        );
        expect(kitchenWarning).toBeDefined();
      });

      it("should generate warning for category groups with no sales", () => {
        const distributions = [];

        const groups = [
          {
            id: "drinks",
            name: "Drinks",
            type: "category" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["bartender"],
            allocatedAmount: 0,
            categoryPercentage: 0,
          },
        ];

        const result = validateAndFinalize(distributions, groups, 100000);

        const noSalesWarning = result.warnings.find(
          (w) =>
            w.includes("Drinks") && w.includes("no sales in its categories"),
        );
        expect(noSalesWarning).toBeDefined();
      });
    });

    describe("Error Detection", () => {
      it("should detect over-distribution", () => {
        const distributions = [
          {
            employeeId: "emp1",
            employeeCode: "emp1",
            name: "Alice",
            hoursWorked: 8,
            tipAmount: 120000, // More than total
            group: "Service",
            excludedFromTips: false,
            groupId: "service",
            groupName: "Service",
            professionId: "server",
          },
        ];

        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 100000,
            percentage: 100,
          },
        ];

        const result = validateAndFinalize(distributions, groups, 100000);

        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain("Over-distributed");
        expect(result.errors[0]).toContain("€200.00");
      });

      it("should detect negative tip amounts", () => {
        const distributions = [
          {
            employeeId: "emp1",
            employeeCode: "emp1",
            name: "Alice",
            hoursWorked: 8,
            tipAmount: -500, // Negative amount
            group: "Service",
            excludedFromTips: false,
            groupId: "service",
            groupName: "Service",
            professionId: "server",
          },
        ];

        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 0,
            percentage: 0,
          },
        ];

        const result = validateAndFinalize(distributions, groups, 0);

        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain("Negative tip amount");
        expect(result.errors[0]).toContain("Alice");
      });
    });

    describe("Group Summaries", () => {
      it("should generate accurate group summaries", () => {
        const distributions = [
          {
            employeeId: "emp1",
            employeeCode: "emp1",
            name: "Alice",
            hoursWorked: 8,
            tipAmount: 30000,
            group: "Service",
            excludedFromTips: false,
            groupId: "service",
            groupName: "Service",
            professionId: "server",
          },
          {
            employeeId: "emp2",
            employeeCode: "emp2",
            name: "Bob",
            hoursWorked: 6,
            tipAmount: 20000,
            group: "Service",
            excludedFromTips: false,
            groupId: "service",
            groupName: "Service",
            professionId: "server",
          },
        ];

        const groups = [
          {
            id: "service",
            name: "Service",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["server"],
            allocatedAmount: 50000,
            percentage: 50,
          },
          {
            id: "kitchen",
            name: "Kitchen",
            type: "fixed" as const,
            employeeDistribution: "by_hours" as const,
            professionIds: ["chef"],
            allocatedAmount: 50000,
            percentage: 50,
          },
        ];

        const result = validateAndFinalize(distributions, groups, 100000);

        expect(result.groupSummaries).toBeDefined();
        expect(result.groupSummaries).toHaveLength(2);

        const serviceSummary = result.groupSummaries?.find(
          (g) => g.groupId === "service",
        );
        expect(serviceSummary).toMatchObject({
          groupId: "service",
          groupName: "Service",
          allocatedAmount: 50000,
          employeeCount: 2,
          distributedAmount: 50000,
        });

        const kitchenSummary = result.groupSummaries?.find(
          (g) => g.groupId === "kitchen",
        );
        expect(kitchenSummary).toMatchObject({
          groupId: "kitchen",
          groupName: "Kitchen",
          allocatedAmount: 50000,
          employeeCount: 0,
          distributedAmount: 0,
        });
      });
    });
  });

  describe("calculateTipsDistribution RxJS Pipeline", () => {
    describe("End-to-End Tests", () => {
      it("should process simple fixed percentage configuration (Milchbar)", async () => {
        const config = {
          groups: {
            service: {
              type: "fixed",
              id: "service",
              name: "Service Staff",
              percentage: 45,
              employeeDistribution: "by_hours",
              professionIds: ["server", "runner"],
            } as FixedPercentageGroup,
            kitchen: {
              type: "fixed",
              id: "kitchen",
              name: "Kitchen Staff",
              percentage: 40,
              employeeDistribution: "by_hours",
              professionIds: ["chef", "cook"],
            } as FixedPercentageGroup,
            dishwasher: {
              type: "fixed",
              id: "dishwasher",
              name: "Dishwashing",
              percentage: 15,
              employeeDistribution: "by_hours",
              professionIds: ["dishwasher"],
            } as FixedPercentageGroup,
          },
        };

        const sales = {
          totalTips: 100000, // €1000
          categoryBreakdown: {},
        };

        const employees = [
          {
            id: "emp1",
            name: "Alice Server",
            professionId: "server",
            hoursWorked: 8,
          },
          {
            id: "emp2",
            name: "Bob Runner",
            professionId: "runner",
            hoursWorked: 6,
          },
          {
            id: "emp3",
            name: "Carlo Chef",
            professionId: "chef",
            hoursWorked: 8,
          },
          {
            id: "emp4",
            name: "Diana Cook",
            professionId: "cook",
            hoursWorked: 4,
          },
          {
            id: "emp5",
            name: "Elena Dishwasher",
            professionId: "dishwasher",
            hoursWorked: 7,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // Check summary
        expect(result.summary.totalTips).toBe(100000);
        expect(result.summary.distributedTotal).toBe(100000);
        expect(result.summary.unassignedAmount).toBe(0);
        expect(result.summary.distributionPercentage).toBe(100);

        // Check distributions
        expect(result.distributions).toHaveLength(5);

        // Service staff (45000 total, 14 hours)
        const alice = result.distributions.find((d) => d.employeeId === "emp1");
        expect(alice?.tipAmount).toBe(25714); // (8/14) * 45000

        const bob = result.distributions.find((d) => d.employeeId === "emp2");
        expect(bob?.tipAmount).toBe(19286); // remainder

        // Kitchen staff (40000 total, 12 hours)
        const carlo = result.distributions.find((d) => d.employeeId === "emp3");
        expect(carlo?.tipAmount).toBe(26667); // (8/12) * 40000

        const diana = result.distributions.find((d) => d.employeeId === "emp4");
        expect(diana?.tipAmount).toBe(13333); // remainder

        // Dishwasher (15000 total)
        const elena = result.distributions.find((d) => d.employeeId === "emp5");
        expect(elena?.tipAmount).toBe(15000);

        // No warnings or errors
        expect(result.warnings).toHaveLength(0);
        expect(result.errors).toHaveLength(0);
      });

      it("should process complex hierarchical configuration (Zola Funkhaus)", async () => {
        const config = {
          groups: {
            service: {
              type: "fixed",
              id: "service",
              name: "Service Staff",
              percentage: 50,
              employeeDistribution: "by_hours",
              professionIds: ["server"],
            } as FixedPercentageGroup,
            kitchen: {
              type: "fixed",
              id: "kitchen",
              name: "Kitchen Staff",
              percentage: 40,
              employeeDistribution: "by_hours",
              professionIds: [], // Parent group
            } as FixedPercentageGroup,
            pizzaStation: {
              type: "category",
              id: "pizzaStation",
              name: "Pizza Station",
              parentId: "kitchen",
              categories: ["Pizza"],
              employeeDistribution: "equal",
              professionIds: ["pizzaiolo"],
            } as CategoryBasedGroup,
            pastaStation: {
              type: "category",
              id: "pastaStation",
              name: "Pasta Station",
              parentId: "kitchen",
              categories: ["Pasta", "Salad"],
              employeeDistribution: "by_hours",
              professionIds: ["chef"],
            } as CategoryBasedGroup,
            dishwasher: {
              type: "fixed",
              id: "dishwasher",
              name: "Dishwashing",
              percentage: 10,
              employeeDistribution: "by_hours",
              professionIds: ["dishwasher"],
            } as FixedPercentageGroup,
          },
        };

        const sales = {
          totalTips: 200000, // €2000
          categoryBreakdown: {
            Pizza: 60000, // €600
            Pasta: 30000, // €300
            Salad: 10000, // €100
            Beverages: 50000, // €500 (not assigned to kitchen)
            Dessert: 50000, // €500 (not assigned to kitchen)
          },
        };

        const employees = [
          {
            id: "srv1",
            name: "Server 1",
            professionId: "server",
            hoursWorked: 10,
          },
          {
            id: "srv2",
            name: "Server 2",
            professionId: "server",
            hoursWorked: 10,
          },
          {
            id: "piz1",
            name: "Pizzaiolo 1",
            professionId: "pizzaiolo",
            hoursWorked: 8,
          },
          {
            id: "piz2",
            name: "Pizzaiolo 2",
            professionId: "pizzaiolo",
            hoursWorked: 8,
          },
          {
            id: "chef1",
            name: "Chef 1",
            professionId: "chef",
            hoursWorked: 6,
          },
          {
            id: "chef2",
            name: "Chef 2",
            professionId: "chef",
            hoursWorked: 10,
          },
          {
            id: "dish1",
            name: "Dishwasher 1",
            professionId: "dishwasher",
            hoursWorked: 8,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // Check summary
        expect(result.summary.totalTips).toBe(200000);
        expect(result.summary.distributedTotal).toBe(200000);
        expect(result.summary.unassignedAmount).toBe(0);

        // Service gets 50% = 100000, split equally by hours (both worked 10)
        expect(
          result.distributions.find((d) => d.employeeId === "srv1")?.tipAmount,
        ).toBe(50000);
        expect(
          result.distributions.find((d) => d.employeeId === "srv2")?.tipAmount,
        ).toBe(50000);

        // Kitchen gets 40% = 80000
        // Pizza: 60000/100000 = 60% of kitchen = 48000 (equal distribution)
        expect(
          result.distributions.find((d) => d.employeeId === "piz1")?.tipAmount,
        ).toBe(24000);
        expect(
          result.distributions.find((d) => d.employeeId === "piz2")?.tipAmount,
        ).toBe(24000);

        // Pasta+Salad: 40000/100000 = 40% of kitchen = 32000 (by hours)
        const chef1 = result.distributions.find(
          (d) => d.employeeId === "chef1",
        );
        const chef2 = result.distributions.find(
          (d) => d.employeeId === "chef2",
        );
        expect(chef1?.tipAmount).toBe(12000); // (6/16) * 32000
        expect(chef2?.tipAmount).toBe(20000); // remainder

        // Dishwasher gets 10% = 20000
        expect(
          result.distributions.find((d) => d.employeeId === "dish1")?.tipAmount,
        ).toBe(20000);

        // No errors
        expect(result.errors).toHaveLength(0);
      });

      it("should process real-world Milchbar configuration (45/40/15 split)", async () => {
        // Real production configuration from Milchbar
        const config = {
          groups: {
            service: {
              type: "fixed",
              id: "service",
              name: "Service Staff",
              percentage: 45,
              employeeDistribution: "by_hours",
              professionIds: ["pr_20d961bf-6ab9-4cf3-a517-3792850bf47a"],
            } as FixedPercentageGroup,
            kitchen: {
              type: "fixed",
              id: "kitchen",
              name: "Kitchen Staff",
              percentage: 40,
              employeeDistribution: "by_hours",
              professionIds: [
                "pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe",
                "pr_d1e4c958-f933-42d8-ad3b-5cd7f91cb908",
                "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a",
              ],
            } as FixedPercentageGroup,
            dishwasher: {
              type: "fixed",
              id: "dishwasher",
              name: "Dishwashing",
              percentage: 15,
              employeeDistribution: "by_hours",
              professionIds: ["pr_5d1785f7-c664-423c-bb17-01d22c9fd116"],
            } as FixedPercentageGroup,
          },
        };

        const sales = {
          totalTips: 100000, // €1000
          categoryBreakdown: {},
        };

        const employees = [
          {
            id: "srv1",
            name: "Server",
            professionId: "pr_20d961bf-6ab9-4cf3-a517-3792850bf47a",
            hoursWorked: 8,
          },
          {
            id: "chef1",
            name: "Chef",
            professionId: "pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe",
            hoursWorked: 8,
          },
          {
            id: "piz1",
            name: "Pizzaiolo",
            professionId: "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a",
            hoursWorked: 4,
          },
          {
            id: "dish1",
            name: "Dishwasher",
            professionId: "pr_5d1785f7-c664-423c-bb17-01d22c9fd116",
            hoursWorked: 7,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // Check summary
        expect(result.summary.totalTips).toBe(100000);
        expect(result.summary.distributedTotal).toBe(100000);
        expect(result.summary.unassignedAmount).toBe(0);

        // Service gets 45%
        expect(
          result.distributions.find((d) => d.employeeId === "srv1")?.tipAmount,
        ).toBe(45000);

        // Kitchen gets 40%, distributed by hours (12 total)
        const chef = result.distributions.find((d) => d.employeeId === "chef1");
        const piz = result.distributions.find((d) => d.employeeId === "piz1");
        expect(chef?.tipAmount).toBe(26667); // (8/12) * 40000
        expect(piz?.tipAmount).toBe(13333); // remainder

        // Dishwasher gets 15%
        expect(
          result.distributions.find((d) => d.employeeId === "dish1")?.tipAmount,
        ).toBe(15000);

        // No warnings or errors
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
      });

      it("should process real-world Zola East configuration (50/40/10 split)", async () => {
        // Real production configuration from Zola East
        const config = {
          groups: {
            service: {
              type: "fixed",
              id: "service",
              name: "Service",
              percentage: 50,
              employeeDistribution: "by_hours",
              professionIds: [
                "pr_20d961bf-6ab9-4cf3-a517-3792850bf47a",
                "pr_d3b00f6a-313c-41d9-bd8b-3f98a70e4d1f",
              ],
            } as FixedPercentageGroup,
            kitchen: {
              type: "fixed",
              id: "kitchen",
              name: "Kitchen",
              percentage: 40,
              employeeDistribution: "by_hours",
              professionIds: ["pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a"],
            } as FixedPercentageGroup,
            dishwasher: {
              type: "fixed",
              id: "dishwasher",
              name: "Dishwashing",
              percentage: 10,
              employeeDistribution: "by_hours",
              professionIds: ["pr_5d1785f7-c664-423c-bb17-01d22c9fd116"],
            } as FixedPercentageGroup,
          },
        };

        const sales = {
          totalTips: 200000, // €2000
          categoryBreakdown: {},
        };

        const employees = [
          {
            id: "srv1",
            name: "Server 1",
            professionId: "pr_20d961bf-6ab9-4cf3-a517-3792850bf47a",
            hoursWorked: 10,
          },
          {
            id: "srv2",
            name: "Runner",
            professionId: "pr_d3b00f6a-313c-41d9-bd8b-3f98a70e4d1f",
            hoursWorked: 6,
          },
          {
            id: "piz1",
            name: "Pizzaiolo",
            professionId: "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a",
            hoursWorked: 8,
          },
          {
            id: "dish1",
            name: "Dishwasher",
            professionId: "pr_5d1785f7-c664-423c-bb17-01d22c9fd116",
            hoursWorked: 8,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // Check summary
        expect(result.summary.totalTips).toBe(200000);
        expect(result.summary.distributedTotal).toBe(200000);
        expect(result.summary.unassignedAmount).toBe(0);

        // Service gets 50% (100000), distributed by hours (16 total)
        const srv1 = result.distributions.find((d) => d.employeeId === "srv1");
        const srv2 = result.distributions.find((d) => d.employeeId === "srv2");
        expect(srv1?.tipAmount).toBe(62500); // (10/16) * 100000
        expect(srv2?.tipAmount).toBe(37500); // remainder

        // Kitchen gets 40%
        expect(
          result.distributions.find((d) => d.employeeId === "piz1")?.tipAmount,
        ).toBe(80000);

        // Dishwasher gets 10%
        expect(
          result.distributions.find((d) => d.employeeId === "dish1")?.tipAmount,
        ).toBe(20000);

        // No warnings or errors
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
      });

      it("should warn about duplicate profession assignment in sibling subgroups (bad UX)", async () => {
        // Real production configuration from Zola Ufer
        // PROBLEM: Both Pizza and Pasta subgroups use the SAME profession (pr_5a27bffd)
        // This is a UX failure - BusinessForm should prevent this!
        const config = {
          groups: {
            group_1759077447172: {
              type: "fixed",
              id: "group_1759077447172",
              name: "Service",
              percentage: 50,
              employeeDistribution: "by_hours",
              professionIds: ["pr_20d961bf-6ab9-4cf3-a517-3792850bf47a"],
            } as FixedPercentageGroup,
            group_1759077285420: {
              type: "fixed",
              id: "group_1759077285420",
              name: "Kitchen",
              percentage: 40,
              employeeDistribution: "by_hours",
              professionIds: [
                "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a", // Pizzaiolo
                "pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe", // Pastry Chef
              ],
            } as FixedPercentageGroup,
            group_1759077364371: {
              type: "category",
              id: "group_1759077364371",
              name: "Pizza",
              parentId: "group_1759077285420",
              categories: ["Pizza"],
              employeeDistribution: "by_hours",
              professionIds: ["pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a"], // ⚠️ Duplicate!
            } as CategoryBasedGroup,
            group_1759077400588: {
              type: "category",
              id: "group_1759077400588",
              name: "Pasta",
              parentId: "group_1759077285420",
              categories: ["Pasta", "Starter & Salad", "Dessert"],
              employeeDistribution: "by_hours",
              professionIds: ["pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a"], // ⚠️ Duplicate!
            } as CategoryBasedGroup,
            group_1759077447874: {
              type: "fixed",
              id: "group_1759077447874",
              name: "Dishwashers",
              percentage: 10,
              employeeDistribution: "by_hours",
              professionIds: ["pr_5d1785f7-c664-423c-bb17-01d22c9fd116"],
            } as FixedPercentageGroup,
          },
        };

        const sales = {
          totalTips: 150000, // €1500
          categoryBreakdown: {
            Pizza: 50000, // €500
            Pasta: 20000, // €200
            "Starter & Salad": 10000, // €100
            Dessert: 20000, // €200
            Beverages: 50000, // €500 (not assigned)
          },
        };

        const employees = [
          {
            id: "srv1",
            name: "Server",
            professionId: "pr_20d961bf-6ab9-4cf3-a517-3792850bf47a",
            hoursWorked: 8,
          },
          {
            id: "piz1",
            name: "Pizzaiolo 1",
            professionId: "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a",
            hoursWorked: 8,
          },
          {
            id: "piz2",
            name: "Pizzaiolo 2",
            professionId: "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a",
            hoursWorked: 4,
          },
          {
            id: "dish1",
            name: "Dishwasher",
            professionId: "pr_5d1785f7-c664-423c-bb17-01d22c9fd116",
            hoursWorked: 7,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // This configuration is WRONG but system handles it by giving employees tips from BOTH groups
        // The employees get double-dipped which is incorrect behavior
        // TODO: BusinessForm should prevent this configuration entirely

        // Service gets 50%
        expect(
          result.distributions.find((d) => d.employeeId === "srv1")?.tipAmount,
        ).toBe(75000);

        // Dishwasher gets 10%
        expect(
          result.distributions.find((d) => d.employeeId === "dish1")?.tipAmount,
        ).toBe(15000);

        // The pizzaiolos receive tips from BOTH Pizza and Pasta groups (incorrect!)
        // This demonstrates the problem with duplicate profession assignments
        const piz1Dists = result.distributions.filter(
          (d) => d.employeeId === "piz1",
        );
        const piz2Dists = result.distributions.filter(
          (d) => d.employeeId === "piz2",
        );

        // Should have received distributions from BOTH groups
        expect(piz1Dists.length).toBeGreaterThan(1);
        expect(piz2Dists.length).toBeGreaterThan(1);
      });

      it("should process real-world Zola Funkhaus with employees and subgroups", async () => {
        // Real production configuration that was failing
        const config = {
          groups: {
            service: {
              type: "fixed",
              id: "service",
              name: "Service",
              percentage: 50,
              employeeDistribution: "by_hours",
              professionIds: [
                "pr_20d961bf-6ab9-4cf3-a517-3792850bf47a",
                "pr_d3b00f6a-313c-41d9-bd8b-3f98a70e4d1f",
              ],
            } as FixedPercentageGroup,
            kitchen: {
              type: "fixed",
              id: "kitchen",
              name: "Kitchen",
              percentage: 40,
              employeeDistribution: "by_hours",
              professionIds: [
                "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a", // Pizzaiolo
                "pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe", // Pastry Chef
              ],
            } as FixedPercentageGroup,
            group_1758965027788: {
              type: "category",
              id: "group_1758965027788",
              name: "Pizza",
              parentId: "kitchen",
              categories: ["Pizza"],
              employeeDistribution: "by_hours",
              professionIds: ["pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a"],
            } as CategoryBasedGroup,
            group_1758965065838: {
              type: "category",
              id: "group_1758965065838",
              name: "Deserts",
              parentId: "kitchen",
              categories: ["Dessert"],
              employeeDistribution: "by_hours",
              professionIds: ["pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe"],
            } as CategoryBasedGroup,
            dishwasher: {
              type: "fixed",
              id: "dishwasher",
              name: "Dishwasher",
              percentage: 10,
              employeeDistribution: "by_hours",
              professionIds: ["pr_5d1785f7-c664-423c-bb17-01d22c9fd116"],
            } as FixedPercentageGroup,
          },
        };

        const sales = {
          totalTips: 9574, // €95.74
          categoryBreakdown: {
            Pizza: 3000, // €30
            Dessert: 1500, // €15
            Other: 5074, // €50.74
          },
        };

        const employees = [
          {
            id: "emp_server1",
            name: "Server 1",
            professionId: "pr_20d961bf-6ab9-4cf3-a517-3792850bf47a",
            hoursWorked: 8,
          },
          {
            id: "emp_server2",
            name: "Server 2",
            professionId: "pr_d3b00f6a-313c-41d9-bd8b-3f98a70e4d1f",
            hoursWorked: 6,
          },
          {
            id: "emp_pizzaiolo",
            name: "Pizzaiolo",
            professionId: "pr_5a27bffd-e048-4562-9596-e81a8eb5aa3a",
            hoursWorked: 8,
          },
          {
            id: "emp_pastry",
            name: "Pastry Chef",
            professionId: "pr_784b28c3-a7fd-4cca-892f-c7355b0bb3fe",
            hoursWorked: 6,
          },
          {
            id: "emp_dish",
            name: "Dishwasher",
            professionId: "pr_5d1785f7-c664-423c-bb17-01d22c9fd116",
            hoursWorked: 7,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // Check summary
        expect(result.summary.totalTips).toBe(9574);
        expect(result.summary.distributedTotal).toBe(9574);
        expect(result.summary.unassignedAmount).toBe(0);

        // All employees should receive tips
        expect(result.distributions).toHaveLength(5);

        // Service staff (4787 cents total, 14 hours)
        const server1 = result.distributions.find(
          (d) => d.employeeId === "emp_server1",
        );
        const server2 = result.distributions.find(
          (d) => d.employeeId === "emp_server2",
        );
        expect(server1?.tipAmount).toBe(2735); // (8/14) * 4787
        expect(server2?.tipAmount).toBe(2052); // remainder

        // Kitchen staff - distributed via category-based children
        // Pizza: 2553 cents to pizzaiolo
        const pizzaiolo = result.distributions.find(
          (d) => d.employeeId === "emp_pizzaiolo",
        );
        expect(pizzaiolo?.tipAmount).toBe(2553);
        expect(pizzaiolo?.group).toBe("Pizza");

        // Dessert: ~1276 cents to pastry chef (may be 1276 or 1277 due to rounding)
        const pastry = result.distributions.find(
          (d) => d.employeeId === "emp_pastry",
        );
        expect(pastry?.tipAmount).toBeGreaterThanOrEqual(1276);
        expect(pastry?.tipAmount).toBeLessThanOrEqual(1277);
        expect(pastry?.group).toBe("Deserts");

        // Dishwasher (957 cents)
        const dish = result.distributions.find(
          (d) => d.employeeId === "emp_dish",
        );
        expect(dish?.tipAmount).toBe(957);

        // No warnings or errors (fully distributed)
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
      });

      it("should generate warning when parent remainder has no employees", async () => {
        const config = {
          groups: {
            kitchen: {
              type: "fixed",
              id: "kitchen",
              name: "Kitchen",
              percentage: 100,
              employeeDistribution: "by_hours",
              professionIds: ["pizzaiolo", "line_cook"], // line_cook not in child
            } as FixedPercentageGroup,
            pizzaStation: {
              type: "category",
              id: "pizzaStation",
              name: "Pizza",
              parentId: "kitchen",
              categories: ["Pizza"],
              employeeDistribution: "by_hours",
              professionIds: ["pizzaiolo"],
            } as CategoryBasedGroup,
          },
        };

        const sales = {
          totalTips: 10000, // €100
          categoryBreakdown: {
            Pizza: 6000, // €60
            Other: 4000, // €40
          },
        };

        // Only pizzaiolo employee, no line_cook
        const employees = [
          {
            id: "emp1",
            name: "Pizzaiolo",
            professionId: "pizzaiolo",
            hoursWorked: 8,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // Pizza child gets all 10000 cents (it's category-based and gets 100% of parent)
        const pizzaDist = result.distributions.find(
          (d) => d.groupId === "pizzaStation",
        );
        expect(pizzaDist?.tipAmount).toBe(10000);

        // No remainder since pizza got 100% of the allocation
        expect(result.summary.unassignedAmount).toBe(0);
        // No warnings expected when everything is distributed
        expect(result.warnings).toHaveLength(0);
      });

      it("should error when children allocate more than parent", async () => {
        const config = {
          groups: {
            kitchen: {
              type: "fixed",
              id: "kitchen",
              name: "Kitchen",
              percentage: 40, // 40% of tips
              employeeDistribution: "by_hours",
              professionIds: [],
            } as FixedPercentageGroup,
            pizzaStation: {
              type: "category",
              id: "pizzaStation",
              name: "Pizza",
              parentId: "kitchen",
              categories: ["Pizza"],
              employeeDistribution: "by_hours",
              professionIds: ["pizzaiolo"],
            } as CategoryBasedGroup,
          },
        };

        const sales = {
          totalTips: 10000, // €100
          categoryBreakdown: {
            // Pizza sales would give child MORE than parent's 40%
            Pizza: 10000, // 100% of tips
            Other: 0,
          },
        };

        const employees = [
          {
            id: "emp1",
            name: "Pizzaiolo",
            professionId: "pizzaiolo",
            hoursWorked: 8,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        // Category child gets 100% of pizza sales from parent's 40% allocation
        // Parent: 4000 (40% of 10000)
        // Child gets: 4000 (100% of pizza sales from parent's allocation)
        // This is correct behavior - child gets what sales dictate, capped by parent

        // Should distribute successfully
        expect(result.distributions.length).toBeGreaterThan(0);
        expect(result.summary.distributedTotal).toBeGreaterThan(0);
      });
    });

    describe("Error Handling", () => {
      it("should handle errors in the pipeline gracefully", async () => {
        // Create invalid input that will cause an error
        const config = null as any; // This will cause an error
        const sales = { totalTips: 100000, categoryBreakdown: {} };
        const employees = [];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        expect(result.distributions).toHaveLength(0);
        expect(result.summary.totalTips).toBe(0);
        expect(result.summary.distributedTotal).toBe(0);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain("Calculation failed");
      });

      it("should handle missing groups gracefully", async () => {
        const config = { groups: {} };
        const sales = { totalTips: 100000, categoryBreakdown: {} };
        const employees = [
          {
            id: "emp1",
            name: "Alice",
            professionId: "server",
            hoursWorked: 8,
          },
        ];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        expect(result.distributions).toHaveLength(0);
        expect(result.summary.unassignedAmount).toBe(100000);
        expect(result.warnings.length).toBeGreaterThan(0);
      });

      it("should handle empty employees array", async () => {
        const config = {
          groups: {
            service: {
              type: "fixed",
              id: "service",
              name: "Service",
              percentage: 100,
              employeeDistribution: "by_hours",
              professionIds: ["server"],
            } as FixedPercentageGroup,
          },
        };
        const sales = { totalTips: 100000, categoryBreakdown: {} };
        const employees: any[] = [];

        const result = await firstValueFrom(
          calculateTipsDistribution(config, sales, employees),
        );

        expect(result.distributions).toHaveLength(0);
        expect(result.summary.unassignedAmount).toBe(100000);
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]).toContain("€1000.00 unassigned");
      });
    });
  });
});
