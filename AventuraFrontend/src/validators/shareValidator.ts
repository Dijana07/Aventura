import type { CreateShareTokenRequest } from "@/models/trip/CreateShareTokenRequest";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateCreateShareToken(request: CreateShareTokenRequest): string | null {
  if (!request.accessType.trim())
    return "Access type is required.";

  if (request.allowedUserEmail !== undefined && request.allowedUserEmail !== "" && !emailPattern.test(request.allowedUserEmail)) {
    return "Invalid email format.";
  }

  return null;
}