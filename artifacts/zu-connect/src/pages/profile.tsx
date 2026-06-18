import { useEffect } from "react";
import { useLocation } from "wouter";
import { UserPlus, Award } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useReferral } from "@/hooks/use-referral";
import { useLoyaltyStats } from "@/hooks/use-loyalty";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ReferralStatsCards } from "@/components/referral/ReferralStatsCards";
import { ReferralHistoryTable } from "@/components/referral/ReferralHistoryTable";
import { ReferralRewardsProgress } from "@/components/referral/ReferralRewardsProgress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) setLocation("/login");
  }, [user, authLoading]);

  const {
    code,
    shareUrl,
    stats: refStats,
    history,
    isLoading,
    error,
    copyCode,
    copyLink,
    generateCode,
    regenerateCode,
    isGenerating,
    isRegenerating,
    progress,
    tiers,
  } = useReferral();

  const { data: loyaltyStats } = useLoyaltyStats();

  if (authLoading) return <div className="min-h-[50vh]" />;
  if (!user) return null;

  const stats = refStats;
  const showNoCodeCTA = !code && !isLoading && !error;
  const showCodeCard = !!code || !!error || isLoading;

  return (
    <div className="flex flex-col gap-6 md:gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">برنامج الدعوات</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">ادعُ أصدقاءك للانضمام للمنصة واربح النقاط والمكافآت.</p>
      </div>

      {loyaltyStats?.recentAchievements?.length > 0 && (
        <Card className="rounded-2xl p-5 md:p-6">
          <h2 className="text-base md:text-lg font-bold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> شاراتي
          </h2>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {loyaltyStats.recentAchievements.map((ua: any) => (
              <Badge key={ua.id} variant="secondary" className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-xl">
                {ua.achievement.icon && <span className="ml-1">{ua.achievement.icon}</span>}
                {ua.achievement.nameAr}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {showNoCodeCTA && (
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">أنشئ رمز الدعوة الخاص بك</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
              احصل على رمز فريد لمشاركته مع أصدقائك. كل صديق ينضم عبر رمزك يمنحك نقاطاً إضافية!
            </p>
          </div>
          <button
            onClick={() => generateCode()}
            disabled={isGenerating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 sm:px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[44px]"
          >
            {isGenerating ? "جاري إنشاء الرمز..." : "إنشاء رمز الدعوة"}
          </button>
        </div>
      )}

      {showCodeCard && (
        <ReferralCodeCard
          code={code}
          shareUrl={shareUrl}
          isLoading={isLoading}
          error={error}
          isRegenerating={isRegenerating}
          onCopyCode={copyCode}
          onCopyLink={copyLink}
          onRegenerate={regenerateCode}
        />
      )}

      <ReferralStatsCards stats={stats} isLoading={isLoading} />

      {stats && (
        <ReferralRewardsProgress
          currentPoints={stats.totalPointsEarned}
          progress={progress}
          tiers={tiers}
        />
      )}

      <ReferralHistoryTable
        history={history}
        isLoading={isLoading}
        onShare={copyLink}
      />
    </div>
  );
}
