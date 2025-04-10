import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as PassportStrategyBase } from "passport-strategy";
import { UnauthorizedException } from "@nestjs/common";
import * as fetch from "node-fetch";
import { UserService } from "src/user/user.service";

interface IStrategyOptions {
  passReqToCallback?: boolean;
}

@Injectable()
export class GoogleValidateStrategy extends PassportStrategy(
  PassportStrategyBase,
  "googleValidate",
) {
  constructor(private userService: UserService) {
    super();
  }

  async authenticate(req: any, options?: IStrategyOptions) {
    try {
      const token = req.token;

      if (!token) {
        (this as any).fail(new UnauthorizedException("Token is missing"));
        return;
      }

      // Validate the token
      const user = await this.validateUser(token);
      if (!user) {
        (this as any).fail(
          new UnauthorizedException("Token is invalid or expired"),
        );
        return;
      }

      (this as any).success(user);
    } catch (error) {
      (this as any).fail(
        new UnauthorizedException("Token is invalid or expired"),
      );
    }
  }

  // Hàm xác thực token với Google API
  async validateUser(token: string) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );
      if (!res.ok) { 
        return null;
      }

      const data = await res.json();

      if (data.error) {
        return null;
      }
      const user = await this.userService.findByEmail(data.email);
      return user; // Trả về thông tin người dùng từ Google
    } catch (error) {
      console.error("Error validating Google token:", error);
      return null;
    }
  }
}
