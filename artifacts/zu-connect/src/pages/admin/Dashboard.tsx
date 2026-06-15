import { useState, useEffect } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import { LiveFeed } from "@/components/admin/LiveFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gift, MessageSquare, Newspaper, Activity } from "lucide-react";
import { adminSocket } from "@/components/admin/AdminSocket";

interface DashboardStats {
  users: number;
  news: number;
  courses: number;
  members: number;
  colleges: number;
  library: number;
  referrals: number;
  suggestions: number;
  announcements: number;
  recentLogins30d: number;
  recentReferrals30d: number;
}

interface LiveEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/admin/live/events?limit=20", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => setLiveEvents(data.events || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const eventTypes = [
      "admin:new_login", "admin:new_registration", "admin:new_referral",
      "admin:referral_rewarded", "admin:new_complaint", "admin:new_suggestion",
      "admin:moderation_action", "admin:announcement_published", "admin:system_alert",
    ];

    const unsubs = eventTypes.map((type) =>
      adminSocket.on(type, (event: any) => {
        setLiveEvents((prev) => [
          { id: `${type}_${Date.now()}`, type, payload: event.payload, timestamp: event._meta?.emittedAt || new Date().toISOString() },
          ...prev.slice(0, 99),
        ]);
      })
    );

    return () => unsubs.forEach((u) => u());
  }, []);

  const metrics = stats ? [
    { title: "المستخدمون", value: stats.users, icon: Users, change: 12, trend: "up" as const },
    { title: "الإحالات", value: stats.referrals, icon: Gift, change: stats.recentReferrals30d > 0 ? 8 : 0, trend: stats.recentReferrals30d > 0 ? "up" as const : "stable" as const },
    { title: "الشكاوى", value: stats.suggestions, icon: MessageSquare, change: -3, trend: "down" as const },
    { title: "المقالات", value: stats.news, icon: Newspaper, change: 5, trend: "up" as const },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">نظرة عامة على المنصة</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          : metrics.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              النشاط الأخير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiveFeed events={liveEvents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="h-4 w-4" />
              الإحالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">إجمالي الإحالات</span>
                  <span className="font-bold">{stats.referrals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">إجمالي المستخدمين</span>
                  <span className="font-bold">{stats.users}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">عدد المقالات</span>
                  <span className="font-bold">{stats.news}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">الإعلانات</span>
                  <span className="font-bold">{stats.announcements}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">الدورات</span>
                  <span className="font-bold">{stats.courses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">أعضاء الاتحاد</span>
                  <span className="font-bold">{stats.members}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-5 bg-muted rounded animate-pulse" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
