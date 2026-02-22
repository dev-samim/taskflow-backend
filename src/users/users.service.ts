import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/auth/auth.dto';
import { User } from './schemas/users.schema';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel : Model<User>){}
    async createUser(createUserDto : CreateUserDto, options? : {session? : ClientSession}){
        const exists = await this.userModel.findOne({email : createUserDto.email}, null, options?.session)
        if(exists){
            throw new ConflictException("Email already exists")
        }
        const user =  new this.userModel(createUserDto)
        return await user.save({session : options?.session})
    }
    async findUserByEmail(email : string){
        return await this.userModel.findOne({email})
    }
    async getCurrentUser(id : string){
        const user = await this.userModel.findById(id).select("-passwords")
        return user

    }
}
