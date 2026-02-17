import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import { Model } from 'mongoose';
import { createOrganizationDto, updateOrganizationDto } from './organizations.dto';
import slugify from 'slugify';

@Injectable()
export class OrganizationsService {
    constructor(@InjectModel(Organization.name) private organizationModel : Model<Organization>){}

    async createOrganization(createOrgDto : createOrganizationDto){
        let slug = slugify(createOrgDto.name, {lower: true, strict: true, trim: true, });

        const isExists = await this.organizationModel.findOne({slug})
        if(isExists){
            throw new ConflictException("name already exists")
        }

        const organization = await new this.organizationModel({
             name : createOrgDto.name,
             slug : slug,
             plan : "free",
        })

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
