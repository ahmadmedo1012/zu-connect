import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 0) {
    return (
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">لا توجد صفحات</p>
      </div>
    );
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("ellipsis");
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        الصفحة {page} من {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="hidden sm:flex rounded-lg border-border/50 hover:border-primary/30 transition-colors"
          title="الأولى"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border-border/50 hover:border-primary/30 transition-colors"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
          السابق
        </Button>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">…</span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200",
                  p === page
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                    : "hover:bg-accent hover:text-foreground"
                )}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border-border/50 hover:border-primary/30 transition-colors"
        >
          التالي
          <ChevronLeft className="h-4 w-4 mr-1" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="hidden sm:flex rounded-lg border-border/50 hover:border-primary/30 transition-colors"
          title="الأخيرة"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
