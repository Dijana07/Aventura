import { useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import type { UpdateExpenseRequest } from "@/models/expense/UpdateExpenseRequest";
import { ExpenseCategory } from "@/enums/ExpenseCategory";
import { expenseService } from "@/services/expenseService";
import { validateUpdateExpense } from "@/validators/expenseValidator";

interface Props {
  tripId: string;
  expense: ExpenseDto;
  onExpenseUpdated?: (
    expense: ExpenseDto
  ) => void;
}

export default function EditExpenseModal({ tripId, expense, onExpenseUpdated,}: Props) {
  const [title, setTitle] = useState(expense.title);
  const [date, setDate] = useState( expense.date.slice(0, 10));
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const request: UpdateExpenseRequest =
        {
          expenseId: expense.id,
          tripId,

          title:
            title === expense.title
              ? undefined
              : title,

          date:
            date ===
            expense.date.split("T")[0]
              ? undefined
              : date,

          description:
            description ===
            expense.description
              ? undefined
              : description,

          amount:
            Number(amount) ===
            expense.amount
              ? undefined
              : Number(amount),

          category:
            category ===
            expense.category
              ? undefined
              : category,
        };

      const error = validateUpdateExpense(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const result = await expenseService.updateExpense(request);

      if (result.success && result.data) {
        onExpenseUpdated?.(result.data);

        alert("Expense updated successfully");
      } else {
        alert("Failed to update expense. " + result.message);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl max-h-[90dvh] md:max-h-[95dvh] overflow-y-auto">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Edit expense
      </h2>

      <div className="space-y-5">
        <div className="grid gap-2">
          <Label className="text-white">
            Title
          </Label>

          <Input
            value={title}
            className="bg-transparent"
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-white">
            Date
          </Label>

          <Input
            type="date"
            value={date}
            className="bg-transparent"
            onChange={(e) =>
              setDate(e.target.value)
            }
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-white">
            Description
          </Label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            type="number"
            value={amount}
            className="bg-transparent"
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target
                  .value as keyof typeof ExpenseCategory
              )
            }
            className="rounded-xl border border-white/20 bg-transparent px-4 py-3 text-white"
          >
            {Object.values(
              ExpenseCategory
            ).map((category) => (
              <option
                key={category}
                value={category}
                className="bg-background-100"
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-xl bg-green-700 px-6 py-3 text-white hover:bg-green-800"
        >
          { isLoading ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}