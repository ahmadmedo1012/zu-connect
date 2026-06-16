import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
  containerClassName?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "لا توجد بيانات",
  keyExtractor,
  containerClassName,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-border/50 overflow-hidden">
        <div className="divide-y divide-border/50">
          <div className="flex bg-muted/30 px-4 py-3 gap-4">
            {columns.map((col) => (
              <div key={col.key} className={cn("flex-1", col.className)}>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex px-4 py-3 gap-4">
              {columns.map((col) => (
                <div key={col.key} className={cn("flex-1", col.className)}>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <Empty title={emptyMessage} />;
  }

  return (
    <div className={cn("rounded-md border border-border/50 overflow-hidden", containerClassName)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            {columns.map((col) => (
              <TableHead key={col.key} className={cn("text-xs font-semibold uppercase tracking-wider", col.className)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow
              key={keyExtractor(item)}
              className="transition-colors hover:bg-muted/30"
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={cn("py-3", col.className)}>
                  {col.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
