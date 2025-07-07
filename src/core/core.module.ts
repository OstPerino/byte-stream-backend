import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { isDev } from '@/shared/utils/is-dev';
import { getGraphQLConfig } from '@/core/config/graphql.config';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AccountModule } from '@/modules/auth/account/account.module';
import { SessionModule } from '@/modules/auth/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !isDev(),
      isGlobal: true
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService]
    }),
    PrismaModule,
    RedisModule,
    AccountModule,
    SessionModule
  ]
})
export class CoreModule {}
