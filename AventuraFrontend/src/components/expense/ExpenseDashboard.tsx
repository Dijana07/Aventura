import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import ExpenseCard from "./ExpenseCard";

interface Props {
  tripId: string;
  expenses: ExpenseDto[];
  onEdit: (expense: ExpenseDto) => void;
  onDelete: (expenseId: string) => void;
  canEdit: boolean;
}

export default function ExpenseDashboard({
  tripId,
  expenses,
  onEdit,
  onDelete,
  canEdit,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 justify-start! w-full!">
      {expenses.map((expense) => (
        <ExpenseCard
          tripId={tripId}
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}