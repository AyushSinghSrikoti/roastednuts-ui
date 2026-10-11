"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import type { DataTableProps } from "@/types/data-table";
import AppLoader from "@/views/loader";

export function DataTable<T>({ columns, rows, getRowKey, onRowClick, emptyState, caption, loading = false, loadingLabel = "Loading table data", enableSorting = true, pagination }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // TanStack Table intentionally returns stateful functions; React Compiler safely skips this component.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getRowId: getRowKey,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 160,
      minSize: 80,
      maxSize: 600,
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-y border-[#e9dfd5] bg-[#faf7f2]">
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    scope="col"
                    style={{ width: header.getSize() }}
                    className={cn("relative px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#927f72]", header.column.columnDef.meta?.headerClassName)}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex cursor-pointer items-center gap-1.5 transition hover:text-[#594032]">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === "asc" ? <ArrowUp className="size-3" /> : sorted === "desc" ? <ArrowDown className="size-3" /> : <ArrowUpDown className="size-3 opacity-55" />}
                      </button>
                    ) : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() ? (
                      <div
                        role="separator"
                        aria-label={`Resize ${header.column.id} column`}
                        aria-orientation="vertical"
                        aria-valuemin={header.column.columnDef.minSize ?? 80}
                        aria-valuemax={header.column.columnDef.maxSize ?? 600}
                        aria-valuenow={header.column.getSize()}
                        tabIndex={0}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()}
                        onKeyDown={(event) => {
                          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                          event.preventDefault();
                          const direction = event.key === "ArrowRight" ? 16 : -16;
                          table.setColumnSizing((current) => ({
                            ...current,
                            [header.column.id]: header.column.getSize() + direction,
                          }));
                        }}
                        className={cn(
                          "absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none select-none outline-none after:absolute after:inset-y-2 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-[#d9ccbe] after:transition-colors hover:after:bg-[#8d6650] focus-visible:after:w-0.5 focus-visible:after:bg-[#75452e]",
                          header.column.getIsResizing() && "after:w-0.5 after:bg-[#75452e]",
                        )}
                      />
                    ) : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[#eee5dc]">
          {loading ? (
            <tr>
              <td colSpan={table.getVisibleLeafColumns().length} className="h-56 px-5 py-12">
                <AppLoader label={loadingLabel} />
              </td>
            </tr>
          ) : table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={(event) => {
                if (!onRowClick || (event.target instanceof Element && event.target.closest("a, button, input, select, textarea"))) return;
                onRowClick(row.original);
              }}
              onKeyDown={(event) => {
                if (!onRowClick || event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
                event.preventDefault();
                onRowClick(row.original);
              }}
              className={cn("h-16 transition-colors hover:bg-[#fcf8f3]", onRowClick && "cursor-pointer outline-none focus-visible:bg-[#f8f0e7] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9b7258]")}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ width: cell.column.getSize() }} className={cn("h-16 overflow-hidden px-5 py-2 text-xs text-[#5f4b3e]", cell.column.columnDef.meta?.cellClassName)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && !rows.length ? emptyState : null}
      {pagination ? (
        <div className="flex flex-col gap-3 border-t border-[#e9dfd5] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#927f72]">
            {pagination.totalItems
              ? `Showing ${(pagination.page - 1) * pagination.pageSize + 1}–${Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of ${pagination.totalItems} projects`
              : "Showing 0 projects"}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={!pagination.hasPreviousPage || loading} onClick={() => pagination.onPageChange(pagination.page - 1)} className="h-8 cursor-pointer rounded-lg border border-[#d9ccbe] bg-white px-3 text-[11px] font-semibold text-[#6f594b] transition hover:bg-[#f5eee6] disabled:cursor-not-allowed disabled:opacity-45">Previous</button>
            <span className="min-w-20 text-center text-[11px] text-[#806d60]">Page {pagination.page} of {Math.max(pagination.totalPages, 1)}</span>
            <button type="button" disabled={!pagination.hasNextPage || loading} onClick={() => pagination.onPageChange(pagination.page + 1)} className="h-8 cursor-pointer rounded-lg border border-[#d9ccbe] bg-white px-3 text-[11px] font-semibold text-[#6f594b] transition hover:bg-[#f5eee6] disabled:cursor-not-allowed disabled:opacity-45">Next</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
