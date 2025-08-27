import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpService } from './otp.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private otpService: OtpService,
    private users: UsersService,
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async sendOtp(body: SendOtpDto) {
    const { phone_number } = body;
    const data = await this.otpService.sendSms(phone_number);
    return data;
  }
  async verifyOtp(phone_number: string, code: string) {
    await this.otpService.isBlockedUser(phone_number);
    await this.otpService.verifyOtpCode(phone_number, code);
    return {
      message: 'success',
    };
  }
  async register(registerAuthDto: RegisterAuthDto) {
    await this.users.checkPhoneNumber(registerAuthDto.phone_number);
    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 12);
    const newUser = await this.db.prisma.user.create({
      data: {
        phone_number: registerAuthDto.phone_number,
        password: hashedPassword,
        email: registerAuthDto.email,
      },
    });
    registerAuthDto.answers.map(async (answer) => {
      const newAnswer = await this.db.prisma.userProfileQuestionAnswers.create({
        data: {
          question_id: answer.question_id,
          answer_text: typeof answer.value === 'string' ? answer.value : null,
          user_id: newUser.id,
        },
      });
      if (Array.isArray(answer.value)) {
        answer.value.map(async (value) => {
          return await this.db.prisma.selectedAnswerOptions.create({
            data: {
              option_id: value as string,
              answer_id: newAnswer.id,
            },
          });
        });
      }
    });
    registerAuthDto.members.map(async (member) => {
      const existUser = await this.db.prisma.user.findFirst({
        where: {
          email: member,
        },
      });
      if (existUser) {
        const expireAt = new Date();
        expireAt.setHours(2);
        const iToken = await this.createToken();
        await this.db.prisma.memberInvitations.create({
          data: {
            email: member,
            expires_at: expireAt,
            invitation_token: iToken,
            invited_by_user_id: newUser.id,
          },
        });
      }
    });
    const token = await this.jwt.signAsync({ user_id: newUser.id });
    return token;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const findEmail = await this.db.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });

    if (!findEmail) throw new NotFoundException('Email or password incorrect');

    const comparePassword = await bcrypt.compare(
      loginAuthDto.password,
      findEmail.password,
    );

    if (!comparePassword)
      throw new NotFoundException('Email or password incorrect');

    const token = await this.jwt.signAsync({ userId: findEmail.id });

    return token;
  }

  async logout() {}

  async createToken() {
    return uuid();
  }
}
