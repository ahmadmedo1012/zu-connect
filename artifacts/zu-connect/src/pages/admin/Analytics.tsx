import { useState, useEffect } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gift, MessageSquare, Newspaper } from "lucide-react";

interface AnalyticsData {
  users: { total: number; newLastPeriod: number };
  referrals: { total: number; newLastPeriod: number; totalPointsAwarded: number };
  activity: Array<{ date: string; count: number }>;
  suggestions: number;
  announcements: number;
  periodDays: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics?days=30", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">الإحصائيات</h1>
        <p className="text-sm text-muted-foreground mt-1">تحليلات المنصة وآخر 30 يوماً</p>
      </div>

      {data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="إجمالي المستخدمين" value={data.users.total} icon={Users} change={Math.round((data.users.newLastPeriod / Math.max(1, data.users.total)) * 100)} trend="up" />
            <MetricCard title="إجمالي الإحالات" value={data.referrals.total} icon={Gift} change={Math.round((data.referrals.newLastPeriod / Math.max(1, data.referrals.total)) * 100)} trend="up" />
            <MetricCard title="الشكاوى" value={data.suggestions} icon={MessageSquare} />
            <MetricCard title="الإعلانات" value={data.announcements} icon={Newspaper} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">النشاط اليومي (آخر {data.periodDays} يوم)</CardTitle>
              </CardHeader>
              <CardContent>
                {data.activity.length > 0 ? (
                  <div className="space-y-1">
                    {data.activity.slice(-14).map((a) => (
                      <div key={a.date} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-16">{a.date}</span>
                        <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-sm"
                            style={{ width: `${Math.min(100, a.count * 10)}%` }}
                          />
                        </div>
                        <span className="text-xs w-6 text-left">{a.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد بيانات نشاط كافية</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">ملخص سريع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">مستخدمون جدد (30 يوم)</span>
                    <span className="text-sm font-bold">{data.users.newLastPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">إحالات جديدة (30 يوم)</span>
                    <span className="text-sm font-bold">{data.referrals.newLastPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">نقاط الإحالات الممنوحة</span>
                    <span className="text-sm font-bold">{data.referrals.totalPointsAwarded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">إجمالي الشكاوى</span>
                    <span className="text-sm font-bold">{data.suggestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">إجمالي الإعلانات</span>
                    <span className="text-sm font-bold">{data.announcements}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><div className="h-16 bg-muted rounded animate-pulse" /></CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}
