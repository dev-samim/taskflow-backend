import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type organizationDocument = HydratedDocument<Organization>


@Schema({timestamps : true , versionKey : false})
export class Organization{

    @Prop({required : true})
    name : string

    @Prop({required : true, unique : true, index : true})
    slug : string

    @Prop({required : true, enum : ["free", "pro", "enterprise"]})
    plan : string
    
    @Prop({required : true, default : true})
    isActive : boolean
}

export const organizationSchema = SchemaFactory.createForClass(Organization)

// Organization {
//   _id: ObjectId
//   name: string              // display name
//   slug: string              // unique, URL-safe
//   plan: 'free' | 'pro' | 'enterprise'
//   isActive: boolean
//   createdAt: Date
// }
