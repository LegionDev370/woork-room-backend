import { Injectable } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(private otpService: OtpService) {}
  async sendOtp(body: SendOtpDto) {
    const { phone_number } = body;
    const data = await this.otpService.sendSms(phone_number);
    return data;
  }
  async verifyOtp() {}
  async register() {}
  async login() {}
  async logout() {}
}
