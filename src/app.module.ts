import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { ChatModule } from './gateways/chat/chat.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, AdminModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
