"use client";

import { Table } from "@tanstack/react-table";
import { Patient } from "@/lib/types";

const SORTABLE: { id: string; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "petName", label: "Pet Name" },
  { id: "petBirthDate", label: "Pet Age" },
];

export function SortControl({ table }: { table: Table<Patient> }) {
  const sorting = table.getState().sorting;
  const active = sorting[0];

  const onFieldChange = (id: string) => {
    if (!id) {
      table.setSorting([]);
    } else {
      table.setSorting([{ id, desc: active?.desc ?? false }]);
    }
  };

  const toggleDir = () => {
    if (!active) return;
    table.setSorting([{ id: active.id, desc: !active.desc }]);
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label className="block text-xs text-muted mb-1">Sort by</label>
        <select
          value={active?.id ?? ""}
          onChange={(e) => onFieldChange(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">None</option>
          {SORTABLE.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={toggleDir}
        disabled={!active}
        aria-label="Toggle sort direction"
        className="border rounded px-3 py-1 text-sm disabled:opacity-40"
      >
        {active?.desc ? "↓" : "↑"}
      </button>
    </div>
  );
}
