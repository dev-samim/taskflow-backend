import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organization,
  organizationSchema,
} from './schemas/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: organizationSchema },
    ]),
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports : [OrganizationsService]
})
export class OrganizationsModule {}
