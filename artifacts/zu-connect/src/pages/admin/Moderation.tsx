import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Trash2 } from "lucide-react";

interface ModerationItem {
  id: number;
  name: string;
  college: string | null;
  type: string;
  message: string;
  createdAt: string;
}

export default function AdminModeration() {
  const { toast } = useToast();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/admin/moderation?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const deleteItem = (id: number) => {
    fetch(`/api/admin/moderation/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        toast({ title: "تم", description: "تم حذف العنصر بنجاح" });
        fetchItems();
      })
      .catch((e) => {
        toast({ title: "خطأ", description: "فشل حذف العنصر", variant: "destructive" });
      });
  };

  const typeBadge = (type: string) => {
    const isComplaint = type.includes("شكوى") || type === "complaint";
    return (
      <Badge variant={isComplaint ? "destructive" : "secondary"}>
        {isComplaint ? "شكوى" : "اقتراح"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          قائمة المراجعة
        </h1>
        <p className="text-sm text-muted-foreground mt-1">مراجعة الشكاوى والاقتراحات</p>
      </div>

      <DataTable
        columns={[
          { key: "id", header: "#", render: (i: ModerationItem) => i.id },
          { key: "name", header: "الاسم", render: (i: ModerationItem) => i.name },
          { key: "type", header: "النوع", render: (i: ModerationItem) => typeBadge(i.type) },
          { key: "college", header: "الكلية", render: (i: ModerationItem) => i.college || "-" },
          { key: "message", header: "الرسالة", render: (i: ModerationItem) => (
            <span className="block max-w-xs truncate">{i.message}</span>
          )},
          { key: "createdAt", header: "التاريخ", render: (i: ModerationItem) => new Date(i.createdAt).toLocaleDateString("ar-EG") },
          { key: "actions", header: "إجراءات", render: (i: ModerationItem) => (
            <Button variant="ghost" size="sm" onClick={() => deleteItem(i.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )},
        ]}
        data={items}
        isLoading={loading}
        keyExtractor={(i: ModerationItem) => i.id}
        emptyMessage="لا توجد عناصر للمراجعة"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
