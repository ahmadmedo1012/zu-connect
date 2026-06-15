import { Link, useLocation } from "wouter";
import { Bell, Search, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LottieAnimation } from "@/components/ui/lottie";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";


export function Topbar() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6 w-full max-w-7xl mx-auto justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <LottieAnimation src="/animations/illustration/logo-animation.json" className="w-10 h-10" />
            <img
              src="/images/union-logo.jpg"
              alt="شعار الاتحاد"
              loading="lazy"
              className="w-9 h-9 rounded-full object-cover border-2 border-primary/30 ring-2 ring-background"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-foreground tracking-tight">ZU Connect</span>
              <span className="text-xs text-muted-foreground font-medium">اتحاد طلبة جامعة الزاوية</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="بحث">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="الإشعارات">
            <Bell className="w-5 h-5" />
          </button>
          <ThemeToggle />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold transition-all ml-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 py-2">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === "student" ? "طالب" : user.role === "teacher" ? "أستاذ" : "إدارة"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setLocation('/login')}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold transition-all ml-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">الدخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
