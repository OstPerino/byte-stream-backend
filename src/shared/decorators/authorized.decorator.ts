import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { User } from '@prisma/generated';

import type {
  GqlAuthContext,
  GqlAuthRequest
} from '@/shared/types/gql-context.type';

export const Authorized = createParamDecorator(
  (userKey: keyof User, ctx: ExecutionContext) => {
    let user: User;

    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<GqlAuthRequest>();
      user = request.user;
    } else {
      const context = GqlExecutionContext.create(ctx);
      user = context.getContext<GqlAuthContext>().req.user;
    }

    return userKey ? user[userKey] : user;
  }
);
