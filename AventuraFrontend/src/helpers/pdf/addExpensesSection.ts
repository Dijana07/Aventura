import autoTable from "jspdf-autotable";

import type { ExpenseDto } from "@/models/expense/ExpenseDto";

import {
  addSectionTitle,
  type PdfContext,
} from "./pdfContext";

export const addExpensesSection =
  (
    ctx: PdfContext,
    expenses: ExpenseDto[]
  ) => {
    if (
      expenses.length === 0
    )
      return;

    const categoryTotals =
      expenses.reduce(
        (acc, expense) => {
          acc[
            expense.category
          ] =
            (acc[
              expense.category
            ] ?? 0) +
            expense.amount;

          return acc;
        },
        {} as Record<
          string,
          number
        >
      );

    addSectionTitle(
      ctx,
      "Expenses by Category"
    );

    autoTable(ctx.doc, {
      startY: ctx.currentY,

      head: [
        ["Category", "Total"],
      ],

      body: Object.entries(
        categoryTotals
      ).map(
        ([category, total]) => [
          category,
          `€${total.toFixed(
            2
          )}`,
        ]
      ),

      theme: "grid",
    });

    ctx.currentY =
      (
        ctx.doc as any
      ).lastAutoTable.finalY +
      15;

    addSectionTitle(
      ctx,
      "Expense Details"
    );

    autoTable(ctx.doc, {
      startY: ctx.currentY,

      head: [
        [
          "Title",
          "Category",
          "Date",
          "Amount",
        ],
      ],

      body: expenses.map(
        (expense) => [
          expense.title,
          expense.category,
          new Date(
            expense.date
          ).toLocaleDateString(),
          `€${expense.amount.toFixed(
            2
          )}`,
        ]
      ),

      theme: "striped",
    });

    ctx.currentY =
      (
        ctx.doc as any
      ).lastAutoTable.finalY +
      15;
  };