import {
  Controller,
  Get,
  HttpStatus,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guard/auth-guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  async getCurrentUser(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('invalid access token');
    }
    const user = await this.userService.getCurrentUser(req.user.sub);
    if (!user) {
      throw new UnauthorizedException('invalid access token');
    }
    return {
      statusCode: HttpStatus.ACCEPTED,
      data: user,
    };
  }
}
