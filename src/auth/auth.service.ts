import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async validateUser(token: string) {
     const res = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
     const data = await res.json();
     return data;
    }
}
