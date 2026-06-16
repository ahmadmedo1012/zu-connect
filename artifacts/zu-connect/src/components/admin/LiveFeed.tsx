import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

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

const eventStyles: Record<string, { color: string; label: string }> = {
  "admin:new_login": { color: "bg-blue-500", label: "تسجيل دخول" },
  "admin:new_registration": { color: "bg-green-500", label: "مستخدم جديد" },
  "admin:new_referral": { color: "bg-purple-500", label: "إحالة جديدة" },
  "admin:referral_rewarded": { color: "bg-yellow-500", label: "مكافأة إحالة" },
  "admin:new_complaint": { color: "bg-orange-500", label: "شكوى جديدة" },
  "admin:new_suggestion": { color: "bg-teal-500", label: "اقتراح جديد" },
  "admin:moderation_action": { color: "bg-red-500", label: "إجراء مراجعة" },
  "admin:announcement_published": { color: "bg-indigo-500", label: "إعلان منشور" },
  "admin:system_alert": { color: "bg-red-600", label: "تنبيه نظام" },
};

export function LiveFeed({ events, isLoading }: LiveFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  const truncate = (s: string, max: number) =>
    s.length > max ? s.slice(0, s.lastIndexOf(" ", max)) + "…" : s;

  return (
    <ScrollArea className="h-[400px] max-h-[60vh]">
      <div className="space-y-1 p-2">
        <AnimatePresence initial={false}>
          {events.map((event, i) => {
            const style = eventStyles[event.type] || { color: "bg-gray-500", label: event.type };
            const timeAgo = formatDistanceToNow(new Date(event.timestamp), { addSuffix: true, locale: ar });
            const displayText = event.payload?.name || event.payload?.userName || event.payload?.action || truncate(JSON.stringify(event.payload), 80);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, delay: i === 0 ? 0 : 0 }}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", style.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{style.label}</Badge>
                    <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
                  </div>
                  <p className="text-sm mt-0.5 truncate">{displayText}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">لا توجد أحداث حالياً</p>
        )}
      </div>
    </ScrollArea>
  );
}
