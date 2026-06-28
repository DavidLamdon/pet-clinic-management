"use client";

import { Column } from "@tanstack/react-table";

export function ColumnSearch<T>({
  column,
  placeholder,
}: {
  column: Column<T, unknown>;
  placeholder?: string;
}) {
  const value = (column.getFilterValue() as string) ?? "";
  return (
    <input
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={placeholder ?? "Search…"}
      className="w-full border rounded px-2 py-1 text-sm font-normal focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
    />
  );
}
