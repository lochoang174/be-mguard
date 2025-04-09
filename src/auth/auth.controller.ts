import { Controller, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "src/user/schema.ts/user.schema";
import { CurrentUser } from "src/decorators/user.decorator";
import { GoogleValidateGuard } from "./guard/google.guard";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@CurrentUser() user: User, @Res() res: Response) {
    console.log(user);
    res.cookie("access_token", user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
      sameSite: "lax", // Helps with CSRF protection
    });

    // Redirect to the client application
    return res.redirect("http://localhost:3000");
  }

  @Get("info")
  @UseGuards(GoogleValidateGuard)
  getInfo(@CurrentUser() user: User) {
    return user;
  }
}
