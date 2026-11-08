import type { ExpenseCategory } from "@/enums/ExpenseCategory";

export interface ExpenseDto {
  id: string;
  title: string;
  date: string;
  description: string;
  amount: number;
  createdAt: string;
  category: ExpenseCategory;
}