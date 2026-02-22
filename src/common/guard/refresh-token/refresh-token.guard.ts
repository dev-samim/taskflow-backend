import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/common/token/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
   canActivate(context: ExecutionContext): boolean {
     const req = context.switchToHttp().getRequest();
     const token = req.cookies['refreshToken'];
     if (!token) {
       return true
     }
     const payload = this.tokenService.verifyRefreshToken(token);
     req.refreshToken = payload as { sub : string, jti : string };
     return true;
   }
}
