import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type orgMemberDocuments = HydratedDocument<orgMember>

@Schema({timestamps : true, versionKey : false})
export class orgMember{

    @Prop({type : Types.ObjectId, required : true, index : true})
    user : Types.ObjectId

    @Prop({type : Types.ObjectId, required : true, index : true})
    org : Types.ObjectId

    @Prop({type : Types.ObjectId, required : true})
    role : Types.ObjectId

    @Prop({required : true, enum : ['INVITED' , 'ACTIVE' , 'REMOVED'], default : "INVITED"})
    status : string

}

export const orgMemberSchema = SchemaFactory.createForClass(orgMember)

orgMemberSchema.index({user : 1, index : 1},{unique : true})