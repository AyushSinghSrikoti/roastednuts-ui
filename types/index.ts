export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  message: string | string[];
  statusCode: number;
  error?: string;
}
