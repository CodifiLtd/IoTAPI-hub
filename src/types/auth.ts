import type { Request } from 'express';

export interface LoginSuccess {
  id: number;
  email: string;
  token: string;
}

export interface JwtPayload {
  userId: number;
}

export interface AuthenticatedRequest<
  P = Record<string, unknown>, // req.params
  ResBody = unknown, // res.json body type
  ReqBody = Record<string, unknown>, // req.body
  ReqQuery = Record<string, unknown> // req.query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: number;
}
