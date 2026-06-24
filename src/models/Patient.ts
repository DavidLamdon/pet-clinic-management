import { PET_TYPES } from "@/lib/constants";
import { Schema, model, models } from "mongoose";

const PatientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    petName: { type: String, required: true, trim: true },
    petBirthDate: { type: Date, required: true },
    petType: { type: String, enum: PET_TYPES, required: true },
  },
  { timestamps: true },
);

export const Patient = models.Patient || model("Patient", PatientSchema);
