import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, AlertCircle, Filter } from "lucide-react";

interface ComplaintItem {
  id: number; name: string; college: string | null;
  type: string; message: string; createdAt: string;
}

export default function AdminComplaints() {
  const { toast } = useToast();
  const [items, setItems] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/moderation?page=${page}&limit=20&type=شكوى`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => { if (!r.ok) throw new Error("فشل تحميل الشكاوى"); return r.json(); })
      .then((data) => {
        setItems(data.items || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); toast({ title: "خطأ", description: e.message, variant: "destructive" }); });
  }, [page, toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const deleteItem = (id: number) => {
    fetch(`/api/admin/moderation/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => { if (!r.ok) throw new Error("فشل الحذف"); return r.json(); })
      .then(() => { toast({ title: "تم الحذف", description: "تم حذف العنصر بنجاح" }); fetchItems(); })
      .catch((e) => toast({ title: "خطأ", description: e.message, variant: "destructive" }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          الشكاوى والاقتراحات
        </h1>
        <p className="text-sm text-muted-foreground mt-1">عرض وإدارة جميع الشكاوى والاقتراحات</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <DataTable
        columns={[
          { key: "id", header: "#", render: (i: ComplaintItem) => i.id },
          { key: "name", header: "الاسم", render: (i: ComplaintItem) => i.name || "مجهول" },
          { key: "college", header: "الكلية", render: (i: ComplaintItem) => i.college || "-" },
          { key: "type", header: "النوع", render: (i: ComplaintItem) => (
            <Badge variant={i.type === "شكوى" ? "destructive" : "secondary"}>{i.type}</Badge>
          )},
          { key: "message", header: "الرسالة", render: (i: ComplaintItem) => (
            <span className="block max-w-sm truncate">{i.message}</span>
          )},
          { key: "createdAt", header: "التاريخ", render: (i: ComplaintItem) => new Date(i.createdAt).toLocaleDateString("ar-EG") },
          { key: "actions", header: "إجراءات", render: (i: ComplaintItem) => (
            <Button variant="ghost" size="sm" onClick={() => deleteItem(i.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )},
        ]}
        data={items}
        isLoading={loading}
        keyExtractor={(i: ComplaintItem) => i.id}
        emptyMessage="لا توجد شكاوى أو اقتراحات"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
