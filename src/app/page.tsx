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
  const handleAdd = useCallback(() => setModal({ mode: "add" }), []);
  const handleClose = useCallback(() => setModal(null), []);

  const isEmpty = !isLoading && !isError && (patients?.length ?? 0) === 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Pet Clinic</h1>
            <p className="text-sm text-muted">Patient management</p>
          </div>

          <div className="p-6">
            {isLoading ? (
              <p className="py-12 text-center text-muted">Loading…</p>
            ) : isError ? (
              <p className="py-12 text-center text-danger">
                Failed to load patients
              </p>
            ) : isEmpty ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-muted">No patients yet.</p>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
                >
                  <Plus size={18} /> Add your first patient
                </button>
              </div>
            ) : (
              <>
                <PatientsTable patients={patients ?? []} onEdit={handleEdit} />
                <button
                  type="button"
                  onClick={handleAdd}
                  className="mt-4 inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
                >
                  <Plus size={18} /> Add new patient
                </button>
              </>
            )}
          </div>
        </div>
      </div>

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
