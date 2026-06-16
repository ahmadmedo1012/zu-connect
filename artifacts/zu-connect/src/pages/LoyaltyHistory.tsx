import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

async function authFetch(url: string) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error("فشل تحميل المعاملات");
  return res.json();
}

export default function LoyaltyHistory() {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [page, setPage] = useState(1);
  const [actionType, setActionType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const limit = 20;

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (actionType) params.set("actionType", actionType);
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);

  const { data, isLoading } = useQuery({
    queryKey: ["loyalty-transactions", page, actionType, dateFrom, dateTo],
    queryFn: () => authFetch(`/api/loyalty/transactions?${params}`),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] gap-4">
        <h2 className="text-xl font-bold">الرجاء تسجيل الدخول</h2>
        <p className="text-muted-foreground">قم بتسجيل الدخول لعرض سجل النقاط</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8 max-w-6xl mx-auto px-4 md:px-6" dir="rtl">
      <motion.div variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} animate="visible" className="flex flex-col gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-black tracking-tight mb-1">سجل النقاط</h1>
          <p className="text-muted-foreground">تصفح جميع معاملات النقاط الخاصة بك</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground">نوع الإجراء</label>
            <select
              value={actionType}
              onChange={e => { setActionType(e.target.value); setPage(1); }}
              className="bg-background border border-border rounded-xl px-3 py-2 text-sm"
            >
              <option value="">الكل</option>
              <option value="daily_login">تسجيل الدخول اليومي</option>
              <option value="referral">دعوة صديق</option>
              <option value="course_enroll">تسجيل في دورة</option>
              <option value="course_complete">إكمال دورة</option>
              <option value="event_attend">حضور فعالية</option>
              <option value="library_download">تحميل مورد</option>
              <option value="feedback_submit">تقديم اقتراح</option>
              <option value="reward_redemption">استبدال مكافأة</option>
              <option value="admin_adjustment">تعديل إداري</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground">من تاريخ</label>
            <Input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="rounded-xl" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground">إلى تاريخ</label>
            <Input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} className="rounded-xl" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : data ? (
          <>
            <motion.div variants={itemVariants}>
              <Card className="rounded-2xl divide-y divide-border">
                {data.items.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">لا توجد معاملات بعد</div>
                ) : data.items.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-sm">{tx.actionType}</p>
                      {tx.adminNote && <p className="text-xs text-muted-foreground">{tx.adminNote}</p>}
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-left">
                      <span className={`font-bold text-lg block ${tx.pointsChange > 0 ? "text-green-500" : "text-red-500"}`}>
                        {tx.pointsChange > 0 ? "+" : ""}{tx.pointsChange}
                      </span>
                      <span className="text-xs text-muted-foreground">الرصيد: {tx.balanceAfter}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </motion.div>

            {data.pagination.totalPages > 1 && (
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
                <Button
                  variant="outline" size="sm" className="rounded-xl"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  الصفحة {data.pagination.page} من {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline" size="sm" className="rounded-xl"
                  onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page >= data.pagination.totalPages}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
