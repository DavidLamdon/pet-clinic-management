import { PetType } from "@/lib/constants";

export interface Patient {
  _id: string;
  name: string;
  phone: string;
  petName: string;
  petBirthDate: string;
  petType: PetType;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormValues {
  name: string;
  phone: string;
  petName: string;
  petBirthDate: string;
  petType: PetType;
}
