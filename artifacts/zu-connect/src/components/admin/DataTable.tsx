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
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "لا توجد بيانات",
  keyExtractor,
  containerClassName,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
        <div className="divide-y divide-border/50">
          <div className="flex bg-muted/50 px-4 py-3 gap-4">
            {columns.map((col) => (
              <div key={col.key} className={cn("flex-1", col.className)}>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn("flex px-4 py-3 gap-4", i % 2 === 0 && "bg-muted/20")}>
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
    <div className={cn("rounded-xl border border-border/50 overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md", containerClassName)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-muted/50 to-muted/20">
            {columns.map((col) => (
              <TableHead key={col.key} className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5", col.className)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow
              key={keyExtractor(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={cn(
                "transition-all duration-150",
                idx % 2 === 0 ? "bg-background" : "bg-muted/10",
                onRowClick ? "cursor-pointer" : "",
                "hover:bg-primary/[0.04] hover:shadow-sm"
              )}
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
