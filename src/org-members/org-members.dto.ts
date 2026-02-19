import { IsOptional, IsString } from "class-validator";


export class OrgMemberSchema{
    @IsString()
    user : string

    @IsString()
    org : string

    @IsString()
    @IsOptional()
    role : string

    @IsString()
    @IsOptional()
    status : string
}