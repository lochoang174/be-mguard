import { Controller, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "src/user/schema.ts/user.schema";
import { CurrentUser } from "src/decorators/user.decorator";
import { GoogleValidateGuard } from "./guard/google.guard";
import { Response } from "express";
import { ConfigService } from '@nestjs/config';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService,private configService: ConfigService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@CurrentUser() user: User, @Res() res: Response) {
    console.log("User: "+user);
    res.cookie("access_token", user.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
      sameSite: "none", // <-- MUST be 'none' for cross-site cookies
      secure: true,  
    });

    const frontendUrl = this.configService.get<string>('FE_URL');
    return res.redirect(frontendUrl);    // Redirect to the client application
  }

  @Get("info")
  @UseGuards(GoogleValidateGuard)
  getInfo(@CurrentUser() user: User) {
    return user;
  }
}
