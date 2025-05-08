/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
