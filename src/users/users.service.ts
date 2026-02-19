import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/auth/auth.dto';
import { User } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userMdoel : Model<User>){}
    async createUser(createUserDto : CreateUserDto){
        const exists = await this.userMdoel.findOne({email : createUserDto.email})
        if(!exists){
            throw new ConflictException("Email already exists")
        }
        const user =  new this.userMdoel(createUserDto)
        return await user.save()
    }
}
