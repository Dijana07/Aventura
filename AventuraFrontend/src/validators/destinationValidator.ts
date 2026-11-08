import type { CreateDestinationRequest } from "@/models/destination/CreateDestinationRequest";
import type { UpdateDestinationRequest } from "@/models/destination/UpdateDestinationRequest";

export function validateCreateDestination(request: CreateDestinationRequest): string | null {
  if (!request.title.trim())
    return "Title is required.";

  if (!request.location.trim())
    return "Location is required.";

  if (new Date(request.startDate) < new Date(new Date().setHours(0, 0, 0, 0)))
    return "Start date cannot be in the past.";

  if (new Date(request.endDate) < new Date(new Date().setHours(0, 0, 0, 0)))
    return "End date cannot be in the past.";

  if (new Date(request.startDate) > new Date(request.endDate))
    return "Start date cannot be after end date.";

  return null;
}

export function validateUpdateDestination(request: UpdateDestinationRequest): string | null {
  if (request.title !== undefined && !request.title.trim())
    return "Title cannot be empty.";

  if (request.location !== undefined && !request.location.trim())
    return "Location cannot be empty.";

  if (request.startDate &&new Date(request.startDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
    return "Start date cannot be in the past.";
  }

  if (request.endDate &&new Date(request.endDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
    return "End date cannot be in the past.";
  }

  if (request.startDate && request.endDate && new Date(request.startDate) > new Date(request.endDate)) {
    return "Start date cannot be after end date.";
  }

  return null;
}