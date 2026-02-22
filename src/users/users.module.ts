import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { TokenModule } from 'src/common/token/token.module';

@Module({
  imports : [MongooseModule.forFeature([{name : User.name,  schema : UserSchema}]), TokenModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports : [UsersService]
})
export class UsersModule {}
