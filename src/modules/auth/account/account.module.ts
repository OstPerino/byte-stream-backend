import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AccountResolver, AccountService],
  imports: [ConfigModule]
})
export class AccountModule {}
