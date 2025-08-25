import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  //   @IsStrongPassword()
  @IsString()
  password: string;
}

interface Ansewrs {
  answer_text?: string
  question_id: string
  option_id?: string
}

interface MembersEmails {
  email: string;
}

export class RegisterAuthDto{
  @IsEmail()
  email: string
  @IsStrongPassword()
  password: string
  @IsString()
  phone_number: string
  answers: Ansewrs[]
  member_emails: MembersEmails[]
}
