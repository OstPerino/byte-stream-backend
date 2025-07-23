import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { User } from '@prisma/generated';

import type {
  GqlAuthContext,
  GqlAuthRequest
} from '@/shared/types/gql-context.type';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<GqlAuthRequest>();
      return request.headers['user-agent'];
    } else {
      const context = GqlExecutionContext.create(ctx);
      return context.getContext<GqlAuthContext>().req.headers['user-agent'];
    }
  }
);
