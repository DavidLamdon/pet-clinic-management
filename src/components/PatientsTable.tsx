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
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const ageA = calculateAge(rowA.original.petBirthDate);
          const ageB = calculateAge(rowB.original.petBirthDate);
          return ageA - ageB;
        },
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

      <table className="w-full border-collapse table-fixed hidden md:table">
        <colgroup>
          <col className="w-[22%]" />
          <col className="w-[18%]" />
          <col className="w-[22%]" />
          <col className="w-[12%]" />
          <col className="w-[18%]" />
          <col className="w-[8%]" />
        </colgroup>
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted"
              >
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
            <tr
              key={row.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-3 truncate">
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
