import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { UsersService } from 'src/users/users.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrgMembersService } from 'src/org-members/org-members.service';
import { Connection } from 'mongoose';
import { JwtService } from './jwt.service';
import { HashService } from './hash.service';
import  { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private orgService: OrganizationsService,
    private orgMemberService: OrgMembersService,
    private hashService: HashService,
    private jwtService: JwtService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async createUser(createUserDto: CreateUserDto) {
    //create and start session
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // create User
      const hashedPassword = await this.hashService.hash(
        createUserDto.password,
      );
      const user = await this.userService.createUser(
        { ...createUserDto, password: hashedPassword },
        { session },
      );
      this.logger.log(`User created successfully | userId=${user.id}`);

      //create org
      const org = await this.orgService.createOrganization(
        {
          name: user.username,
        },
        { session },
      );
      this.logger.log(`Org created successfully | orgId=${org.id}`);

      //create org member
      const orgMember = await this.orgMemberService.createOrgMember(
        {
          user: user.id,
          role: 'ADMIN',
          status: 'ACTIVE',
          org: org.id,
        },
        { session },
      );
      this.logger.log(`OrgMember created successfully | orgMemberId=${orgMember.id}`);

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
      await session.abortTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create user and organization',
      );
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Username or Password is invalid');
    }

    const verifyPassword = await this.hashService.compare(
      loginUserDto.password,
      user.password,
    );

    if (!verifyPassword) {
      throw new UnauthorizedException('Username or Password is invalid');
    }

    const accessToken = this.jwtService.signAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = this.jwtService.signRefreshToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });
     this.logger.log("Generated new refresh token and access token & User login successful")

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
