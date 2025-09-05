import { CanActivate, ExecutionContext } from '@nestjs/common';

export class WsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const wsRequest = context.switchToWs();
    const client = wsRequest.getClient();
    const token = client.headers.cookie;
    console.log(token);
    return false;
  }
}
