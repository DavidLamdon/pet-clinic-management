import { z } from "zod";
import { PET_TYPES } from "./constants";

export const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[\d-]+$/, "Phone may contain only digits and dashes")
    .refine(
      (v) =>
        v.replace(/\D/g, "").length >= 9 && v.replace(/\D/g, "").length <= 10,
      {
        message: "Phone must be 9–10 digits",
      },
    ),
  petName: z.string().min(1, "Pet name is required"),
  petBirthDate: z.coerce
    .date()
    .max(new Date(), { message: "Birth date can't be in the future" }),
  petType: z.enum(PET_TYPES),
});

export type PatientInput = z.infer<typeof patientSchema>;
