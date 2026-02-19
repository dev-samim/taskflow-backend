import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import { ClientSession, Model } from 'mongoose';
import { createOrganizationDto, updateOrganizationDto } from './organizations.dto';
import slugify from 'slugify';
import {v4} from "uuid"

@Injectable()
export class OrganizationsService {
    constructor(@InjectModel(Organization.name) private organizationModel : Model<Organization>){}

    async createOrganization(createOrgDto : createOrganizationDto,  options? : {session? : ClientSession}){
        let slug = `${slugify(createOrgDto.name, {lower: true, strict: true, trim: true, })}-${v4()}`

        const isExists = await this.organizationModel.findOne({slug},null,{session : options?.session})
        if(isExists){
            throw new ConflictException("name already exists")
        }

        const organization = new this.organizationModel({
             name : `${createOrgDto.name}-org`,
             slug : slug,
             plan : "free",
        })
        await organization.save({session : options?.session})

        return organization
    }

    async getAllOrganization() {
        return await this.organizationModel.find({})
    }

    async getOrgById(id: string){
        return await this.organizationModel.findById(id)
    }

    async updateOrgById(id: string, updateOrgDto : updateOrganizationDto){
        const org = await this.organizationModel.findByIdAndUpdate(id, updateOrgDto, {returnDocument : "after"})
        return org
    }

    async deleteOrgById(id: string){
        await this.organizationModel.findByIdAndUpdate(id, {isActive : false})
    }

}
