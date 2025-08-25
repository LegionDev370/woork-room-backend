import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EskizService } from './eskiz.service';
import { OtpService } from './otp.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/core/database/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EskizService, OtpService,UsersService],
})
export class AuthModule {}
