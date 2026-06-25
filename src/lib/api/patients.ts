import { Patient } from "@/lib/types";

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patients");
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}
