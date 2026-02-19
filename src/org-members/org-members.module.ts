import { Module } from '@nestjs/common';
import { OrgMembersController } from './org-members.controller';
import { OrgMembersService } from './org-members.service';
import { MongooseModule } from '@nestjs/mongoose';
import { orgMember, orgMemberSchema } from './schema/org-member.schema';

@Module({
  imports : [MongooseModule.forFeature([{name : orgMember.name, schema : orgMemberSchema}])],
  controllers: [OrgMembersController],
  providers: [OrgMembersService],
  exports : [OrgMembersService]
})
export class OrgMembersModule {}
