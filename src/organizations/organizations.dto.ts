import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class createOrganizationDto{

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name : string

}

export class updateOrganizationDto{

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name : string

}