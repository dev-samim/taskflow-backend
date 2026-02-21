import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from 'src/auth/jwt.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
   canActivate(context: ExecutionContext): boolean {
     const req = context.switchToHttp().getRequest();
     const token = req.cookies['refreshToken'];
     if (!token) {
       return true
     }
     const payload = this.jwtService.verifyRefreshToken(token);
     req.refreshToken = payload as { sub : string, jti : string };
     return true;
   }
}
