import { Controller, Post, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Patient } from './schema.ts/patient.schema';
import { GoogleValidateGuard } from 'src/auth/guard/google.guard';
import { User } from './schema.ts/user.schema';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create-patient")
  @UseGuards(GoogleValidateGuard)
  async createPatient(@Body() patient: CreatePatientDto, @CurrentUser() user: User) {
    return this.userService.createPatient(patient, user._id);
  }

  @Get("get-patient")
  @UseGuards(GoogleValidateGuard)
  async getPatient(@CurrentUser() user: User) {
    return this.userService.getPatient(user._id);
  }

  @Patch("update-patient")
  @UseGuards(GoogleValidateGuard)
  async updatePatient(@Body() patient: UpdatePatientDto, @CurrentUser() user: User) {
    return this.userService.updatePatient( user._id,patient);
  }
}
