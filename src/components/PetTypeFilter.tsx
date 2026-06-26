"use client";

import { useState } from "react";
import { Column } from "@tanstack/react-table";
import { PET_TYPES } from "@/lib/constants";

export function PetTypeFilter<T>({ column }: { column: Column<T, unknown> }) {
  const [open, setOpen] = useState(false);
  const selected = (column.getFilterValue() as string[]) ?? [];

  const toggle = (type: string) => {
    const next = selected.includes(type)
      ? selected.filter((t) => t !== type)
      : [...selected, type];
    column.setFilterValue(next.length ? next : undefined);
  };

  return (
    <div className="relative font-normal">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="border rounded px-2 py-1 text-sm w-full text-left"
      >
        {selected.length ? selected.join(", ") : "All types"} ▾
      </button>
      {open && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow p-2 space-y-1">
          {PET_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(type)}
                onChange={() => toggle(type)}
              />
              {type}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
