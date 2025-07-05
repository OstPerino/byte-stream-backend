import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { LoginInput } from '@/modules/auth/session/inputs/login.input';
import type { GqlContext } from '@/shared/types/gql-context.type';
import { UserModel } from '@/modules/auth/account/models/user.model';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => UserModel, { name: 'loginUser' })
  public async login(@Context() { req }: GqlContext, @Args('data') input: LoginInput) {
    return this.sessionService.login(req, input);
  }

  @Mutation(() => Boolean, { name: 'logoutUser' })
  public async logout(@Context() { req }: GqlContext) {
    return this.sessionService.logout(req);
  }
}