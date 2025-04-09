import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })

export class User {
  _id: string;
  @Prop({ required: false, default: "", unique: false })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: "patient", enum: ["patient", "doctor"] })
  role: string;

  @Prop({ default: false })
  isUpdateInfo: boolean;

  @Prop()
  image: string;

  @Prop()
  accessToken: string;

  @Prop({ default: null, type: mongoose.Schema.Types.ObjectId, ref: "Patient" })
  idPatient?: mongoose.Schema.Types.ObjectId;


}

export const UserSchema = SchemaFactory.createForClass(User);
