import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { OrgMembersModule } from 'src/org-members/org-members.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { HashModule } from 'src/common/hash/hash.module';
import { TokenModule } from 'src/common/token/token.module';

@Module({
  imports : [UsersModule,OrganizationsModule,OrgMembersModule,RefreshTokenModule,HashModule,TokenModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
