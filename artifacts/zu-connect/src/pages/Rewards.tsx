import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Gift, Star, AlertCircle, Package } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  return fetch(url, { ...options, headers });
}

export default function Rewards() {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["loyalty-rewards"],
    queryFn: async () => {
      const res = await fetch("/api/loyalty/rewards");
      if (!res.ok) throw new Error("فشل تحميل المكافآت");
      return res.json();
    },
    staleTime: 30_000,
  });

  const { data: stats } = useQuery({
    queryKey: ["loyalty-stats"],
    queryFn: async () => {
      const res = await authFetch("/api/loyalty/stats");
      if (!res.ok) throw new Error("فشل تحميل الرصيد");
      return res.json();
    },
    enabled: !!user,
    staleTime: 10_000,
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      const res = await authFetch(`/api/loyalty/rewards/${rewardId}/redeem`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast({ title: "تم الاستبدال!", description: "تم استبدال المكافأة بنجاح. سيتم التواصل معك قريباً." });
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty-stats"] });
      setConfirmOpen(false);
    },
    onError: (err: Error) => {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    },
  });

  const rewards = data?.items ?? [];
  const userPoints = stats?.points ?? 0;

  return (
    <div className="flex flex-col gap-6 py-8 max-w-6xl mx-auto px-4 md:px-6" dir="rtl">
      <motion.div variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} animate="visible" className="flex flex-col gap-6">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">المكافآت</h1>
            <p className="text-muted-foreground">استبدل نقاطك بمكافآت رائعة</p>
          </div>
          {user && (
            <Badge variant="secondary" className="text-lg px-4 py-2 rounded-xl gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              {userPoints.toLocaleString()} نقطة
            </Badge>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : rewards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Package className="w-16 h-16 text-muted-foreground" />
            <p className="text-lg font-bold">لا توجد مكافآت متاحة حالياً</p>
            <p className="text-sm text-muted-foreground">ترقب المزيد من المكافآت قريباً</p>
          </div>
        ) : (
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward: any) => {
              const isOutOfStock = !reward.inStock;
              const isExpired = reward.expiresAt && new Date(reward.expiresAt) < new Date();
              const cannotAfford = userPoints < reward.pointCost;
              const disabled = isOutOfStock || isExpired || !user;

              return (
                <Card
                  key={reward.id}
                  className={`rounded-2xl overflow-hidden flex flex-col ${disabled ? "opacity-60" : ""}`}
                >
                  {reward.imageUrl && (
                    <div className="h-32 bg-muted flex items-center justify-center">
                      <img src={reward.imageUrl} alt={reward.nameAr} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{reward.nameAr}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{reward.descriptionAr}</p>
                      </div>
                      <Badge className="rounded-full">{reward.rewardType === "digital" ? "رقمي" : "مادي"}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-lg">{reward.pointCost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpired ? (
                          <span className="text-xs text-destructive">منتهية الصلاحية</span>
                        ) : isOutOfStock ? (
                          <span className="text-xs text-destructive">نفد من المخزون</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            المخزون: {reward.stock === -1 ? "غير محدود" : reward.stock}
                          </span>
                        )}
                        <Button
                          size="sm"
                          className="rounded-xl"
                          disabled={disabled || cannotAfford}
                          onClick={() => {
                            setSelectedReward(reward);
                            setConfirmOpen(true);
                          }}
                        >
                          استبدال
                        </Button>
                      </div>
                    </div>
                    {cannotAfford && !disabled && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        النقاط غير كافية (تحتاج {reward.pointCost - userPoints} نقطة إضافية)
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </motion.div>
        )}

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="rounded-2xl max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" /> تأكيد الاستبدال
              </DialogTitle>
              <DialogDescription>
                هل أنت متأكد من استبدال نقاطك بـ "{selectedReward?.nameAr}"؟
              </DialogDescription>
            </DialogHeader>
            {selectedReward && (
              <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                <span className="font-bold">{selectedReward.nameAr}</span>
                <span className="font-bold text-lg">{selectedReward.pointCost.toLocaleString()} نقطة</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span>رصيدك الحالي</span>
              <span className="font-bold">{userPoints.toLocaleString()} نقطة</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>الرصيد بعد الاستبدال</span>
              <span className="font-bold">
                {(userPoints - (selectedReward?.pointCost ?? 0)).toLocaleString()} نقطة
              </span>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="rounded-xl flex-1" onClick={() => setConfirmOpen(false)}>
                إلغاء
              </Button>
              <Button
                className="rounded-xl flex-1"
                onClick={() => redeemMutation.mutate(selectedReward.id)}
                disabled={redeemMutation.isPending}
              >
                {redeemMutation.isPending ? "جاري..." : "تأكيد الاستبدال"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
