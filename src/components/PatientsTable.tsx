"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { Patient } from "@/lib/types";
import { calculateAge } from "@/lib/utils";
import { PatientCard } from "./PatientCard";
import { PatientsControls } from "./PatientsControls";
import { EditButton } from "./EditButton";

const columnHelper = createColumnHelper<Patient>();

const petTypeFilterFn: FilterFn<Patient> = (row, columnId, value: string[]) => {
  if (!value?.length) return true;
  return value.includes(row.getValue(columnId));
};

export function PatientsTable({
  patients,
  onEdit,
}: {
  patients: Patient[];
  onEdit: (p: Patient) => void;
}) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        filterFn: "includesString",
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("petName", {
        header: "Pet Name",
        filterFn: "includesString",
      }),
      columnHelper.accessor("petBirthDate", {
        header: "Pet Age",
        cell: (info) => calculateAge(info.getValue()),
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("petType", {
        header: "Pet Type",
        enableSorting: false,
        filterFn: petTypeFilterFn,
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <EditButton onEdit={onEdit} patient={info.row.original} />
        ),
      }),
    ],
    [onEdit],
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: patients,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div>
      <PatientsControls table={table} />

      <table className="w-full border-collapse hidden md:table">
        <thead>
          <tr className="text-left border-b">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="p-2">
                {header.column.getCanSort() ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex items-center gap-1"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{ asc: "↑", desc: "↓" }[
                      header.column.getIsSorted() as string
                    ] ?? "↕"}
                  </button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 md:hidden">
        {table.getRowModel().rows.map((row) => (
          <PatientCard key={row.id} patient={row.original} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}
