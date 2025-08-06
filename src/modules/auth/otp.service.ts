import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/core/database/redis.service';
import { EskizService } from './eskiz.service';
import generateOtp from 'src/utils/generate-otp';
@Injectable()
export class OtpService {
  private ttlExpireOtp: number = 60;
  private hourlyTTLExpireOtp: number = 3600;
  private hourlyOtpAttempts = 10;
  constructor(
    private redisService: RedisService,
    private eskizService: EskizService,
  ) {}

  async canSmsRequest(phone_number: string) {
    const key = `otp:${phone_number}`;
    const keyExists = await this.redisService.redis.exists(key);
    if (keyExists) {
      const ttl = await this.redisService.getTTLKey(key);
      throw new BadRequestException(`Please try again later ${ttl}`);
    }
  }

  async sendSms(phone_number: string) {
    await this.canSmsRequest(phone_number);
    await this.checkSmsLimit(phone_number);
    const otpCode = generateOtp();
    await this.eskizService.sendSms(phone_number, otpCode);
    const key = `otp:${phone_number}`;
    await this.redisService.addKey(key, otpCode, this.ttlExpireOtp);
    await this.trackSmsRequest(phone_number);
    return {
      message: 'otp sended',
    };
  }
  async checkSmsLimit(key: string) {
    const otpKeyHourly = `otp_attempts_hourly:${key}`;
    const valueOtpHourly = await this.redisService.getKeyValue(otpKeyHourly);
    if (valueOtpHourly && +valueOtpHourly > this.hourlyOtpAttempts)
      throw new BadRequestException('otp hourly limit reached');
  }
  async trackSmsRequest(key: string) {
    const keyOtpHourly = `otp_attempts_hourly:${key}`;
    await this.redisService.incrementKey(keyOtpHourly);
    await this.redisService.setExpireKey(keyOtpHourly, this.hourlyTTLExpireOtp);
  }
}
