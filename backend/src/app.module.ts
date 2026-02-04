import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RequestsModule } from './requests/requests.module';
import { DistributionModule } from './distribution/distribution.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, RequestsModule, DistributionModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
