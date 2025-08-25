import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}
  async me(userId: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!findUser) throw new NotFoundException('Information not found');

    return findUser;
  }
  async checkEmail(email: string) {
    const emailExists = await this.db.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (emailExists) return false;
    return true;
  }

  async checkPhoneNumber(phone_number: string) {
    const phoneNumberExists = await this.db.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (phoneNumberExists)
      throw new ConflictException('Phone_number already exists');
    return true;
  }
}
