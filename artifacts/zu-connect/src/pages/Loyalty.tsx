import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEarningActions, useLoyaltyStats, useClaimPoints } from "@/hooks/use-loyalty";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, TrendingUp, Gift, Clock, Star, Flame, BookOpen, UserPlus, Download, MessageSquare, LogIn, CalendarCheck, GraduationCap } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

const ACTION_ICONS: Record<string, typeof LogIn> = {
  daily_login: LogIn, complete_profile: UserPlus, course_enroll: BookOpen,
  course_complete: GraduationCap, event_attend: CalendarCheck, referral: UserPlus,
  library_download: Download, feedback_submit: MessageSquare,
};

export default function Loyalty() {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const { data: stats, isLoading: statsLoading } = useLoyaltyStats();
  const { data: actionsData, isLoading: actionsLoading } = useEarningActions();
  const claimMutation = useClaimPoints();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] gap-4">
        <h2 className="text-xl font-bold">الرجاء تسجيل الدخول</h2>
        <p className="text-muted-foreground">قم بتسجيل الدخول لعرض نظام النقاط</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8 max-w-6xl mx-auto px-4 md:px-6" dir="rtl">
      <motion.div variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} animate="visible" className="flex flex-col gap-6">

        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-black tracking-tight mb-1">نظام النقاط</h1>
          <p className="text-muted-foreground">اكسب النقاط واستبدلها بالمكافآت</p>
        </motion.div>

        {statsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : stats ? (
          <>
            <motion.div variants={itemVariants} className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-border rounded-3xl p-6 md:p-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-foreground">{stats.points.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">نقطة</p>
                  </div>
                </div>
                <div className="flex-1 max-w-md w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{stats.tier.currentTier?.nameAr || "برونزي"}</span>
                    <span className="text-muted-foreground">{stats.tier.nextTier?.nameAr || "الأعلى"}</span>
                  </div>
                  <Progress value={stats.tier.progress} className="h-3 rounded-full" />
                  {stats.tier.pointsToNextTier > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.tier.pointsToNextTier} نقطة للمستوى التالي
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <motion.div variants={itemVariants}>
                <Card className="p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي المعاملات</p>
                      <p className="text-xl font-bold">{stats.transactionsCount}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">المستوى الحالي</p>
                      <p className="text-xl font-bold">{stats.tier.currentTier?.nameAr || "برونزي"}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">الشارات</p>
                      <p className="text-xl font-bold">{stats.recentAchievements?.length || 0}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">آخر نشاط</p>
                      <p className="text-sm font-bold">{stats.lastActivityAt ? new Date(stats.lastActivityAt).toLocaleDateString("ar-EG") : "--"}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {stats.recentAchievements && stats.recentAchievements.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" /> أحدث الشارات
                </h2>
                <div className="flex gap-3 flex-wrap">
                  {stats.recentAchievements.map((ua: any) => (
                    <Badge key={ua.id} variant="secondary" className="text-sm px-3 py-1.5 rounded-xl">
                      {ua.achievement.icon && <span className="ml-1">{ua.achievement.icon}</span>}
                      {ua.achievement.nameAr}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> طرق كسب النقاط
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {actionsLoading ? (
                  [...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
                ) : actionsData?.actions ? (
                  actionsData.actions.map((action: any) => {
                    const Icon = ACTION_ICONS[action.actionKey] || Star;
                    return (
                      <Card key={action.id} className="p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold">{action.nameAr}</p>
                            <p className="text-xs text-muted-foreground">
                              {action.pointValue} نقطة
                              {action.dailyLimit > 0 && ` · الحد: ${action.dailyLimit}/يوم`}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => claimMutation.mutate({ actionKey: action.actionKey, idempotencyKey: `manual_${action.actionKey}_${Date.now()}` })}
                          disabled={claimMutation.isPending}
                        >
                          +{action.pointValue}
                        </Button>
                      </Card>
                    );
                  })
                ) : null}
              </div>
            </motion.div>

            {stats.recentTransactions && stats.recentTransactions.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-3">آخر المعاملات</h2>
                <Card className="rounded-2xl divide-y divide-border">
                  {stats.recentTransactions.map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-bold text-sm">{tx.actionType}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("ar-EG")}</p>
                      </div>
                      <span className={`font-bold text-lg ${tx.pointsChange > 0 ? "text-green-500" : "text-red-500"}`}>
                        {tx.pointsChange > 0 ? "+" : ""}{tx.pointsChange}
                      </span>
                    </div>
                  ))}
                </Card>
              </motion.div>
            )}
          </>
        ) : null}

      </motion.div>
    </div>
  );
}
