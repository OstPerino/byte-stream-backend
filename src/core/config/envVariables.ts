import type { ConfigService } from '@nestjs/config';

export function getEnvVariables(config: ConfigService) {
  return {
    appPort: config.getOrThrow<number>('APP_PORT'),
    cookiesSecret: config.getOrThrow<string>('COOKIES_SECRET'),
    sessionSecret: config.getOrThrow<string>('SESSION_SECRET'),
    sessionName: config.getOrThrow<string>('SESSION_NAME'),
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    sessionDomain: config.getOrThrow<string>('SESSION_DOMAIN'),
    sessionMaxAge: Number(config.getOrThrow<number>('SESSION_MAX_AGE')),
    sessionHttpOnly: config.getOrThrow<boolean>('SESSION_HTTP_ONLY'),
    sessionSecure: config.getOrThrow<boolean>('SESSION_SECURE'),
    sessionFolder: config.getOrThrow<string>('SESSION_FOLDER'),
    rounds: Number(config.getOrThrow<number>('HASH_ROUNDS'))
  };
}
