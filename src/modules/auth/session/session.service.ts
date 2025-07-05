import { compare } from 'bcrypt';
import type { Request } from 'express';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './inputs/login.input';

@Injectable()
export class SessionService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async login(req: Request, input: LoginInput) {
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

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date().toISOString();
      req.session.userId = String(user.id);

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
          reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию'
            )
          );
        }
        console.log('session destroyed');

        const sessionName = this.configService.getOrThrow<string>('SESSION_NAME');
        req.res?.clearCookie(sessionName);

        resolve(true);
      });
    });
  }
}
