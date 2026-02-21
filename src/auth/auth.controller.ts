import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import type { Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth-guard/auth.guard';
import { RefreshTokenGuard } from 'src/common/guard/refresh-token/refresh-token.guard';

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
      .cookie('refreshToken', user.refreshTokenJwt, {
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

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("logout")
  async logout(@Req() req, @Res({passthrough : true}) res : Response){
    if(!req.refreshToken){
      res.clearCookie("accessToken").clearCookie("refreshToken")
      return
    }
    await this.authService.logout(req.refreshToken.sub,req.refreshToken.jti)
    res.clearCookie("accessToken").clearCookie("refreshToken")
  }
}
