import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';

import { GoogleValidateStrategy } from './strategy/googleValidate.strategy';
@Module({
  imports: [ConfigModule, UserModule, PassportModule],
  providers: [GoogleStrategy, AuthService, GoogleValidateStrategy],
  controllers: [AuthController],
})
export class AuthModule {}