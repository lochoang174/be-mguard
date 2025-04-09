import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  HeartPress,
  HeartPressDocument,
  HeartPressStatus,
} from "./heart-press.schema";
import { Model } from "mongoose";
import { UserService } from "src/user/user.service";
import mongoose from "mongoose";
import { CreateHeartPressDto } from "./dto/create-heart-press.dto";

@Injectable()
export class HeartPressService {
  constructor(
    @InjectModel(HeartPress.name)
    private heartPressModel: Model<HeartPressDocument>,
    private userService: UserService,
  ) {}

  private calculateStatusAndNote(
    currentSystolic: number,
    currentDiastolic: number,
    currentHeartRate: number,
    baseline: { systolic: number; diastolic: number; heartRate: number },
  ): { status: HeartPressStatus; note: string } {
    // Step 1: Calculate deltas
    const deltaSBP = currentSystolic - baseline.systolic;
    const deltaDBP = currentDiastolic - baseline.diastolic;
    const deltaHR = currentHeartRate - baseline.heartRate;

    // Step 2: Calculate false measurement probability
    const beta0 = -5;
    const beta1 = 0.05;
    const beta2 = 0.02;
    const beta3 = 0.1;
    const beta4 = 0.001;

    const score =
      beta0 +
      beta1 * deltaSBP +
      beta2 * deltaDBP +
      beta3 * deltaHR +
      beta4 * (deltaSBP * deltaHR);

    const falseBPProbability = 1 / (1 + Math.exp(-score));

    // Step 3: Determine status and note
    if ( falseBPProbability >= 0.7 || currentSystolic <= currentDiastolic) {
      return {
        status: HeartPressStatus.POSSIBLE_ERROR,
        note: "Có thể phép đo không chính xác. Khuyến nghị đo lại sau khi nghỉ ngơi.",
      };
    }

    // Step 4: Classify blood pressure based on medical standards
    if (currentSystolic < 90 || currentDiastolic < 60) {
      return {
        status: HeartPressStatus.WARNING,
        note: "Huyết áp thấp. Nếu có triệu chứng như chóng mặt, mệt mỏi, hãy tham khảo ý kiến bác sĩ.",
      };
    } else if (currentSystolic < 120 && currentDiastolic < 80) {
      return {
        status: HeartPressStatus.NORMAL,
        note: "Huyết áp bình thường. Duy trì lối sống lành mạnh.",
      };
    } else if (currentSystolic < 130 && currentDiastolic < 80) {
      return {
        status: HeartPressStatus.WARNING,
        note: "Huyết áp cao bình thường. Cân nhắc thay đổi lối sống: giảm muối, tăng vận động.",
      };
    } else if (currentSystolic < 140 && currentDiastolic < 90) {
      return {
        status: HeartPressStatus.WARNING,
        note: "Tăng huyết áp giai đoạn 1. Nên tham khảo ý kiến bác sĩ và thay đổi lối sống.",
      };
    } else if (currentSystolic < 180 && currentDiastolic < 120) {
      return {
        status: HeartPressStatus.DANGER,
        note: "Tăng huyết áp giai đoạn 2. Cần tham khảo ý kiến bác sĩ sớm.",
      };
    } else {
      return {
        status: HeartPressStatus.DANGER,
        note: "Tăng huyết áp nghiêm trọng. Cần được chăm sóc y tế khẩn cấp.",
      };
    }
  }

  async createHeartPress(
    heartPress: CreateHeartPressDto,
    userId: string,
  ){
    try {
      // Get baseline values (averages)
      const baseline = await this.getAverageIndicators(userId);

      // Calculate status and note
      const { status, note } = this.calculateStatusAndNote(
        heartPress.systolic,
        heartPress.diastolic,
        heartPress.heartRate,
        baseline,
      );

      // Create new heart press record with calculated status and note
      const newHeartPress = new this.heartPressModel({
        ...heartPress,
        userId: new mongoose.Types.ObjectId(userId),
        status,
        note,
      });

      const result=await newHeartPress.save();
      return result;
    } catch (error) {
      return false;
    }
  }

  async getAverageIndicators(userId: string): Promise<{
    systolic: number;
    diastolic: number;
    heartRate: number;
  }> {
    const result = await this.heartPressModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          systolic: { $avg: "$systolic" },
          diastolic: { $avg: "$diastolic" },
          heartRate: { $avg: "$heartRate" },
        },
      },
    ]);

    if (result.length === 0) {
      return {
        systolic: 0,
        diastolic: 0,
        heartRate: 0,
      };
    }

    return {
      systolic: Math.round(result[0].systolic || 0),
      diastolic: Math.round(result[0].diastolic || 0),
      heartRate: Math.round(result[0].heartRate || 0),
    };
  }
  async getHeartPress(userId: string): Promise<HeartPress[]> {
    return this.heartPressModel.find({ userId: new mongoose.Types.ObjectId(userId) });
  }
}
