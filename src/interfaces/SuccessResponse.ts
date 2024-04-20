export interface SuccessResponse<T = null> {
  data: T;
  success: boolean;
  code: number;
  message: string;
  status: number;
}
