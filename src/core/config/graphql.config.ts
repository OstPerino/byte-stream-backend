import { type ApolloDriverConfig } from '@nestjs/apollo';
import { type ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { join } from 'path';

import { getEnvVariables } from '@/core/config/envVariables';
import { isDev } from '@/shared/utils/is-dev';

export function getGraphQLConfig(
  configService: ConfigService
): ApolloDriverConfig {
  const { gqlPrefix } = getEnvVariables(configService);

  return {
    playground: isDev(),
    path: gqlPrefix,
    autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
    sortSchema: true,
    context: ({ req, res }: { req: Request; res: Response }) => ({ req, res })
  };
}
