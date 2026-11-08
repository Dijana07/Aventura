import type { CreateTripRequest } from "@/models/trip/CreateTripRequest";
import type { UpdateTripRequest } from "@/models/trip/UpdateTripRequest";

const today = () => new Date(new Date().setHours(0, 0, 0, 0));

export function validateCreateTrip(request: CreateTripRequest): string | null {
  if (!request.title.trim())
    return "Title is required.";

  if (new Date(request.startDate) < today())
    return "Start date cannot be in the past.";

  if (new Date(request.endDate) < today())
    return "End date cannot be in the past.";

  if (new Date(request.startDate) > new Date(request.endDate))
    return "Start date cannot be after end date.";

  if (request.budget < 0)
    return "Budget cannot be negative.";

  return null;
}

export function validateUpdateTrip(request: UpdateTripRequest): string | null {
  if (request.title !== undefined && !request.title.trim())
    return "Title cannot be empty.";

  if (request.startDate && new Date(request.startDate) < today()) {
    return "Start date cannot be in the past.";
  }

  if (request.endDate && new Date(request.endDate) < today()) {
    return "End date cannot be in the past.";
  }

  if (request.startDate && request.endDate && new Date(request.startDate) > new Date(request.endDate)) {
    return "Start date cannot be after end date.";
  }

  if (request.budget !== undefined && request.budget < 0 ) {
    return "Budget cannot be negative.";
  }

  return null;
}