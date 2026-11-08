export const ExpenseCategory = {
  TRANSPORT: "TRANSPORT",
  ACCOMMODATION: "ACCOMMODATION",
  FOOD: "FOOD",
  TICKETS: "TICKETS",
  SHOPPING: "SHOPPING",
  OTHER: "OTHER",
} as const;

export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory];