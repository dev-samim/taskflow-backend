import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrgMembersModule } from './org-members/org-members.module';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './logger/logger.config';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { TokenModule } from './common/token/token.module';
import { HashModule } from './common/hash/hash.module';

@Module({
  imports: [
     WinstonModule.forRoot(winstonOptions),
    ConfigModule.forRoot({
      isGlobal : true
    }),
    MongooseModule.forRoot(process.env.DB_URL!),
    OrganizationsModule,
    UsersModule,
    AuthModule,
    OrgMembersModule,
    RefreshTokenModule,
    TokenModule,
    HashModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
