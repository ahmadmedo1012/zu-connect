import { Link, useLocation } from "wouter";
import { Bell, Search, User, LogOut, UserPlus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LottieAnimation } from "@/components/ui/lottie";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Topbar() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setLocation("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={cn(
          "flex h-16 items-center w-full mx-auto justify-between",
          isMobile ? "px-3 gap-2" : "px-4 md:px-6 max-w-6xl"
        )}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <LottieAnimation src="/animations/illustration/logo-animation.json" className="w-9 h-9 sm:w-10 sm:h-10" />
            <img
              src="/images/union-logo.jpg"
              alt="شعار الاتحاد"
              loading="lazy"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-primary/30 ring-2 ring-background"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg leading-tight text-foreground tracking-tight">ZU Connect</span>
              {!isMobile && (
                <span className="text-xs text-muted-foreground font-medium">اتحاد طلبة جامعة الزاوية</span>
              )}
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <button
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/50"
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/50"
            aria-label="الإشعارات"
          >
            <Bell className="w-5 h-5" />
          </button>
          <ThemeToggle />
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={cn(
                  "flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all rounded-full",
                  isMobile ? "px-3 py-2.5 text-xs" : "px-4 py-2 text-sm"
                )}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div
                    className={cn(
                      "absolute top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 py-2",
                      "left-0"
                    )}
                    dir="rtl"
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === "student" ? "طالب" : user.role === "teacher" ? "أستاذ" : "إدارة"}
                      </p>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); setLocation('/profile'); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors min-h-[44px]"
                    >
                      <UserPlus className="w-4 h-4 shrink-0" />
                      دعوة صديق
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-accent transition-colors min-h-[44px]"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      تسجيل الخروج
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLocation('/login')}
              className={cn(
                "flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all rounded-full",
                isMobile ? "px-3 py-2.5 text-xs" : "px-4 py-2 text-sm"
              )}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className={cn(isMobile ? "hidden" : "hidden sm:inline")}>الدخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
