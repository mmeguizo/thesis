export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export class PaginatedResponseDto<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
} 