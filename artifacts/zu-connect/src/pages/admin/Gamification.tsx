import { useState, useEffect } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Award, BarChart } from "lucide-react";

interface GamificationStats {
  totalUsers: number;
  usersWithPoints: number;
  totalPoints: number;
  averagePoints: number;
  topUsers: Array<{ id: number; name: string; points: number }>;
  tierDistribution: Array<{ name: string; count: number }>;
}

export default function AdminGamification() {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/gamification", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          النقاط والتحديات
        </h1>
        <p className="text-sm text-muted-foreground mt-1">إحصائيات النقاط وتوزيع المستويات</p>
      </div>

      {stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="إجمالي المستخدمين" value={stats.totalUsers} icon={Users} />
            <MetricCard title="مستخدمون بنقاط" value={stats.usersWithPoints} icon={Award} />
            <MetricCard title="إجمالي النقاط" value={stats.totalPoints} icon={Trophy} />
            <MetricCard title="متوسط النقاط" value={stats.averagePoints} icon={BarChart} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">أفضل المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topUsers.slice(0, 10).map((u, i) => (
                    <div key={u.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}.</span>
                        <span className="text-sm">{u.name}</span>
                      </div>
                      <span className="text-sm font-medium">{u.points} نقطة</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">توزيع المستويات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.tierDistribution.map((tier) => (
                    <div key={tier.name} className="flex items-center justify-between">
                      <span className="text-sm">{tier.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(100, (tier.count / Math.max(1, stats.totalUsers)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-left">{tier.count}</span>
                      </div>
                    </div>
                  ))}
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
