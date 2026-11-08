import { useState } from "react";
import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { List } from "@/components/tailgrids/core/list";
import { tripService } from "@/services/tripService";
import type { ChecklistItemDto } from "@/models/trip/ChecklistItemDto";
import type { UpdateChecklistItemRequest } from "@/models/trip/UpdateChecklistItemRequest";
import type { CreateChecklistItemRequest } from "@/models/trip/CreateChecklistItemRequest";
import { Trash2 } from "lucide-react";
import { validateCreateChecklistItem } from "@/validators/checklistValidator";

interface Props {
  tripId: string;
  checklistItems: ChecklistItemDto[];
  canEdit: boolean;
  onAdd: (item: ChecklistItemDto) => void;
  onDelete: (itemId: string) => void;
  onItemUpdated: (item: ChecklistItemDto) => void;
}

export default function Checklist({
  tripId,
  checklistItems,
  canEdit,
  onAdd,
  onDelete,
  onItemUpdated
}: Props) {
  const [items, setItems] = useState(checklistItems);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (
    item: ChecklistItemDto,
    checked: boolean
  ) => {
    try {
      const request: UpdateChecklistItemRequest = {
        checklistItemId: item.id,
        tripId,
        isChecked: checked,
      };

      //console.log(request);
      const response = await tripService.updateChecklistItem(request);
      //console.log(response.data);
      if (response.success && response.data)
      {
        setItems((prev) =>
          prev.map((x) =>
            x.id === response.data?.id
              ? response.data
              : x
          )
        );
        onItemUpdated(response.data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } 
  };

  const handleDelete = async (item: ChecklistItemDto) => {
    try {
      const result = await tripService.deleteChecklistItem({checklistItemId: item.id,tripId,});

      if (result.success)
      {
        setItems((prev) => prev.filter((x) => x.id !== item.id));
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

  const handleAdd = async () => {
    if (!newItemTitle.trim()) return;

    setIsLoading(true);
    try {
      const request: CreateChecklistItemRequest = {
        tripId,
        title: newItemTitle,
      };

      const error = validateCreateChecklistItem(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const createdItem = await tripService.createChecklistItem(request);

      if (createdItem.success && createdItem.data)
      {
        onAdd(createdItem.data);
        setItems((prev) => [...prev, createdItem.data!]);
        setNewItemTitle("");
      }
      alert(createdItem.message);
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
    <div className="mx-auto w-full max-w-5xl max-h-[90dvh] md:max-h-[95dvh] overflow-y-auto space-y-4">
      <List>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                id={item.id}
                checked={item.isChecked}
                onChange={(e) => {
                  handleToggle(item, e.target.checked);
                }}
                disabled={!canEdit}
              />

              <Label
                htmlFor={item.id}
                className={`cursor-pointer ${
                  item.isChecked
                  ? "line-through text-gray-500"
                  : ""
                }`}
              >
                {item.title}
              </Label>
            </div>
            {canEdit && (
              <button
                onClick={() => handleDelete(item)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            )}
          </li>
        ))}
      </List>

      {canEdit && (
        <div className="flex gap-2">
          <input
            value={newItemTitle}
            onChange={(e) =>
                setNewItemTitle(e.target.value)
            }
            placeholder="New item..."
            className="border rounded px-3 py-2 flex-1 bg-transparent"
          />

          <button
            onClick={handleAdd}
            className="rounded bg-primary px-4 py-2 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add new"}
          </button>
        </div>
      )}
    </div>
  );
}