import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import RedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import type { Store } from 'express-session';

import { getEnvVariables } from '@/core/config/envVariables';
import { CoreModule } from '@/core/core.module';
import { RedisService } from '@/core/redis/redis.service';
import { isDev } from '@/shared/utils/is-dev';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const config = app.get(ConfigService);
  const redis = app.get(RedisService);
  const {
    appPort,
    origin,
    cookiesSecret,
    sessionSecret,
    sessionName,
    sessionDomain,
    sessionMaxAge,
    sessionHttpOnly,
    sessionSecure,
    sessionFolder
  } = getEnvVariables(config);

  app.use(cookieParser(cookiesSecret));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  app.use(
    session({
      secret: sessionSecret,
      name: sessionName,
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: sessionDomain,
        maxAge: sessionMaxAge,
        httpOnly: Boolean(sessionHttpOnly),
        secure: !isDev() && Boolean(sessionSecure),
        sameSite: 'lax'
      },
      store: new RedisStore({
        client: redis,
        prefix: sessionFolder
      }) as Store
    })
  );

  app.enableCors({
    origin,
    credentials: true,
    exposedHeaders: ['set-cookie']
  });

  await app.listen(appPort);
}

bootstrap().catch((err) => console.log(err));
