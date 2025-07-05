import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {

  @Field()
  @IsString()
  @IsNotEmpty()
  public login: string;

  @Field()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  public password: string;
}
