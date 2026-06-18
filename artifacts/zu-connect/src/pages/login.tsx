import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useToast } from "@/hooks/use-toast";
import { User, Users, ShieldAlert, KeyRound, Mail, Gift } from "lucide-react";
import { useAuth, type Role } from "@/lib/auth/AuthContext";
import logoPath from "@assets/IMG_0792_1781443006842.jpeg";
import { cn } from "@/lib/utils";
import { containerVariants } from "@/lib/animations/variants";

const loginSchema = z.object({
  identifier: z.string().min(1, "الرجاء إدخال رقم القيد أو البريد الإلكتروني"),
  password: z.string().min(1, "الرجاء إدخال كلمة المرور").min(4, "كلمة المرور قصيرة جداً"),
});

const ROLES = [
  { id: "student", label: "طالب", icon: User },
  { id: "teacher", label: "أستاذ", icon: Users },
  { id: "admin", label: "إدارة", icon: ShieldAlert },
];

export default function Login() {
  const prefersReducedMotion = useReducedMotion();
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setReferralCode(ref);
  }, []);

  const validate = () => {
    const result = loginSchema.safeParse({ identifier, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "فشل تسجيل الدخول");
      }
      const data = await res.json();
      login(data.token, data.name, data.role as Role);

      if (referralCode) {
        try {
          const claimRes = await fetch("/api/referrals/claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: referralCode, refereeIdentifier: identifier }),
          });
          if (claimRes.ok) {
            const claimData = await claimRes.json();
            toast({
              title: "تم تسجيل الدعوة!",
              description: `تم تفعيل رمز الدعوة بنجاح. أضفت +${claimData.pointsAwarded} نقطة لصديقك!`,
            });
          }
        } catch {
          /* silent */
        }
      }

      if (data.dailyLoginPoints > 0) {
        toast({
          title: "نقاط تسجيل الدخول اليومي",
          description: `+${data.dailyLoginPoints} نقطة تسجيل الدخول اليومي 🎉`,
        });
      }

      toast({ title: "تم تسجيل الدخول بنجاح", description: `مرحباً، ${data.name}` });
      setLocation(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول");
      toast({
        title: "خطأ في تسجيل الدخول",
        description: err instanceof Error ? err.message : "فشل تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center py-8 px-4 md:px-6">
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "visible"}
        className="bg-card border border-border rounded-3xl p-6 md:p-8 w-full max-w-[420px] flex flex-col gap-6 md:gap-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white flex items-center justify-center p-1.5 border border-border shadow-sm">
            <img src={logoPath} alt="Logo" loading="lazy" width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">تسجيل الدخول</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">أدخل بياناتك للوصول إلى خدمات المنصة</p>
          </div>
        </div>

        <div className="flex bg-background border border-border p-1 rounded-xl">
          {ROLES.map(r => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                type="button"
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all min-h-[44px]",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {r.label}
              </button>
            );
          })}
        </div>

        <details className="text-xs sm:text-sm">
          <summary className="text-primary font-bold cursor-pointer select-none hover:opacity-80 transition-opacity flex items-center gap-2 min-h-[44px]">
            <Gift className="w-4 h-4" />
            لديك رمز دعوة؟
          </summary>
          <div className="mt-3">
            <input
              type="text"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value)}
              placeholder="أدخل رمز الدعوة (مثال: ZU-A1B2C3)"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground text-left"
              dir="ltr"
            />
          </div>
        </details>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-bold text-foreground">
              {role === "student" ? "رقم القيد الجامعي" : "البريد الإلكتروني الجامعي"}
            </label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={identifier}
                onChange={e => { setIdentifier(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.identifier; return n; }); }}
                className="w-full bg-background border border-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground text-left transition-all"
                dir="ltr"
                required
              />
              {errors.identifier && <span className="text-destructive text-[10px] sm:text-xs mt-1 block">{errors.identifier}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs sm:text-sm font-bold text-foreground">كلمة المرور</label>
              <a href="#" className="text-[10px] sm:text-xs text-primary font-bold hover:underline">نسيت كلمة المرور؟</a>
            </div>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.password; return n; }); }}
                className="w-full bg-background border border-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground text-left transition-all"
                dir="ltr"
                required
              />
              {errors.password && <span className="text-destructive text-[10px] sm:text-xs mt-1 block">{errors.password}</span>}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full rounded-xl font-bold mt-2 py-3.5" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "دخول"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
