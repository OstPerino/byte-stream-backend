import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

import { getEnvVariables } from '@/core/config/envVariables';
import { CoreModule } from '@/core/core.module';
import { RedisService } from '@/core/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const config = app.get(ConfigService);
  const {
    cookiesSecret,
    sessionSecret,
    sessionName,
    appPort,
    sessionDomain,
    sessionMaxAge,
    sessionHttpOnly,
    sessionSecure,
    sessionFolder,
    origin
  } = getEnvVariables(config);
  const redis = app.get(RedisService);

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
        httpOnly: sessionHttpOnly,
        secure: sessionSecure,
        sameSite: 'lax'
      },
      store: new RedisStore({
        client: redis,
        prefix: sessionFolder
      })
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
