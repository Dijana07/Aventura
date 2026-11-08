export interface ResultDto<T> {
  success: boolean;
  message?: string;
  data?: T;
}