import type { AuthResponse } from "./AuthResponse";
import type { UserDto } from "./UserDto";

export interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  loading: boolean;
  login: (request: AuthResponse) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}