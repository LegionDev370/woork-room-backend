import { IsArray, IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

interface Answers {
  value: string | Array<string>;
  question_id: string;
}

export class RegisterAuthDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  phone_number: string;
  @IsArray()
  answers: Answers[];
  @IsArray()
  members: Array<string>;
}
