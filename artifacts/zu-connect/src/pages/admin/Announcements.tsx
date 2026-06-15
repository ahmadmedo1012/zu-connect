import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, Trash2 } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnnouncements = () => {
    setLoading(true);
    fetch(`/api/admin/announcements?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAnnouncements(data.announcements || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAnnouncements(); }, [page]);

  const publishAnnouncement = (id: number) => {
    fetch(`/api/admin/announcements/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    }).then(() => fetchAnnouncements());
  };

  const deleteAnnouncement = (id: number) => {
    if (!confirm("هل أنت متأكد؟")) return;
    fetch(`/api/admin/announcements/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(() => fetchAnnouncements());
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      archived: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    const labels: Record<string, string> = { draft: "مسودة", published: "منشور", archived: "مؤرشف" };
    return <Badge variant="secondary" className={styles[status] || ""}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          الإعلانات
        </h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة الإعلانات والنشر</p>
      </div>

      <DataTable
        columns={[
          { key: "id", header: "#", render: (a: Announcement) => a.id },
          { key: "title", header: "العنوان", render: (a: Announcement) => (
            <span className="block max-w-xs truncate font-medium">{a.title}</span>
          )},
          { key: "priority", header: "الأولوية", render: (a: Announcement) => (
            <Badge variant={a.priority === "urgent" ? "destructive" : a.priority === "high" ? "default" : "secondary"}>
              {a.priority === "urgent" ? "عاجل" : a.priority === "high" ? "مهم" : "عادي"}
            </Badge>
          )},
          { key: "status", header: "الحالة", render: (a: Announcement) => statusBadge(a.status) },
          { key: "createdAt", header: "التاريخ", render: (a: Announcement) => new Date(a.createdAt).toLocaleDateString("ar-EG") },
          { key: "actions", header: "إجراءات", render: (a: Announcement) => (
            <div className="flex items-center gap-1">
              {a.status === "draft" && (
                <Button variant="ghost" size="sm" onClick={() => publishAnnouncement(a.id)}>نشر</Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => deleteAnnouncement(a.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )},
        ]}
        data={announcements}
        isLoading={loading}
        keyExtractor={(a: Announcement) => a.id}
        emptyMessage="لا توجد إعلانات"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
