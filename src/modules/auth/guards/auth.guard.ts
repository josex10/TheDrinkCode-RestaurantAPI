import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HandlerResponseService } from '../../../common/helpers/handler-response.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly handlerResponseService: HandlerResponseService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.handlerResponseService.handleError({
        message: 'Token not found',
        status: 401,
      });
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      request['user'] = payload.user;
    } catch (error) {
      this.handlerResponseService.handleError({
        message: 'Unauthorized Exception',
        status: 401,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request) {
    if (request.get('Authorization')) {
      const [type, token] = request.get('Authorization').split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
