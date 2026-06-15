import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  totalPointsEarned: number;
  monthlyPointsEarned: number;
  rank?: number;
}

export interface ReferralRecord {
  id: number;
  refereeName: string | null;
  refereeIdentifier: string | null;
  status: "pending" | "completed" | "rewarded" | "expired";
  pointsAwarded: number;
  firstContactAt: string | null;
  completedAt: string | null;
  rewardedAt: string | null;
}

interface StatsResponse {
  code: string | null;
  shareUrl: string | null;
  stats: ReferralStats;
  history: ReferralRecord[];
}

interface CodeResponse {
  code: string;
  shareUrl: string;
}

const CACHE_KEY_CODE = "referral_code";
const CACHE_KEY_STATS = "referral_stats";
const CACHE_KEY_TOASTED = "referral_claimed_toast";

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...options, headers });
}

const TIERS = [
  { name: "المبتدئ", threshold: 0, icon: "🌱" },
  { name: "المروج", threshold: 100, icon: "📢" },
  { name: "السفير", threshold: 500, icon: "🎖️" },
  { name: "المؤثر", threshold: 1000, icon: "🏆" },
  { name: "الأسطورة", threshold: 5000, icon: "👑" },
] as const;

export function getReferralProgress(currentPoints: number) {
  const nextIndex = TIERS.findIndex(t => currentPoints < t.threshold);
  if (nextIndex === -1) {
    return {
      currentTier: TIERS[TIERS.length - 1],
      nextTier: TIERS[TIERS.length - 1],
      pointsToNextTier: 0,
      progressPercent: 100,
    };
  }
  const currentTier = TIERS[Math.max(0, nextIndex - 1)];
  const nextTier = TIERS[nextIndex];
  const pointsToNextTier = nextTier.threshold - currentPoints;
  const range = nextTier.threshold - currentTier.threshold;
  const progressPercent = range > 0 ? ((currentPoints - currentTier.threshold) / range) * 100 : 100;
  return {
    currentTier,
    nextTier,
    pointsToNextTier,
    progressPercent: Math.min(progressPercent, 100),
  };
}

function readCache<T>(key: string): T | null {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

function shouldShowToast(referralId: number): boolean {
  const toasted: number[] = readCache(CACHE_KEY_TOASTED) ?? [];
  return !toasted.includes(referralId);
}

function markToastShown(referralId: number) {
  const toasted: number[] = readCache(CACHE_KEY_TOASTED) ?? [];
  if (!toasted.includes(referralId)) {
    toasted.push(referralId);
    writeCache(CACHE_KEY_TOASTED, toasted);
  }
}

export function useReferral() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [cachedCode, setCachedCode] = useState<string | null>(() => {
    const stored = localStorage.getItem(CACHE_KEY_CODE);
    return stored ?? null;
  });

  const [cachedStats, setCachedStats] = useState<ReferralStats | null>(() => {
    return readCache(CACHE_KEY_STATS);
  });

  const statsQuery = useQuery<StatsResponse>({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      const res = await authFetch("/api/referrals/stats");
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "فشل تحميل الإحصائيات" }));
        throw new Error(err.error);
      }
      return res.json();
    },
    enabled: !!user,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  useEffect(() => {
    if (statsQuery.data) {
      if (statsQuery.data.code) {
        localStorage.setItem(CACHE_KEY_CODE, statsQuery.data.code);
        setCachedCode(statsQuery.data.code);
      }
      if (statsQuery.data.stats) {
        writeCache(CACHE_KEY_STATS, statsQuery.data.stats);
        setCachedStats(statsQuery.data.stats);
      }
      const newRewards = statsQuery.data.history.filter(
        r => r.status === "rewarded" && r.pointsAwarded > 0 && shouldShowToast(r.id)
      );
      for (const reward of newRewards) {
        markToastShown(reward.id);
        toast({
          title: "تم تسجيل دعوتك!",
          description: `أضفت +${reward.pointsAwarded} نقطة إلى رصيدك. شكراً لدعوة أصدقائك!`,
        });
      }
    }
  }, [statsQuery.data]);

  const generateMutation = useMutation<CodeResponse, Error, void>({
    mutationFn: async () => {
      const res = await authFetch("/api/referrals/generate", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "فشل إنشاء الرمز" }));
        throw new Error(err.error);
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem(CACHE_KEY_CODE, data.code);
      setCachedCode(data.code);
      queryClient.invalidateQueries({ queryKey: ["referral-stats"] });
    },
    onError: (err) => {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    },
  });

  const regenerateMutation = useMutation<CodeResponse, Error, void>({
    mutationFn: async () => {
      const res = await authFetch("/api/referrals/regenerate", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "فشل تغيير الرمز" }));
        throw new Error(err.error);
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem(CACHE_KEY_CODE, data.code);
      setCachedCode(data.code);
      toast({ title: "تم تغيير الرمز بنجاح", description: "رمز الدعوة الجديد جاهز للاستخدام" });
      queryClient.invalidateQueries({ queryKey: ["referral-stats"] });
    },
    onError: (err) => {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    },
  });

  const copyCode = useCallback(async () => {
    if (!cachedCode) return;
    try {
      await navigator.clipboard.writeText(cachedCode);
      toast({ title: "تم نسخ الرمز!", description: `تم نسخ ${cachedCode}` });
    } catch {
      toast({ title: "فشل النسخ", description: "تعذر النسخ إلى الحافظة", variant: "destructive" });
    }
  }, [cachedCode, toast]);

  const copyLink = useCallback(async () => {
    const shareUrl = `${window.location.origin}/login?ref=${cachedCode}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "تم نسخ رابط الدعوة!", description: "شارك الرابط مع أصدقائك" });
    } catch {
      toast({ title: "فشل النسخ", description: "تعذر نسخ الرابط", variant: "destructive" });
    }
  }, [cachedCode, toast]);

  const stats = statsQuery.data?.stats ?? cachedStats;
  const history = statsQuery.data?.history ?? [];
  const code = statsQuery.data?.code ?? cachedCode;
  const shareUrl = statsQuery.data?.shareUrl ?? (cachedCode ? `${window.location.origin}/login?ref=${cachedCode}` : null);
  const isLoading = statsQuery.isLoading;
  const error = statsQuery.error instanceof Error ? statsQuery.error.message : null;

  const progress = stats ? getReferralProgress(stats.totalPointsEarned) : null;
  const currentTier = progress?.currentTier ?? TIERS[0];

  return {
    code,
    shareUrl,
    stats,
    history,
    isLoading,
    error,
    copyCode,
    copyLink,
    generateCode: generateMutation.mutate,
    regenerateCode: regenerateMutation.mutate,
    isGenerating: generateMutation.isPending,
    isRegenerating: regenerateMutation.isPending,
    progress,
    currentTier,
    tiers: TIERS,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["referral-stats"] }),
  };
}
