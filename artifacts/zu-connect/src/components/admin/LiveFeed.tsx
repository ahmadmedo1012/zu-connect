import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

interface LiveFeedEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
}

interface LiveFeedProps {
  events: LiveFeedEvent[];
  isLoading?: boolean;
}

const eventConfig: Record<string, { color: string; dot: string; label: string }> = {
  "admin:new_login": { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", dot: "bg-blue-500", label: "تسجيل دخول" },
  "admin:new_registration": { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500", label: "مستخدم جديد" },
  "admin:new_referral": { color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", dot: "bg-purple-500", label: "إحالة جديدة" },
  "admin:referral_rewarded": { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500", label: "مكافأة" },
  "admin:new_complaint": { color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", dot: "bg-orange-500", label: "شكوى" },
  "admin:new_suggestion": { color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20", dot: "bg-teal-500", label: "اقتراح" },
  "admin:moderation_action": { color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500", label: "مراجعة" },
  "admin:announcement_published": { color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20", dot: "bg-indigo-500", label: "إعلان" },
  "admin:system_alert": { color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", dot: "bg-red-500", label: "تنبيه" },
};

const defaultConfig = { color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground", label: "حدث" };

export function LiveFeed({ events, isLoading }: LiveFeedProps) {
  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3">
            <Skeleton variant="circle" className="h-3 w-3 shrink-0 mt-1" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton variant="text" className="h-5 w-20" />
                <Skeleton variant="text" className="h-5 w-16 hidden sm:block" />
              </div>
              <Skeleton variant="text" className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const truncate = (s: string, max: number) =>
    s.length > max ? s.slice(0, s.lastIndexOf(" ", max)) + "..." : s;

  return (
    <ScrollArea className="h-[400px] max-h-[60vh]">
      <div className="space-y-0.5 p-2 sm:p-3">
        <AnimatePresence initial={false}>
          {events.map((event, i) => {
            const cfg = eventConfig[event.type] || defaultConfig;
            const timeAgo = formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: ar });
            const displayText = event.payload?.name || event.payload?.userName || event.payload?.action || truncate(JSON.stringify(event.payload), 80);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group relative flex items-start gap-3 p-2 sm:p-3 rounded-xl hover:bg-muted/40 hover:border-l-2 hover:border-l-primary/30 transition-all duration-200 border-l-2 border-l-transparent"
              >
                <div className="relative flex flex-col items-center shrink-0 pt-1">
                  <div className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-background", cfg.dot)} />
                  {i < events.length - 1 && (
                    <div className="w-px h-full min-h-[24px] bg-primary/10 mt-1.5 rounded-b" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className={cn("text-[10px] font-semibold px-1.5 sm:px-2 py-0 leading-5 border", cfg.color)}>
                      {cfg.label}
                    </Badge>
                    <span className="hidden sm:inline text-[11px] text-muted-foreground">{timeAgo}</span>
                  </div>
                  <p className="text-sm leading-snug truncate">{displayText}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="p-3 rounded-full bg-primary/10">
              <Activity className="h-5 w-5 text-primary/60" />
            </div>
            <p className="text-sm text-muted-foreground">لا توجد أحداث حالياً</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
