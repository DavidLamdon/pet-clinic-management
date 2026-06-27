"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { MODAL_MODES, ModalMode, PET_TYPES, PetType } from "@/lib/constants";
import { patientSchema } from "@/lib/validation";
import { Patient, PatientFormValues } from "@/lib/types";
import { usePatientMutations } from "@/lib/hooks/usePatientMutations";
import { Field } from "./ui/Field";

const inputClass = "w-full border rounded px-2 py-1 text-sm";

const emptyForm: PatientFormValues = {
  name: "",
  phone: "",
  petName: "",
  petBirthDate: "",
  petType: "Dog",
};

type Props = {
  mode: ModalMode;
  patient?: Patient;
  onClose: () => void;
};

export function PatientModal({ mode, patient, onClose }: Props) {
  const { create, update, remove } = usePatientMutations();

  const [values, setValues] = useState<PatientFormValues>(
    mode === MODAL_MODES.Edit && patient
      ? {
          name: patient.name,
          phone: patient.phone,
          petName: patient.petName,
          petBirthDate: patient.petBirthDate.slice(0, 10),
          petType: patient.petType,
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (
    field: "name" | "phone" | "petName" | "petBirthDate",
    value: string,
  ) => setValues((v) => ({ ...v, [field]: value }));

  const handleSubmit = () => {
    const result = patientSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    if (mode === MODAL_MODES.Add) {
      create.mutate(values, { onSuccess: onClose });
    } else if (patient) {
      update.mutate({ id: patient._id, data: values }, { onSuccess: onClose });
    }
  };

  const handleDelete = () => {
    if (patient) remove.mutate(patient._id, { onSuccess: onClose });
  };

  const isPending = create.isPending || update.isPending || remove.isPending;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">
            {mode === MODAL_MODES.Add ? "Add patient" : "Edit patient"}
          </h2>
          {mode === MODAL_MODES.Edit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              aria-label="Delete patient"
              className="text-danger hover:text-danger-hover"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <Field label="Name" error={errors.name}>
            <input
              className={inputClass}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              className={inputClass}
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </Field>
          <Field label="Pet Name" error={errors.petName}>
            <input
              className={inputClass}
              value={values.petName}
              onChange={(e) => setField("petName", e.target.value)}
            />
          </Field>
          <Field label="Pet Birth Date" error={errors.petBirthDate}>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              className={inputClass}
              value={values.petBirthDate}
              onChange={(e) => setField("petBirthDate", e.target.value)}
            />
          </Field>
          <Field label="Pet Type" error={errors.petType}>
            <div className="flex gap-4">
              {PET_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="petType"
                    checked={values.petType === type}
                    onChange={() =>
                      setValues((v) => ({ ...v, petType: type as PetType }))
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </Field>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded disabled:opacity-50"
          >
            {mode === MODAL_MODES.Add ? "Add" : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
