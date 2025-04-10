import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
 


  @Prop({ required: false })
  fullName: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false })
  birthDate: Date;

  // Thông tin thai kỳ
  @Prop({ required: false })
  pregnancyNumber: number; // Con lần thứ mấy

  @Prop({ required: false })
  gestationalAgeAtBirth: number; // Tuổi thai lúc sinh (tuần)

  // Bệnh lý trong thai kỳ
  @Prop({
    type: [String],
    enum: [
      "THA thai kỳ",
      "THA mạn tính",
      "Tiền sản giật",
      "Tiền sản giật/THA mạn tính",
    ],
    default: [],
  })
  pregnancyConditions: string[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
