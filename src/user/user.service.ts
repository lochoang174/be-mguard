import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema.ts/user.schema";
import mongoose, { Model } from "mongoose";
import { IGoogleUser } from "src/types/IGoogleUser";
import { Patient, PatientDocument } from "./schema.ts/patient.schema";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async createUser(user: User): Promise<User> {
    return this.userModel.create(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async signin(user: IGoogleUser): Promise<User | null> {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      return existingUser;
    }
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async createPatient(
    patient: CreatePatientDto,
    idUer: string,
  ): Promise<Patient> {
    const user = await this.userModel.findById(idUer);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    if (user.idPatient) {
      throw new HttpException(
        "User already has a patient profile",
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPatient = new this.patientModel(patient);
    await newPatient.save();

    await this.userModel.findByIdAndUpdate(idUer, {
      idPatient: newPatient._id,
      isUpdateInfo: true,
    });

    return newPatient;
  }

  async updatePatient(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.userModel.findById(id);
    if (!patient) {
      throw new HttpException("Patient not found", HttpStatus.NOT_FOUND);
    }

    return await this.patientModel.findByIdAndUpdate(patient.idPatient, updatePatientDto, {
      new: true,
    });
  }

  async getPatient(idUser: string): Promise<Patient> {
    const user = await this.userModel.findById(idUser).populate("idPatient");
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    if (!user.idPatient) {
      throw new HttpException("Patient not found", HttpStatus.NOT_FOUND);
    }
    return user.idPatient as unknown as Patient;
  }
  async addPressure(
    idUser: string,
    pressure_id: mongoose.Types.ObjectId,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(idUser, {
      $push: { pressures: pressure_id },
    });
  }
}
