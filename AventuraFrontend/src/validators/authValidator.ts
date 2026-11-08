import type { LoginRequest } from "@/models/auth/LoginRequest";
import type { RegisterRequest } from "@/models/auth/RegisterRequest";
import type { UpdateUserRequest } from "@/models/auth/UpdateUserRequest";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validateLogin(request: LoginRequest): string | null {
  if (!request.email.trim() || !request.password.trim())
    return "Fields are missing in login request.";

  if (!emailPattern.test(request.email))
    return "Invalid email format.";

  return null;
}

export function validateRegister(request: RegisterRequest): string | null {
  if (!request.email.trim() || !request.password.trim() ||
    !request.firstName.trim() || !request.lastName.trim()) {
    return "Fields are missing in register request.";
  }

  if (!emailPattern.test(request.email))
    return "Invalid email format.";

  if (!passwordPattern.test(request.password))
    return "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.";

  return null;
}

export function validateUpdateUser(request: UpdateUserRequest): string | null {

  if (request.firstName !== undefined && !request.firstName.trim())
    return "New first name cannot be empty.";

  if (request.lastName !== undefined && !request.lastName.trim())
    return "New last name cannot be empty.";

  if (request.password !== undefined && !request.password.trim())
    return "New password cannot be empty.";

  if (
    request.password &&
    !passwordPattern.test(request.password)
  ) {
    return "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.";
  }

  return null;
}