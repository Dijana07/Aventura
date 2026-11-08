import type { RegisterRequest } from "@/models/auth/RegisterRequest";
import { apiClient } from "../api/clientApi";
import type { LoginRequest } from "@/models/auth/LoginRequest";
import type { AuthResponse } from "@/models/auth/AuthResponse";
import type { ResultDto } from "@/models/common/ResultDto";
import type { UserDto } from "@/models/auth/UserDto";
import type { UpdateUserRequest } from "@/models/auth/UpdateUserRequest";

export const authService = {
  login(request: LoginRequest): Promise<ResultDto<AuthResponse>> {
    return apiClient("/auth/login", {
      method: "POST",
      body: request,
    });
  },

  register(request: RegisterRequest): Promise<ResultDto<AuthResponse>> {
    return apiClient("/auth/register", {
      method: "POST",
      body: request,
    });
  },

  getAllUsers(): Promise<ResultDto<UserDto[]>> {
    return apiClient("/auth/all", {
      method: "GET",
    });
  },

  updateUser(request: UpdateUserRequest): Promise<ResultDto<UserDto>> {
    const formData = new FormData();

    formData.append("userId", request.userId);

    if (request.firstName) {
      formData.append("firstName", request.firstName);
    }

    if (request.lastName) {
      formData.append("lastName", request.lastName);
    }

    if (request.password) {
      formData.append("password", request.password);
    }

    if (request.image) {
      formData.append("image", request.image);
    }

    return apiClient("/auth/update", {
      method: "PUT",
      body: formData,
    });
  },

  deleteUser(userId: string): Promise<ResultDto<boolean>>{
    return apiClient(`/auth/${userId}`, {
      method: "DELETE",
    });
  }
};