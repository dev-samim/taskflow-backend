import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrgMembersModule } from './org-members/org-members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    MongooseModule.forRoot(process.env.DB_URL!),
    OrganizationsModule,
    UsersModule,
    AuthModule,
    OrgMembersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
