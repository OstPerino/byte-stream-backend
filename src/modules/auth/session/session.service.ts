import { compare } from 'bcrypt';
import type { Request } from 'express';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './inputs/login.input';
import { getSessionMetadata } from '@/shared/utils/getSessionMetadata';
import { RedisService } from '@/core/redis/redis.service';
import type { ExpressSessionData } from '@/shared/types/express-session';

@Injectable()
export class SessionService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException('Пользователь не найден');
    }

    const keys = await this.redisService.keys('*');

    if (!keys) {
      throw new NotFoundException('Сессия не найдена');
    }

    const userSessions: ExpressSessionData[] = [];

    for (const key of keys) {
      const sessionData = await this.redisService.get(key);

      if (sessionData) {
        const session = JSON.parse(sessionData) as ExpressSessionData;

        if (session.userId === userId) {
          userSessions.push({ ...session, id: key.split(':')[1] });
        }
      }
    }

    userSessions.sort(
      (a, b) => +b.createdAt - +a.createdAt
    );

    return userSessions.filter((session) => session.id !== req.session.id);
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id;
    const sessionFolder = this.configService.getOrThrow<string>('SESSION_FOLDER');
    const sessionData = await this.redisService.get(`${sessionFolder}${sessionId}`);
    if (!sessionData) throw new Error('Сессия не найдена');
    const session = JSON.parse(sessionData) as ExpressSessionData;

    return {
      ...session,
      id: sessionId
    };
  }

  public async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password } = input;
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { name: { equals: login } },
          { email: { equals: login } }
        ]
      }
    });

    if (!user) {
      throw new NotFoundException('Пользователь с таким именем не найден');
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неправильный пароль');
    }

    const metadata = getSessionMetadata(req, userAgent);

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;
      req.session.metadata = metadata;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить сессию'
            )
          );
        }

        resolve(user);
      });
    });
  }

  public async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию'
            )
          );
        }

        const sessionName = this.configService.getOrThrow<string>('SESSION_NAME');
        req.res?.clearCookie(sessionName);

        resolve(true);
      });
    });
  }

  public clearSession(req: Request) {
    const sessionName = this.configService.getOrThrow<string>('SESSION_NAME');

    req.res?.clearCookie(sessionName);

    return true;
  }

  public async remove(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException('Нельзя удалить текущую сессию');
    }

    const sessionFolder = this.configService.getOrThrow<string>('SESSION_FOLDER');

    await this.redisService.del(`${sessionFolder}${id}`);

    return true;
  }
}
