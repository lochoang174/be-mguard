import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema.ts/user.schema";
import { Patient, PatientSchema } from "./schema.ts/patient.schema";
import { HeartPressModule } from "src/heart-press/heart-press.module";
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
})
export class UserModule {}
