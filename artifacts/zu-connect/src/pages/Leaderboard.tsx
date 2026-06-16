import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, User, Star, Award, Users, TrendingUp } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import { useAuth } from "@/lib/auth/AuthContext";

const SORT_TABS = [
  { key: "points", label: "النقاط", icon: Star },
  { key: "referrals", label: "الدعوات", icon: Users },
  { key: "achievements", label: "الشارات", icon: Award },
];

async function authFetch(url: string) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("فشل تحميل البيانات");
  return res.json();
}

export default function Leaderboard() {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [sortBy, setSortBy] = useState("points");

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", sortBy],
    queryFn: () => authFetch(`/api/loyalty/leaderboard?sortBy=${sortBy}&limit=50`),
    staleTime: 60_000,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  };

  return (
    <div className="flex flex-col gap-6 py-8 max-w-6xl mx-auto px-4 md:px-6" dir="rtl">
      <motion.div variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} animate="visible" className="flex flex-col gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-black tracking-tight mb-1">لوحة المتصدرين</h1>
          <p className="text-muted-foreground">تصدر قائمة الطلاب الأكثر نشاطاً على المنصة</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-2">
          {SORT_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSortBy(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  sortBy === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {data?.myRank && (
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl p-4 bg-primary/5 border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-bold">ترتيبك: #{data.myRank}</span>
              </div>
              <span className="text-sm text-muted-foreground">من أصل {data.totalUsers} مستخدم</span>
            </Card>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : data?.items ? (
          <motion.div variants={itemVariants} className="space-y-1">
            {data.items.map((entry: any) => {
              const isMe = user?.id === entry.id;
              return (
                <Card
                  key={entry.id}
                  className={`rounded-xl flex items-center justify-between p-4 transition-all ${
                    isMe ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm flex items-center gap-2">
                        {entry.name}
                        {isMe && <Badge variant="default" className="text-[10px] px-1.5 py-0 rounded">هذا أنت</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.points} نقطة · {entry.referralCount} دعوات · {entry.achievementCount} شارة
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">نقطة</p>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        ) : null}

        {data?.items?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Users className="w-16 h-16 text-muted-foreground" />
            <p className="text-lg font-bold">لا يوجد متصدرين بعد</p>
            <p className="text-sm text-muted-foreground">ابدأ بكسب النقاط لتظهر في القائمة</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
