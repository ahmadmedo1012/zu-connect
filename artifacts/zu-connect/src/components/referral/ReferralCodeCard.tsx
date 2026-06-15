import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Link, RefreshCw, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";

interface ReferralCodeCardProps {
  code: string | null;
  shareUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isRegenerating: boolean;
  onCopyCode: () => void;
  onCopyLink: () => void;
  onRegenerate: () => void;
}

export function ReferralCodeCard({
  code,
  shareUrl,
  isLoading,
  error,
  isRegenerating,
  onCopyCode,
  onCopyLink,
  onRegenerate,
}: ReferralCodeCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyCode = async () => {
    await onCopyCode();
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await onCopyLink();
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setShowRegenConfirm(false);
    onRegenerate();
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4" dir="rtl">
      <h3 className="text-xl font-bold text-foreground border-r-4 border-primary pr-3">رمز الدعوة الخاص بك</h3>

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton variant="rect" className="w-48 h-12 rounded-xl" />
          <div className="flex gap-3">
            <Skeleton variant="rect" className="h-10 w-28 rounded-xl" />
            <Skeleton variant="rect" className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      )}

      {error && !code && (
        <div className="flex flex-col gap-3 items-center py-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="rounded-xl">
            إعادة المحاولة
          </Button>
        </div>
      )}

      {code && (
        <>
          <div className="bg-background border border-border rounded-xl py-4 px-6 text-center">
            <span className="text-3xl md:text-4xl font-black text-foreground tracking-widest font-mono" dir="ltr">
              {code}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={handleCopyCode}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              {codeCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {codeCopied ? "تم النسخ!" : "نسخ الرمز"}
            </motion.button>

            {shareUrl && (
              <motion.button
                onClick={handleCopyLink}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 bg-background border border-border hover:bg-accent text-foreground px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                {linkCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Link className="w-4 h-4" />
                )}
                {linkCopied ? "تم نسخ الرابط!" : "نسخ الرابط"}
              </motion.button>
            )}
          </div>

          <details className="text-sm mt-2">
            <summary
              className="text-primary font-bold cursor-pointer select-none hover:opacity-80 transition-opacity"
              onClick={() => setShowRegenConfirm(false)}
            >
              تغيير الرمز
            </summary>
            <div className="mt-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex flex-col gap-3">
              <p className="text-sm text-destructive font-semibold">
                تحذير: تغيير الرمز سيلغي الرمز القديم وستحتاج إلى مشاركة الجديد مع أصدقائك.
              </p>
              {showRegenConfirm ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRegenConfirm(false)}
                    className="rounded-xl"
                  >
                    إلغاء
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="rounded-xl"
                  >
                    {isRegenerating ? "جاري التغيير..." : "تأكيد التغيير"}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRegenConfirm(true)}
                  className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <RefreshCw className="w-4 h-4 ml-1" />
                  تغيير الرمز
                </Button>
              )}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
