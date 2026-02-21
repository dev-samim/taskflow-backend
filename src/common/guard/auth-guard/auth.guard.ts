import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from 'src/auth/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('invalid token');
    }
    const payload = this.jwtService.verifyAccessToken(token);
    req.user = payload as { id: string; username: string; email: string };
    return true;
  }
}
