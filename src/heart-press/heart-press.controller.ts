import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { HeartPressService } from "./heart-press.service";
import { CreateHeartPressDto } from "./dto/create-heart-press.dto";
import { CurrentUser } from "src/decorators/user.decorator";
import { User } from "src/user/schema.ts/user.schema";
import { GoogleValidateGuard } from "src/auth/guard/google.guard";

@Controller("heart-press")
export class HeartPressController {
  constructor(private readonly heartPressService: HeartPressService) {}

  @Post()
  @UseGuards(GoogleValidateGuard)
  async createHeartPress(
    @Body() heartPress: CreateHeartPressDto,
    @CurrentUser() user: User,
  ) {
    if(heartPress.systolic && heartPress.diastolic && heartPress.heartRate){
      const res= await this.heartPressService.createHeartPress(heartPress, user._id);
      return res;
    }
    return new HttpException("Forbidden", HttpStatus.BAD_REQUEST,);
  }

  @Get()
  @UseGuards(GoogleValidateGuard)
  async getHeartPress(@CurrentUser() user: User) {
    return this.heartPressService.getHeartPress(user._id);
  }
}
