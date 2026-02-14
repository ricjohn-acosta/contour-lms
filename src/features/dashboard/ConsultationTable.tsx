"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ConsultationWithTutor } from "@/services/consultation/consultation.service";

const columns: ColumnDef<ConsultationWithTutor>[] = [
  {
    id: "first_name",
    header: "First Name",
    accessorFn: (row) => row.tutors?.first_name ?? "—",
  },
  {
    id: "last_name",
    header: "Last Name",
    accessorFn: (row) => row.tutors?.last_name ?? "—",
  },
  {
    accessorKey: "reason",
    header: "Reason for consultation",
    cell: ({ row }) => row.original.reason ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isComplete = status?.toLowerCase() === "complete";
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
            isComplete
              ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-500/30"
              : "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-500/30"
          )}
        >
          {status ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Consultation date",
    cell: ({ row }) => {
      const value = row.original.created_at;
      if (!value) return "—";
      return new Date(value).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },
  },
];

interface ConsultationTableProps {
  data: ConsultationWithTutor[];
}

export const ConsultationTable = ({ data }: ConsultationTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-blue-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No consultations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
