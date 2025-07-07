import { Query, Mutation, Resolver, Args } from '@nestjs/graphql';

import { AccountService } from './account.service';
import { UserModel } from '@/modules/auth/account/models/user.model';
import { CreateUserInput } from '@/modules/auth/account/inputs/create-user.input';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { Authorization } from '@/shared/decorators/auth.decorator';

@Resolver('Account')
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel, { name: 'getProfile' })
  public async me(@Authorized('id') id: string) {
    return this.accountService.me(id);
  }

  @Mutation(() => Boolean, { name: 'createUser' })
  public async create(@Args('data') input: CreateUserInput) {
    return this.accountService.create(input);
  }
}
