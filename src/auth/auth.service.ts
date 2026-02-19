import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './auth.dto';
import { UsersService } from 'src/users/users.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrgMembersService } from 'src/org-members/org-members.service';
import { Connection } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private orgService: OrganizationsService,
    private orgMemberService: OrgMembersService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    //create and start session
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // create User
      const user = await this.userService.createUser(createUserDto, {session});

      //create org
      const org = await this.orgService.createOrganization({
        name: user.username
      }, {session});

      //create org member
      const orgMember = await this.orgMemberService.createOrgMember({
        user: user.id,
        role: 'ADMIN',
        status: 'ACTIVE',
        org: org.id
      }, {session});

      session.commitTransaction();

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        org: {
          id: org.id,
          name: org.name,
          slug: org.slug,
        },
      };
    } catch (error) {
      console.log(error);
      session.abortTransaction();
      if (error instanceof HttpException){
        throw error
      }
      throw new InternalServerErrorException(
        'Failed to create user and organization',
      );
    }
  }
}
