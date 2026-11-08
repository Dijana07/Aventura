import type { AccessType } from "@/enums/AccessType";

export interface CreateShareTokenRequest {
  tripId: string;
  allowedUserEmail?: string;
  accessType: AccessType;
}