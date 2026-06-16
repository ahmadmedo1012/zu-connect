import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { MetricCard } from "@/components/admin/MetricCard";
import { LiveFeed } from "@/components/admin/LiveFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gift, MessageSquare, Newspaper, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { adminSocket } from "@/components/admin/AdminSocket";
import { motion } from "framer-motion";

interface DashboardStats {
  users: number; news: number; courses: number; members: number;
  colleges: number; library: number; referrals: number;
  suggestions: number; announcements: number;
  recentLogins30d: number; recentReferrals30d: number;
}

interface LiveEvent {
  id: string; type: string; payload: any; timestamp: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => { if (!r.ok) throw new Error("فشل تحميل الإحصائيات"); return r.json(); })
      .then((data) => { setStats(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); toast({ title: "خطأ", description: e.message, variant: "destructive" }); });
  }, [toast]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
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
    { title: "المستخدمون", value: stats.users, icon: Users, change: stats.recentLogins30d, trend: stats.recentLogins30d > 0 ? "up" as const : "stable" as const },
    { title: "الإحالات", value: stats.referrals, icon: Gift, change: stats.recentReferrals30d, trend: stats.recentReferrals30d > 0 ? "up" as const : "stable" as const },
    { title: "الشكاوى", value: stats.suggestions, icon: MessageSquare, change: -3, trend: "down" as const },
    { title: "المقالات", value: stats.news, icon: Newspaper, change: 5, trend: "up" as const },
  ] : [];

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <h1 className="text-xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">نظرة عامة على المنصة</p>
      </motion.div>

      {error && !loading && (
        <motion.div variants={itemVariants}>
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          : metrics.map((metric, i) => (
              <motion.div key={metric.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <MetricCard {...metric} />
              </motion.div>
            ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-border/50">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LiveFeed events={liveEvents} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-border/50">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                الإحالات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {stats ? (
                <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  {[
                    { label: "إجمالي الإحالات", value: stats.referrals },
                    { label: "إجمالي المستخدمين", value: stats.users },
                    { label: "عدد المقالات", value: stats.news },
                    { label: "الإعلانات", value: stats.announcements },
                    { label: "الدورات", value: stats.courses },
                    { label: "أعضاء الاتحاد", value: stats.members },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-bold tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-5 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
