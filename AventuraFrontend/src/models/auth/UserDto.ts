import type { UserRole } from "@/enums/UserRole";

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: UserRole;
  photoUrl: string;
}