import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Users, ShieldAlert, KeyRound, Mail } from "lucide-react";
import logoPath from "@assets/IMG_0792_1781443006842.jpeg";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "student", label: "طالب", icon: User },
  { id: "teacher", label: "أستاذ", icon: Users },
  { id: "admin", label: "إدارة", icon: ShieldAlert },
];

export default function Login() {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    // Simulate login
    localStorage.setItem("username", identifier);
    toast({
      title: "تم تسجيل الدخول بنجاح",
      description: "مرحباً بك في منصة ZU Connect (نسخة تجريبية)"
    });
    setLocation("/");
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4">
      <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-[400px] flex flex-col gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-1 border border-border">
            <img src={logoPath} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-2">تسجيل الدخول</h1>
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
                    ? "bg-card text-white shadow-sm" 
                    : "text-muted-foreground hover:text-white"
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
            <label className="text-sm font-bold text-white">
              {role === "student" ? "رقم القيد الجامعي" : "البريد الإلكتروني الجامعي"}
            </label>
            <div className="relative flex items-center">
              <span className="absolute right-3 text-muted-foreground">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary text-white text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-white">كلمة المرور</label>
              <a href="#" className="text-xs text-primary font-bold hover:underline">نسيت كلمة المرور؟</a>
            </div>
            <div className="relative flex items-center">
              <span className="absolute right-3 text-muted-foreground">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary text-white text-left"
                dir="ltr"
                required
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-xl font-bold mt-2">
            دخول
          </Button>
        </form>
      </div>
    </div>
  );
}
