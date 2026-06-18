import { Link, useLocation } from "wouter";
import { Bell, Search, User, LogOut, UserPlus, Info, Award, AlertTriangle, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LottieAnimation } from "@/components/ui/lottie";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SearchModal } from "./SearchModal";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Notification {
  id: string;
  type: "info" | "achievement" | "alert" | "success";
  title: string;
  description?: string;
  timestamp: Date;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "achievement", title: "تم تحقيق إنجاز جديد!", description: "لقد أكملت 5 اختبارات بنجاح", timestamp: new Date(Date.now() - 8 * 60 * 1000) },
  { id: "n2", type: "info", title: "تحديث في الجدول", description: "تم إضافة محاضرة جديدة ليوم الأحد", timestamp: new Date(Date.now() - 60 * 60 * 1000) },
  { id: "n3", type: "alert", title: "تذكير بالاختبار", description: "اختبار الرياضيات يوم الخميس القادم", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: "n4", type: "success", title: "تم رفع الدرجة", description: "درجة اختبار اللغة العربية متاحة الآن", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: "n5", type: "info", title: "إعلان إداري", description: "تم تحديث سياسة الغياب للفصل الدراسي", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
];

function notifIcon(type: Notification["type"]) {
  switch (type) {
    case "achievement": return <Award className="w-5 h-5 text-yellow-500" />;
    case "alert": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "info": default: return <Info className="w-5 h-5 text-blue-500" />;
  }
}

function notifBg(type: Notification["type"]) {
  switch (type) {
    case "achievement": return "bg-yellow-500/10 dark:bg-yellow-500/15";
    case "alert": return "bg-orange-500/10 dark:bg-orange-500/15";
    case "success": return "bg-green-500/10 dark:bg-green-500/15";
    case "info": default: return "bg-blue-500/10 dark:bg-blue-500/15";
  }
}

export function Topbar() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [notifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [hasUnread, setHasUnread] = useState(true);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setLocation("/");
  };

  const handleNotifToggle = useCallback(() => {
    setNotifPanelOpen(prev => !prev);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
        setNotifPanelOpen(false);
      }
    };
    if (notifPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifPanelOpen]);

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
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/50"
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={handleNotifToggle}
            className="relative flex items-center justify-center min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/50"
            aria-label="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute -top-0.5 -start-0.5 w-2.5 h-2.5 bg-destructive rounded-full ring-2 ring-background" />
            )}
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

      {/* ---- Notifications Panel ---- */}
      <AnimatePresence>
        {notifPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setNotifPanelOpen(false)}
            />
            <div
              ref={notifPanelRef}
              dir="rtl"
              className={cn(
                "fixed z-50 bg-card border border-border shadow-2xl overflow-hidden",
                isMobile
                  ? "inset-x-0 bottom-0 rounded-t-2xl max-h-[70vh]"
                  : "top-[calc(4rem+8px)] left-1/2 -translate-x-1/2 w-[400px] max-h-[500px] rounded-2xl"
              )}
            >
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>
              )}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-base font-bold text-foreground">الإشعارات</h2>
                {hasUnread && (
                  <button
                    onClick={() => setHasUnread(false)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    تحديد الكل كمقروء
                  </button>
                )}
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: isMobile ? "calc(70vh - 64px)" : "calc(500px - 64px)" }}>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <Bell className="w-10 h-10 text-muted-foreground/40 mb-4" />
                    <p className="text-sm font-medium text-muted-foreground">لا توجد إشعارات جديدة</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">ستظهر هنا الإشعارات الجديدة عند ورودها</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {notifications.map((n) => (
                      <motion.button
                        key={n.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setHasUnread(false)}
                        className="w-full flex items-start gap-4 px-5 py-4 text-right hover:bg-accent/40 transition-colors border-b border-border/50 last:border-b-0 min-h-[72px]"
                      >
                        <span className={cn("shrink-0 flex items-center justify-center w-10 h-10 rounded-xl mt-0.5", notifBg(n.type))}>
                          {notifIcon(n.type)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                          {n.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                          )}
                          <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                            {formatDistanceToNow(n.timestamp, { addSuffix: true, locale: ar })}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
