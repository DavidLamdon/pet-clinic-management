import { z } from "zod";
import { PET_TYPES } from "./constants";

export const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  petName: z.string().min(1, "Pet name is required"),
  petBirthDate: z.coerce.date(),
  petType: z.enum(PET_TYPES),
});

export type PatientInput = z.infer<typeof patientSchema>;
