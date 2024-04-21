import { SuccessResponse } from './SuccessResponse';

export interface ErrorResponse extends SuccessResponse {
  stack?: string;
}

export default ErrorResponse;
