import type { User } from '@prisma/generated';
import type { Request, Response } from 'express';

export interface GqlAuthRequest extends Request {
  user: User;
}

export interface GqlContext {
  req: Request;
  res: Response;
}

export interface GqlAuthContext extends Omit<GqlContext, 'req'> {
  req: GqlAuthRequest;
}
