import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { orgMember } from './schema/org-member.schema';
import { ClientSession, Model } from 'mongoose';
import { OrgMemberSchema } from './org-members.dto';

@Injectable()
export class OrgMembersService {
  constructor(
    @InjectModel(orgMember.name) private orgMemberModel: Model<orgMember>,
  ) {}

  async createOrgMember(orgMemberDto : OrgMemberSchema, options? : {session? : ClientSession}) {
    const member = new this.orgMemberModel(orgMemberDto);
    return await member.save({session : options?.session})
  }
}
