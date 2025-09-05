import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')  
  @UseGuards(AuthGuard)
  async me(@Req() req: Request) {
    const userId = req['userId'];

    const user = await this.usersService.me(userId);

    return { user };
  }
  @Post('user/email-check')
  @HttpCode(200)
  async checkEmail(@Body() data: { email: string }) {
    return await this.usersService.checkEmail(data.email);
  }
}
