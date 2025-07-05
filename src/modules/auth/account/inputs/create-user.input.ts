import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {

  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  public name: string;

  @Field()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public email: string;

  @Field()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  public password: string;
}
