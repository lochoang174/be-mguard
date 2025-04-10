import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import mongoose from "mongoose";

export type HeartPressDocument = HeartPress & Document;
export enum HeartPressStatus {
  NORMAL = "normal",
  WARNING = "warning",
  DANGER = "danger",
  POSSIBLE_ERROR = "possible_error",
}
@Schema({ timestamps: true })
export class HeartPress {
  @Prop({ required: false })
  diastolic: number;

  @Prop({ required: false })
  systolic: number;

  @Prop({ required: false })
  heartRate: number;

  @Prop({ required: false, type: String, enum: HeartPressStatus })
  status: HeartPressStatus;

  @Prop({ required: false })
  note?: string;
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userId: mongoose.Types.ObjectId;
}

export const HeartPressSchema = SchemaFactory.createForClass(HeartPress);
