import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  async signup(@Body() createUserDto :  CreateUserDto){
    const onboardingData = await this.authService.createUser(createUserDto)
    return {
      statusCode : HttpStatus.CREATED,
      data : onboardingData
    }
  } 

}
