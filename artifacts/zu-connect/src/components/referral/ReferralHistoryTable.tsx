import { motion } from "framer-motion";
import { Clock, CheckCircle, Gift, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import { Button } from "@/components/ui/button";
import type { ReferralRecord } from "@/hooks/use-referral";

interface ReferralHistoryTableProps {
  history: ReferralRecord[];
  isLoading: boolean;
  onShare?: () => void;
}

const STATUS_CONFIG = {
  pending: {
    label: "معلق",
    class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  completed: {
    label: "مكتمل",
    class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  rewarded: {
    label: "مكافأ",
    class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Gift,
  },
  expired: {
    label: "منتهي",
    class: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    icon: XCircle,
  },
} as const;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50 last:border-0">
      <Skeleton variant="text" className="w-16 h-4" />
      <Skeleton variant="text" className="w-24 h-4" />
      <Skeleton variant="rect" className="w-16 h-6 rounded-full" />
      <Skeleton variant="text" className="w-12 h-4" />
    </div>
  );
}

export function ReferralHistoryTable({ history, isLoading, onShare }: ReferralHistoryTableProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-xl font-bold text-foreground border-r-4 border-primary pr-3">سجل الدعوات</h3>

      {isLoading && (
        <div className="flex flex-col">
          {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
        </div>
      )}

      {!isLoading && history.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-bold text-lg">لم تقم بدعوة أحد بعد</p>
            <p className="text-muted-foreground text-sm mt-1">ابدأ الآن بمشاركة رمز الدعوة مع أصدقائك</p>
          </div>
          {onShare && (
            <Button variant="outline" onClick={onShare} className="rounded-xl mt-2">
              مشاركة رمز الدعوة
            </Button>
          )}
        </div>
      )}

      {!isLoading && history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-right py-3 px-2 font-semibold">التاريخ</th>
                <th className="text-right py-3 px-2 font-semibold">الاسم</th>
                <th className="text-right py-3 px-2 font-semibold">الحالة</th>
                <th className="text-center py-3 px-2 font-semibold">النقاط</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial={prefersReducedMotion ? undefined : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.1 }}
            >
              {history.map((record) => {
                const statusCfg = STATUS_CONFIG[record.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;
                return (
                  <motion.tr
                    key={record.id}
                    variants={itemVariants}
                    className="border-b border-border/30 hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                      {formatDate(record.completedAt || record.firstContactAt)}
                    </td>
                    <td className="py-3 px-2 text-foreground font-medium">
                      {record.refereeName || record.refereeIdentifier || "غير معروف"}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusCfg.class}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-bold">
                      {record.pointsAwarded > 0 ? (
                        <span className="text-primary">+{record.pointsAwarded}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  );
}
