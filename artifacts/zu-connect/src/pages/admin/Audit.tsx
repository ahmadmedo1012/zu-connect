import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { ScrollText } from "lucide-react";

interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  entity: string;
  entityId: number | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
}

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/audit?page=${page}&limit=20`, {
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
          <ScrollText className="h-5 w-5" />
          سجل التدقيق
        </h1>
        <p className="text-sm text-muted-foreground mt-1">سجل جميع إجراءات المشرفين على المنصة</p>
      </div>

      <DataTable
        columns={[
          { key: "id", header: "#", render: (l: AuditLog) => l.id },
          { key: "userName", header: "المشرف", render: (l: AuditLog) => l.userName },
          { key: "action", header: "الإجراء", render: (l: AuditLog) => l.action },
          { key: "entity", header: "الكيان", render: (l: AuditLog) => `${l.entity}${l.entityId ? ` #${l.entityId}` : ""}` },
          { key: "ipAddress", header: "IP", render: (l: AuditLog) => l.ipAddress || "-" },
          { key: "createdAt", header: "التاريخ", render: (l: AuditLog) => new Date(l.createdAt).toLocaleString("ar-EG") },
        ]}
        data={logs}
        isLoading={loading}
        keyExtractor={(l: AuditLog) => l.id}
        emptyMessage="لا توجد سجلات تدقيق"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
