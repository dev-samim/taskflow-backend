import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthService.name);

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`POST /auth/signup request received`);
    const onboardingData = await this.authService.createUser(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: onboardingData,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(`POST /auth/login request received`);
    const user = await this.authService.loginUser(loginUserDto);
    res
      .cookie('accessToken', user.accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .cookie('refreshToken', user.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

    return {
      statusCode: HttpStatus.ACCEPTED,
      data: {
        email: user.user.email,
        username: user.user.username,
        accessToken: user.accessToken,
      },
    };
  }
}
