import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Award, TrendingUp } from "lucide-react";

interface Referral {
  id: number;
  code: string;
  status: string;
  pointsAwarded: number;
  referrerName: string;
  createdAt: string;
}

interface ReferralStats {
  total: number;
  pending: number;
  completed: number;
  rewarded: number;
  totalPoints: number;
  topReferrers: Array<{ userId: number; name: string; count: number; points: number }>;
}

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/admin/referrals?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setReferrals(data.referrals || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetch("/api/admin/referrals/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      rewarded: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      expired: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    const labels: Record<string, string> = {
      pending: "معلق",
      completed: "مكتمل",
      rewarded: "مكافأة",
      expired: "منتهي",
    };
    return <Badge variant="secondary" className={styles[status] || ""}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Gift className="h-5 w-5" />
          إدارة الإحالات
        </h1>
        <p className="text-sm text-muted-foreground mt-1">عرض إحالات المستخدمين وإحصائياتها</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="إجمالي الإحالات" value={stats.total} icon={Gift} />
          <MetricCard title="قيد الانتظار" value={stats.pending} icon={Users} />
          <MetricCard title="تمت المكافأة" value={stats.rewarded} icon={Award} />
          <MetricCard title="إجمالي النقاط" value={stats.totalPoints} icon={TrendingUp} />
        </div>
      )}

      {stats && stats.topReferrers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">أفضل المحيلين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topReferrers.slice(0, 5).map((r, i) => (
                <div key={r.userId} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
                    <span className="text-sm">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{r.count} إحالات</span>
                    <span className="text-muted-foreground">{r.points} نقطة</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={[
          { key: "id", header: "#", render: (r: Referral) => r.id },
          { key: "referrerName", header: "المُحيل", render: (r: Referral) => r.referrerName },
          { key: "code", header: "الرمز", render: (r: Referral) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.code}</code> },
          { key: "status", header: "الحالة", render: (r: Referral) => statusBadge(r.status) },
          { key: "pointsAwarded", header: "النقاط", render: (r: Referral) => r.pointsAwarded },
          { key: "createdAt", header: "التاريخ", render: (r: Referral) => new Date(r.createdAt).toLocaleDateString("ar-EG") },
        ]}
        data={referrals}
        isLoading={loading}
        keyExtractor={(r: Referral) => r.id}
        emptyMessage="لا توجد إحالات"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
