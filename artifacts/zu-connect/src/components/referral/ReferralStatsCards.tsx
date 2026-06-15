import { motion } from "framer-motion";
import { Users, Gift, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import type { ReferralStats } from "@/hooks/use-referral";

interface ReferralStatsCardsProps {
  stats: ReferralStats | null;
  isLoading: boolean;
}

function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
      <Skeleton variant="circle" className="w-12 h-12 rounded-xl" />
      <Skeleton variant="text" className="w-20 h-8" />
      <Skeleton variant="text" className="w-24 h-4" />
    </div>
  );
}

export function ReferralStatsCards({ stats, isLoading }: ReferralStatsCardsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial={prefersReducedMotion ? undefined : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      <motion.div
        variants={itemVariants}
        className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-2"
      >
        <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary">
          <Users className="w-6 h-6" />
        </div>
        <span className="text-4xl font-black text-foreground">{stats?.totalReferrals ?? 0}</span>
        <span className="text-muted-foreground font-semibold text-sm">عدد الدعوات</span>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-2"
      >
        <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary">
          <Gift className="w-6 h-6" />
        </div>
        <span className="text-4xl font-black text-foreground">{stats?.totalPointsEarned ?? 0}</span>
        <span className="text-muted-foreground font-semibold text-sm">النقاط المكتسبة</span>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-2"
      >
        <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary">
          <Trophy className="w-6 h-6" />
        </div>
        <span className="text-4xl font-black text-foreground">{stats?.rank ? `#${stats.rank}` : "—"}</span>
        <span className="text-muted-foreground font-semibold text-sm">الترتيب</span>
      </motion.div>
    </motion.div>
  );
}
