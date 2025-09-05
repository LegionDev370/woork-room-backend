import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { WsGuard } from 'src/common/guards/ws.guard';

interface IUser {
  email: string;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: true,
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  pingInterval: 25000,
  pingTimeout: 10000,
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  users: Map<string, IUser> = new Map();
  afterInit(server: Server) {}
  handleConnection(client: Socket, ...args: any[]) {
    const socketId = client.id;
    console.log(socketId);
    if (!this.users.has(socketId)) {
      this.users.set(socketId, {
        email: 'domla', 
      });
    }
  }
  handleDisconnect(client: Socket) {}
  @UseGuards(WsGuard)
  @SubscribeMessage('message')
  handleMessage() {}
}
