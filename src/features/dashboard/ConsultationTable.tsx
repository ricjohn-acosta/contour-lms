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

export type ConsultationStatus = "Complete" | "Incomplete";

export type ConsultationRow = {
  id: string;
  firstName: string;
  lastName: string;
  reasonForConsultation: string;
  status: ConsultationStatus;
  datetime: string;
};

const columns: ColumnDef<ConsultationRow>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "reasonForConsultation",
    header: "Reason for consultation",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ConsultationStatus;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
            status === "Complete"
              ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-500/30"
              : "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-500/30"
          )}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "datetime",
    header: "Consultation date",
    cell: ({ row }) => {
      const value = row.getValue("datetime") as string;
      return new Date(value).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      });
    },
  },
];

const defaultData: ConsultationRow[] = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Doe",
    reasonForConsultation: "Follow-up",
    status: "Complete",
    datetime: "2025-02-10T14:00:00",
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Smith",
    reasonForConsultation: "Initial assessment",
    status: "Incomplete",
    datetime: "2025-02-14T09:30:00",
  },
];

type ConsultationTableProps = {
  data?: ConsultationRow[];
};

export const ConsultationTable = ({
  data = defaultData,
}: ConsultationTableProps) => {
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
