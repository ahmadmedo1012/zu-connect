import { useEffect } from "react";
import { useLocation } from "wouter";
import { UserPlus } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie";
import { useAuth } from "@/lib/auth/AuthContext";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useReferral } from "@/hooks/use-referral";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ReferralStatsCards } from "@/components/referral/ReferralStatsCards";
import { ReferralHistoryTable } from "@/components/referral/ReferralHistoryTable";
import { ReferralRewardsProgress } from "@/components/referral/ReferralRewardsProgress";

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user]);

  const {
    code,
    shareUrl,
    stats,
    history,
    isLoading,
    error,
    copyCode,
    copyLink,
    regenerateCode,
    isRegenerating,
    progress,
    tiers,
  } = useReferral();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-4">
        <LottieAnimation src="/animations/illustration/team-illustration.json" className="w-[120px] h-[120px] self-start" />
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">برنامج الدعوات</h1>
        <p className="text-muted-foreground">ادعُ أصدقاءك للانضمام للمنصة واربح النقاط والمكافآت.</p>
      </div>

      {!code && !isLoading && !error && (
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">أنشئ رمز الدعوة الخاص بك</h2>
          <p className="text-muted-foreground max-w-md">
            احصل على رمز فريد لمشاركته مع أصدقائك. كل صديق ينضم عبر رمزك يمنحك نقاطاً إضافية!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-colors"
          >
            إنشاء رمز الدعوة
          </button>
        </div>
      )}

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
