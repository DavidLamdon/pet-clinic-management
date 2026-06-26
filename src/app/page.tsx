"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { getPatients } from "@/lib/api/patients";
import { PatientsTable } from "@/components/PatientsTable";
import { PatientModal } from "@/components/PatientModal";
import { Patient } from "@/lib/types";

type ModalState = { mode: "add" } | { mode: "edit"; patient: Patient } | null;

export default function Home() {
  const {
    data: patients,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });
  const [modal, setModal] = useState<ModalState>(null);

  const handleEdit = useCallback((patient: Patient) => {
    setModal({ mode: "edit", patient });
  }, []);

  const handleAdd = () => {
    setModal({ mode: "add" });
  };

  const handleClose = () => {
    setModal(null);
  };

  if (isLoading) return <p className="p-8">Loading…</p>;
  if (isError)
    return <p className="p-8 text-danger">Failed to load patients</p>;

  return (
    <main className="p-8">
      <PatientsTable patients={patients ?? []} onEdit={handleEdit} />
      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 flex items-center gap-1 text-brand"
      >
        <Plus size={18} /> Add new patient
      </button>

      {modal && (
        <PatientModal
          mode={modal.mode}
          patient={modal.mode === "edit" ? modal.patient : undefined}
          onClose={handleClose}
        />
      )}
    </main>
  );
}
