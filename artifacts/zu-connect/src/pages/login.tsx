import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useToast } from "@/hooks/use-toast";
import { LottieAnimation } from "@/components/ui/lottie";
import { User, Users, ShieldAlert, KeyRound, Mail } from "lucide-react";
import { useAuth, type Role } from "@/lib/auth/AuthContext";
import logoPath from "@assets/IMG_0792_1781443006842.jpeg";
import { cn } from "@/lib/utils";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

const loginSchema = z.object({
  identifier: z.string().min(1, "الرجاء إدخال رقم القيد أو البريد الإلكتروني"),
  password: z.string().min(1, "الرجاء إدخال كلمة المرور").min(4, "كلمة المرور قصيرة جداً")
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

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
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً، ${data.name}`
      });
      setLocation("/");
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
    <div className="min-h-[calc(100dvh-16rem)] flex flex-col items-center justify-center py-8 md:py-12 px-4 md:px-6 lg:px-8 gap-8 max-w-5xl mx-auto">
      <LottieAnimation src="/animations/empty/student-illustration.json" className="w-[200px] h-[200px] md:w-[260px] md:h-[260px]" />
      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-3xl p-8 w-full max-w-[400px] flex flex-col gap-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-1 border border-border">
            <img src={logoPath} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight mt-2">تسجيل الدخول</h1>
          <p className="text-sm text-muted-foreground">أدخل بياناتك للوصول إلى خدمات المنصة</p>
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
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
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

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">
              {role === "student" ? "رقم القيد الجامعي" : "البريد الإلكتروني الجامعي"}
            </label>
            <div className="relative flex items-center">
              <span className="absolute right-3 text-muted-foreground">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setErrors(prev => { const n = {...prev}; delete n.identifier; return n; }); }}
                className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground text-left"
                dir="ltr"
                required
              />
              {errors.identifier && <span className="text-destructive text-xs">{errors.identifier}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground">كلمة المرور</label>
              <a href="#" className="text-xs text-primary font-bold hover:underline">نسيت كلمة المرور؟</a>
            </div>
            <div className="relative flex items-center">
              <span className="absolute right-3 text-muted-foreground">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => { const n = {...prev}; delete n.password; return n; }); }}
                className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground text-left"
                dir="ltr"
                required
              />
              {errors.password && <span className="text-destructive text-xs">{errors.password}</span>}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}
          <Button type="submit" size="lg" className="w-full rounded-xl font-bold mt-2" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "دخول"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
