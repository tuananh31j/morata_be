export interface ResponseT<T> {
  data: T;
  success: boolean;
  status: number;
  message: string;
}
