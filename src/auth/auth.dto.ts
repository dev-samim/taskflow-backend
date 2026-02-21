import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  
  @IsEmail()
  email: string;

  @IsString()
  username : string

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  isActive: boolean;
}

export class LoginUserDto{
  @IsEmail()
  email : string

  @IsString()
  password : string
}
