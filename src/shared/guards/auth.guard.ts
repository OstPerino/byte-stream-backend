import {
  CanActivate,
  type ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { PrismaService } from '@/core/prisma/prisma.service';
import { GqlAuthContext } from '@/shared/types/gql-context.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<GqlAuthContext>().req;
    const userId = request.session.userId;

    if (typeof userId === 'undefined') {
      throw new UnauthorizedException('Доступ закрыт');
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    request.user = user;
    return true;
  }
}
