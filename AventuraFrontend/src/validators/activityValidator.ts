import type { CreateActivityRequest } from "@/models/activity/CreateActivityRequest";
import type { UpdateActivityRequest } from "@/models/activity/UpdateActivityRequest";

export function validateCreateActivity(request: CreateActivityRequest): string | null {
  if (!request.title.trim())
    return "Title is required.";

  if (!request.location.trim())
    return "Location is required.";

  if (!request.description.trim())
    return "Description is required.";

  if (request.budget < 0)
    return "Budget cannot be negative.";

  if (new Date(request.startDate) > new Date(request.endDate))
    return "Start date cannot be after end date.";

  return null;
}

export function validateUpdateActivity(request: UpdateActivityRequest): string | null {
  if (request.title !== undefined && !request.title.trim())
    return "Title cannot be empty.";

  if (request.location !== undefined && !request.location.trim())
    return "Location cannot be empty.";

  if (request.description !== undefined && !request.description.trim())
    return "Description cannot be empty.";

  if (request.activityStatus !== undefined && !request.activityStatus.trim())
    return "Activity status cannot be empty.";

  if (request.budget !== undefined && request.budget < 0)
    return "Budget cannot be negative.";

  if (request.startDate && request.endDate && new Date(request.startDate) > new Date(request.endDate)) {
    return "Start date cannot be after end date.";
  }

  return null;
}