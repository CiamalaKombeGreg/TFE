import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import googleOauthConfig from './config/google-oauth.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(googleOauthConfig)],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
