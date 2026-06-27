"use client";

import { Table } from "@tanstack/react-table";
import { Patient } from "@/lib/types";
import { ColumnSearch } from "@/components/ColumnSearch";
import { PetTypeFilter } from "@/components/PetTypeFilter";
import { SortControl } from "./SortControl";

export function PatientsControls({ table }: { table: Table<Patient> }) {
  const nameCol = table.getColumn("name");
  const petNameCol = table.getColumn("petName");
  const petTypeCol = table.getColumn("petType");

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {nameCol && (
        <div className="flex-1">
          <label className="block text-xs text-muted mb-1">Name</label>
          <ColumnSearch column={nameCol} placeholder="Search name…" />
        </div>
      )}
      {petNameCol && (
        <div className="flex-1">
          <label className="block text-xs text-muted mb-1">Pet Name</label>
          <ColumnSearch column={petNameCol} placeholder="Search pet…" />
        </div>
      )}
      {petTypeCol && (
        <div className="flex-1">
          <label className="block text-xs text-muted mb-1">Pet Type</label>
          <PetTypeFilter column={petTypeCol} />
        </div>
      )}
      <div className="md:hidden">
        <SortControl table={table} />
      </div>
    </div>
  );
}
