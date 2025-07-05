import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateUserInput } from '@/modules/auth/account/inputs/create-user.input';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  public async findAll() {
    return this.prismaService.user.findMany();
  }

  public async create(input: CreateUserInput) {
    const { name, email, password } = input;
    const isExist = await this.prismaService.user.findUnique({ where: { email } });
    const rounds = Number(this.configService.getOrThrow<number>('HASH_ROUNDS'));

    if (isExist) {
      throw new ConflictException('Email уже занят');
    }

    await this.prismaService.user.create({
      data: {
        name: name,
        displayName: name,
        email: email,
        password: await hash(password, rounds)
      }
    });

    return true;
  }
}
