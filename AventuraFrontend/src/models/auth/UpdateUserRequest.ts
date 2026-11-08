export interface UpdateUserRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  image?: File;
}