import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

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
                <Skeleton variant="text" className="h-4 w-20" />
              </div>
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn("flex px-4 py-3 gap-4 relative", i % 2 === 0 && "bg-muted/20")}>
              {columns.map((col) => (
                <div key={col.key} className={cn("flex-1", col.className)}>
                  <Skeleton variant="text" className="h-4 w-full" />
                </div>
              ))}
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent animate-pulse pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <Empty icon={Inbox} title={emptyMessage} />;
  }

  return (
    <div className={cn("rounded-xl border border-border/50 overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md", containerClassName)}>
      {/* Responsive wrapper: horizontal scroll on mobile, full width on lg+ */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px] lg:min-w-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-muted/50 to-muted/20">
                {columns.map((col) => (
                  <TableHead key={col.key} className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5 px-4", col.className)}>
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
                    "group transition-all duration-150",
                    idx % 2 === 0 ? "bg-background" : "bg-muted/10",
                    onRowClick ? "cursor-pointer" : "",
                    "hover:bg-gradient-to-r hover:from-primary/[0.06] hover:via-primary/[0.03] hover:to-transparent hover:scale-[1.005] hover:shadow-sm"
                  )}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn("py-3 px-4 group-hover:translate-x-0.5 transition-transform duration-150", col.className)}>
                      {col.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
