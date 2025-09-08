import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/create-auth.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifySmsCodeDto } from './dto/verify.sms.code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('send-otp')
  @HttpCode(200)
  async sendOtp(@Body() body: SendOtpDto) {
    try {
      return await this.authService.sendOtp(body);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() body: VerifySmsCodeDto) {
    const { phone_number, code } = body;
    try {
      return await this.authService.verifyOtp(phone_number, code);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Get('check')
  async checkAuth(@Req() req: Request) {
    const token = req.cookies['token'];
    if (!token) return false;
    return true;
  }

  @Post('register')
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.register(registerAuthDto);
    res.cookie('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    });
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(loginAuthDto);

    res.cookie('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    });

    return { token };
  }
  @Post()
  async logout() {}
}
