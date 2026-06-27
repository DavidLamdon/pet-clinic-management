"use client";

import { Patient } from "@/lib/types";
import { calculateAge } from "@/lib/utils";
import { EditButton } from "./EditButton";

export function PatientCard({
  patient,
  onEdit,
}: {
  patient: Patient;
  onEdit: (p: Patient) => void;
}) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start">
      <div className="space-y-1">
        <p className="font-medium">{patient.name}</p>
        <p className="text-sm text-muted-dark">Phone: {patient.phone}</p>
        <p className="text-sm">
          <span className="text-muted">Pet Name:</span> {patient.petName} (
          {patient.petType})
        </p>
        <p className="text-sm">
          <span className="text-muted">Age:</span>{" "}
          {calculateAge(patient.petBirthDate)}
        </p>
      </div>
      <EditButton onEdit={onEdit} patient={patient} />
    </div>
  );
}
