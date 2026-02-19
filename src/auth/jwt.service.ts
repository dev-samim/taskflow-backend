import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  signAccessToken(payload) {
    const accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
    const accessTokenExpireIn = this.configService.get(
      'ACCESS_TOKEN_EXPIRE_IN',
    );
    const token = jwt.sign(payload, accessTokenSecret!, {
      expiresIn: accessTokenExpireIn,
    });
    return token;
  }
  signRefreshToken(payload) {
    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    const refreshTokenExpireIn = this.configService.get(
      'REFRESH_TOKEN_EXPIRE_IN',
    );
    const token = jwt.sign(payload, refreshTokenSecret!, {
      expiresIn: refreshTokenExpireIn,
    });
    return token;
  }
  verifyAccessToken(token: string) {
    try {
      const accessTokenSecret = this.configService.get<string>(
        'ACCESS_TOKEN_SECRET',
      );
      const payload = jwt.verify(token, accessTokenSecret!);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('invalid access token');
    }
  }
  verifyRefreshToken(token: string) {
    try {
      const refreshTokenSecret = this.configService.get<string>(
        'REFRESH_TOKEN_SECRET',
      );
      const payload = jwt.verify(token, refreshTokenSecret!);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('invalid refresh token');
    }
  }
}
