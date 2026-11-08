import type { UserDto } from "./UserDto";

export interface AuthResponse {
  user?: UserDto;
  token: string;
}