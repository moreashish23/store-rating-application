import type{ ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";
import type{  ColumnDef} from "@tanstack/react-table";
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyComponent?: ReactNode;
}

function DataTable<T extends object>({
  data,
  columns,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  emptyComponent,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortBy !== colKey)
      return <MdUnfoldMore className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    return sortOrder === "asc" ? (
      <MdArrowUpward className="w-4 h-4 text-brand-500 flex-shrink-0" />
    ) : (
      <MdArrowDownward className="w-4 h-4 text-brand-500 flex-shrink-0" />
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {table.getHeaderGroups()[0].headers.map((header) => {
              const meta = header.column.columnDef.meta as
                | { sortable?: boolean; key?: string }
                | undefined;
              const isSortable = meta?.sortable;
              const colKey = meta?.key || header.id;

              return (
                <th
                  key={header.id}
                  className={`px-4 sm:px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap
                    ${isSortable ? "cursor-pointer hover:bg-slate-100 select-none" : ""}
                  `}
                  onClick={() => isSortable && onSort?.(colKey)}
                >
                  <div className="flex items-center gap-1.5">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {isSortable && <SortIcon colKey={colKey} />}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-50">
          {isLoading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <tr key={i}>
                {columns.map((_, j) => (
                  <td key={j} className="px-4 sm:px-6 py-4">
                    <Skeleton height={16} borderRadius={6} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                {emptyComponent || (
                  <div className="py-16 text-center text-slate-400 text-sm">
                    No data available
                  </div>
                )}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 sm:px-6 py-4 text-slate-700 align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;