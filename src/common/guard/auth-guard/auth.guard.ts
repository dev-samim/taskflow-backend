import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/common/token/token.service'; 

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('invalid token');
    }
    const payload = this.tokenService.verifyAccessToken(token);
    req.user = payload as { sub : string };
    return true;
  }
}
