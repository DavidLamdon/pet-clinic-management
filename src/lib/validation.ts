import { z } from "zod";
import { PET_TYPES } from "./constants";

export const patientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .regex(/[a-zA-Z]/, "Name must contain letters"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^0(5\d|[23489]|7\d)\d{7}$/.test(v), {
      message:
        "Enter a valid Israeli phone number (e.g. 0521234567 or 031234567)",
    }),
  petName: z
    .string()
    .min(1, "Pet name is required")
    .regex(/[a-zA-Z]/, "Name must contain letters"),
  petBirthDate: z.coerce
    .date()
    .max(new Date(), { message: "Birth date can't be in the future" }),
  petType: z.enum(PET_TYPES),
});

export type PatientInput = z.infer<typeof patientSchema>;
