import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateUserInput } from '@/modules/auth/account/inputs/create-user.input';
import { hash } from 'bcrypt';
import { getEnvVariables } from '@/core/config/envVariables';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll() {
    return this.prismaService.user.findMany();
  }

  public async create(input: CreateUserInput) {
    const { name, email, password } = input;
    const { rounds } = getEnvVariables();
    const isExist = await this.prismaService.user.findUnique({ where: { email } });

    if (isExist) {
      throw new ConflictException('Email уже занят');
    }

    const user = await this.prismaService.user.create({
      data: {
        name: name,
        displayName: name,
        email: email,
        password: await hash(password, rounds)
      }
    });
  }
}
