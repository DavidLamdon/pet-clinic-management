"use client";

import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/lib/api/patients";
import { PatientsTable } from "@/components/PatientsTable";

export default function Home() {
  const {
    data: patients,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });

  if (isLoading) return <p className="p-8">Loading…</p>;
  if (isError)
    return <p className="p-8 text-red-600">Failed to load patients</p>;

  return (
    <main className="p-8">
      <PatientsTable patients={patients ?? []} />
    </main>
  );
}
