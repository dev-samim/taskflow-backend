import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from "bcrypt"

@Injectable()
export class HashService {
    constructor(private configService : ConfigService){}
    async hash(password : string){
        const salt = Number(this.configService.get("HASH_SALT"))
        return await bcrypt.hash(password, salt)
    }
    async compare(password : string, hashPassword : string){
        return await bcrypt.compare(password,hashPassword)
    }
}
