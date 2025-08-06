import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('send-otp')
  async sendOtp(@Body() body: SendOtpDto) {
    try {
      return await this.authService.sendOtp(body);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post()
  async verifyOtp() {}
  @Post()
  async register() {}
  @Post()
  async login() {}
  @Post()
  async logout() {}
}
