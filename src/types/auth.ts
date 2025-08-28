import type { Request } from 'express';

/**
 * Interface for successful login response.
 * Contains user id, email, and JWT token.
 */
export interface LoginSuccess {
  id: number;
  email: string;
  token: string;
}

/**
 * Interface for JWT payload containing userId.
 */
export interface JwtPayload {
  userId: number;
}

/**
 * Extended Express Request type for authenticated requests.
 * Includes userId and households info.
 * @template P - Params type
 * @template ResBody - Response body type
 * @template ReqBody - Request body type
 * @template ReqQuery - Request query type
 */
export interface AuthenticatedRequest<
  P = Record<string, unknown>, // req.params
  ResBody = unknown, // res.json body type
  ReqBody = Record<string, unknown>, // req.body
  ReqQuery = Record<string, unknown> // req.query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: number;
  households?: {
    id: number;
    roleId: number;
  }[];
}
