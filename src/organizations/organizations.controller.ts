import { Body, Controller, HttpStatus, Param, Post, Get, Put, NotFoundException, Delete, HttpCode } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { createOrganizationDto, updateOrganizationDto } from './organizations.dto';
import { MongoIdPipe } from 'src/common/pipe/mongo-id/mongo-id.pipe';

@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Post()
  async createOrganization(@Body() createOrgDto: createOrganizationDto) {
    const org =
      await this.organizationsService.createOrganization(createOrgDto);
    await org.save();
    return {
      statusCode: HttpStatus.OK,
      data: org,
    };
  }

  @Get()
  async getAllOrgs(){
    const orgs = await this.organizationsService.getAllOrganization()
    return {
      statusCode : HttpStatus.OK,
      data : orgs
    }
  }

  @Get(':id')
  async getOrgById(@Param('id', MongoIdPipe) id: string) {
    const org = await this.organizationsService.getOrgById(id);
    if(!org){
      throw new NotFoundException()
    }
    return {
      statusCode: HttpStatus.OK,
      data: org,
    };
  }

  @Put(":id")
  async updateOrgById(@Param('id', MongoIdPipe) id: string, @Body() updateOrgDto : updateOrganizationDto){
    const org = await this.organizationsService.updateOrgById(id, updateOrgDto)
   return {
      statusCode: HttpStatus.OK,
      data: org,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async deleteOrgById(@Param('id', MongoIdPipe) id: string){
    await this.organizationsService.deleteOrgById(id)
  }
  
}
