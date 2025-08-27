import type { SafeUser } from './user';

// Generic API error type
export interface ErrorResponse {
  error: string | string[];
}

// Generic wrapper for success or error responses
export type ApiResponse<T> = T | ErrorResponse;

// Specific success types
export type RegisterUserSuccess = Pick<SafeUser, 'id' | 'email'>;
