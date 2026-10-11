import type { ReactNode } from "react";
import type { ColumnDef, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // TanStack requires both generic parameters on declaration merging even though these style fields do not consume them.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  caption?: string;
  loading?: boolean;
  loadingLabel?: string;
  enableSorting?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    onPageChange: (page: number) => void;
  };
}
