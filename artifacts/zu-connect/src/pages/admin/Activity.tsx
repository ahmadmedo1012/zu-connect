import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Activity } from "lucide-react";

interface ActivityLog {
  id: number;
  userId: number | null;
  userName: string | null;
  action: string;
  entity: string | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
}

export default function AdminActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/activity?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          سجل النشاط
        </h1>
        <p className="text-sm text-muted-foreground mt-1">سجل نشاط المستخدمين على المنصة</p>
      </div>

      <DataTable
        columns={[
          { key: "id", header: "#", render: (l: ActivityLog) => l.id },
          { key: "userName", header: "المستخدم", render: (l: ActivityLog) => l.userName || "-" },
          { key: "action", header: "الإجراء", render: (l: ActivityLog) => l.action },
          { key: "entity", header: "الكيان", render: (l: ActivityLog) => l.entity || "-" },
          { key: "createdAt", header: "التاريخ", render: (l: ActivityLog) => new Date(l.createdAt).toLocaleString("ar-EG") },
        ]}
        data={logs}
        isLoading={loading}
        keyExtractor={(l: ActivityLog) => l.id}
        emptyMessage="لا توجد نشاطات مسجلة"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
