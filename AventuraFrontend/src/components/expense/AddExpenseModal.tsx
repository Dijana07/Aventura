import { useState } from "react";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import type { CreateExpenseRequest } from "@/models/expense/CreateExpenseRequest";
import { ExpenseCategory } from "@/enums/ExpenseCategory";
import { expenseService } from "@/services/expenseService";
import { validateCreateExpense } from "@/validators/expenseValidator";

interface Props {
  tripId: string;
  onExpenseCreated?: (
    expense: ExpenseDto
  ) => void;
}

export default function AddExpenseModal({tripId,onExpenseCreated,}: Props) {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<keyof typeof ExpenseCategory>("OTHER");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const request: CreateExpenseRequest =
      {
        tripId,
        title,
        dateTime,
        description,
        amount: Number(amount),
        category,
      };

      const error = validateCreateExpense(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const result = await expenseService.createExpense(request);

      if (result.success && result.data) {
        onExpenseCreated?.(result.data);

        setTitle("");
        setDateTime("");
        setDescription("");
        setAmount("");
        setCategory("OTHER");

        alert("Expense created successfully");
      } else {
        alert("Failed to create expense. " +result.message);
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
        Add expense
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
            value={dateTime}
            className="bg-transparent"
            onChange={(e) =>
              setDateTime(e.target.value)
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
          <div className="grid gap-2">
            <Label className="text-white">
              Amount
            </Label>

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
          </div>

          <div className="grid gap-2">
            <Label className="text-white">
              Category
            </Label>

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
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-xl bg-green-700 px-6 py-3 text-white hover:bg-green-800"
        >
          { isLoading ? "Adding expense..." : "Add expense"}
        </button>
      </div>
    </div>
  );
}