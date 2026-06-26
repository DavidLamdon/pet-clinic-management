import { Patient, PatientFormValues } from "@/lib/types";

export async function getPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patients");
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export async function createPatient(data: PatientFormValues): Promise<Patient> {
  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create patient");
  return res.json();
}

export async function updatePatient({
  id,
  data,
}: {
  id: string;
  data: PatientFormValues;
}): Promise<Patient> {
  const res = await fetch(`/api/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update patient");
  return res.json();
}

export async function deletePatient(id: string): Promise<void> {
  const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete patient");
}
