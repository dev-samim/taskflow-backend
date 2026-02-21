import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { HashService } from './hash.service';
import { UsersModule } from 'src/users/users.module';
import { OrgMembersModule } from 'src/org-members/org-members.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';

@Module({
  imports : [UsersModule,OrganizationsModule,OrgMembersModule,RefreshTokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, HashService]
})
export class AuthModule {}
