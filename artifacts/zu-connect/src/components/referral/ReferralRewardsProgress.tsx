import { Gift, TrendingUp } from "lucide-react";

interface Tier {
  name: string;
  threshold: number;
  icon: string;
}

interface ReferralRewardsProgressProps {
  currentPoints: number;
  progress: {
    currentTier: Tier;
    nextTier: Tier;
    pointsToNextTier: number;
    progressPercent: number;
  } | null;
  tiers: readonly Tier[];
}

export function ReferralRewardsProgress({ currentPoints, progress, tiers }: ReferralRewardsProgressProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-xl font-bold text-foreground border-r-4 border-primary pr-3 flex items-center gap-2">
        <Gift className="w-5 h-5 text-primary" />
        تقدم المكافآت
      </h3>

      <div className="flex items-center justify-between gap-4 text-sm">
        {tiers.slice(0, 4).map((tier, i) => {
          const isReached = currentPoints >= tier.threshold;
          const isNext = progress && tier.threshold === progress.nextTier.threshold;
          return (
            <div key={tier.name} className="flex flex-col items-center gap-1 flex-1">
              <span className={`text-lg ${isReached ? "opacity-100" : "opacity-30"}`}>
                {tier.icon}
              </span>
              <span
                className={`text-[10px] font-bold text-center leading-tight ${
                  isNext ? "text-primary" : isReached ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {tier.name}
              </span>
              {isNext && (
                <span className="text-[10px] text-primary font-bold">▲</span>
              )}
            </div>
          );
        })}
      </div>

      {progress && progress.pointsToNextTier > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              <TrendingUp className="w-4 h-4 inline ml-1" />
              {currentPoints} / {progress.nextTier.threshold} نقطة
            </span>
            <span className="text-primary font-bold">{progress.pointsToNextTier} نقطة متبقية</span>
          </div>
          <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-l from-primary to-primary/60 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress.progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">
            المستوى التالي: {progress.nextTier.name} — {progress.nextTier.icon}
          </p>
        </div>
      ) : currentPoints > 0 ? (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <TrendingUp className="w-5 h-5" />
            <span>لقد وصلت إلى أعلى مستوى! 🎉</span>
          </div>
          <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border">
            <div className="h-full bg-gradient-to-l from-primary to-primary/60 rounded-full w-full" />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {currentPoints} نقطة إجمالي — أسطورة الدعوات
          </p>
        </div>
      ) : null}
    </div>
  );
}
