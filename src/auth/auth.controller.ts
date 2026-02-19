import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("signup")
  async signup(@Body() createUserDto :  CreateUserDto){
    const onboarding = await this.authService.createUser(createUserDto)
  } 

}
