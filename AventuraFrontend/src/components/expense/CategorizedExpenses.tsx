import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import { ExpenseCategory } from "@/enums/ExpenseCategory";
import ExpenseCard from "./ExpenseCard";

interface Props {
  tripId: string;
  expenses: ExpenseDto[];
  onEdit: (expense: ExpenseDto) => void;
  onDelete: (expenseId: string) => void;
  canEdit: boolean;
}

export default function CategorizedExpenses({
  tripId,
  expenses,
  onEdit,
  onDelete,
  canEdit,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Object.values(ExpenseCategory).map(
        (category) => {
          const categoryExpenses =
            expenses.filter(
              (expense) =>
                expense.category === category
            );

          const totalAmount =
            categoryExpenses.reduce(
              (sum, expense) =>
                sum + expense.amount,
              0
            );

          return (
            <div
              key={category}
              className="rounded-xl border border-white/10 bg-background-100 p-4"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    {category}
                  </h2>

                  <span className="rounded-full bg-green-700 px-3 py-1 text-sm text-white">
                    {
                      categoryExpenses.length
                    }
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  Total: €
                  {totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="space-y-4">
                {categoryExpenses.length ===
                0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-gray-400">
                    No expenses
                  </div>
                ) : (
                  categoryExpenses.map(
                    (expense) => (
                      <ExpenseCard
                        tripId={tripId}
                        key={expense.id}
                        expense={expense}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        canEdit={canEdit}
                      />
                    )
                  )
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}