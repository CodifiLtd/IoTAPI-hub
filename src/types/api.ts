import type { SafeUser } from './user';

// Generic API error type
/**
 * Generic API error response type.
 * Contains error message(s).
 */
export interface ErrorResponse {
  error: string | string[];
}

// Generic wrapper for success or error responses
/**
 * Generic wrapper for API responses (success or error).
 * @template T - Type of success response data.
 */
export type ApiResponse<T> = T | ErrorResponse;

// Specific success types
/**
 * Type for successful user registration response.
 * Contains user id and email.
 */
export type RegisterUserSuccess = Pick<SafeUser, 'id' | 'email'>;
