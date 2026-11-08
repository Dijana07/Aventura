import type { CreateChecklistItemRequest } from "@/models/trip/CreateChecklistItemRequest";

export function validateCreateChecklistItem(request: CreateChecklistItemRequest): string | null {
  if (!request.title.trim())
    return "Title is required.";

  return null;
}
