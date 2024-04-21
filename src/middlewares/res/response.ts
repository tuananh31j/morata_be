import { SuccessResponse } from '@/interfaces/SuccessResponse';

const SuccessResponse = <T>({ data, message, status, code, success }: SuccessResponse<T>) => {
  return {
    status,
    code,
    message,
    success,
    data,
  };
};

export default SuccessResponse;
