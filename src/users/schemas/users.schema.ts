import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({required : true})
  username :string

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop()
  lastLogin : Date
}


export const UserSchema = SchemaFactory.createForClass(User)

