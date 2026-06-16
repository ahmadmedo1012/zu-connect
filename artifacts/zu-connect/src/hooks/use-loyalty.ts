import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  return fetch(url, { ...options, headers });
}

export function useEarningActions() {
  return useQuery({
    queryKey: ["loyalty-actions"],
    queryFn: async () => {
      const res = await fetch("/api/loyalty/actions");
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "فشل تحميل الإجراءات" }));
        throw new Error(err.error);
      }
      return res.json();
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function useClaimPoints() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ actionKey, referenceId, idempotencyKey }: { actionKey: string; referenceId?: number; idempotencyKey?: string }) => {
      const res = await authFetch(`/api/loyalty/actions/${actionKey}/claim`, {
        method: "POST",
        body: JSON.stringify({ referenceId, idempotencyKey }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "فشل صرف النقاط" }));
        throw new Error(err.error);
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.pointsAwarded > 0) {
        toast({
          title: "تمت إضافة النقاط!",
          description: data.message,
        });
      }
      if (data.newAchievements?.length > 0) {
        toast({
          title: "تهانينا!",
          description: `حصلت على ${data.newAchievements.length} شارة جديدة!`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["loyalty-stats"] });
    },
    onError: (err: Error) => {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    },
  });
}

export function useLoyaltyStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["loyalty-stats"],
    queryFn: async () => {
      const res = await authFetch("/api/loyalty/stats");
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
}
