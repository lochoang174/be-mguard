import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGoogleUser } from 'src/types/IGoogleUser';
import { UserService } from 'src/user/user.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService, private userService: UserService) {
    
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      accessType: 'offline',  
      prompt: 'consent' ,
      approve_prompt: 'force'
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: IGoogleUser = {
      email: emails[0].value,
    
      image: photos[0].value,
      accessToken,
    };
    const userRes= await this.userService.signin(user);
    userRes.accessToken=accessToken;
    return userRes;
  }
} 