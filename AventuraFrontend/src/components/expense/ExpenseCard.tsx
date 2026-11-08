import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../tailgrids/core/alert-dialog";
import { buttonStyles } from "../tailgrids/core/button";
import { expenseService } from "@/services/expenseService";

interface Props {
  tripId: string;
  expense: ExpenseDto;
  onEdit?: (expense: ExpenseDto) => void;
  onDelete?: (expenseId: string) => void;
  canEdit: boolean;
}

export default function ExpenseCard({
  tripId, 
  expense,
  onEdit,
  onDelete,
  canEdit,
}: Props) {
  const handleDelete = async (item: ExpenseDto) => {
    try {
      const result = await expenseService.deleteExpense({expenseId: item.id, tripId});

      if (result.success && onDelete)
      {
        onDelete(item.id);
      }
      else
      {
        alert(result.message);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-background-100 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white">
            {expense.title}
          </h3>

          <p className="text-sm text-gray-400">
            {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>

        <span className="text-xl font-bold text-red-400 whitespace-nowrap">
          -{expense.amount.toFixed(2)} €
        </span>
      </div>

      <div className="mt-3">
        <span className="rounded-full bg-green-700/20 px-3 py-1 text-xs font-medium text-green-400">
          {expense.category}
        </span>
      </div>

      {expense.description && (
        <p className="mt-3 text-sm text-gray-300">
          {expense.description}
        </p>
      )}

      {canEdit && (
        <div className="mt-4 flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
            >
              <Pencil size={16} />
            </button>
          )}

          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger className="rounded-lg bg-red-600! p-2 text-white hover:bg-red-700!">
                <Trash2 size={18} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete expense</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this expense? This action is
                    permanent and all related data will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonStyles({ variant: "danger", size: "sm" })}
                    onClick={() => handleDelete(expense)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
}