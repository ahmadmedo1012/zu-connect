import { useAuth } from "@/lib/auth/AuthContext";
import { useAdmin, AdminProvider } from "./AdminContext";
import { AdminSidebar } from "./AdminSidebar";
import { LogOut, User, Circle, Menu, Bell } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const breadcrumbLabels: Record<string, string> = {
  admin: "الرئيسية",
  users: "المستخدمون",
  roles: "الأدوار والصلاحيات",
  audit: "سجل التدقيق",
  announcements: "الإعلانات",
  files: "الملفات",
  referrals: "الإحالات",
  gamification: "النقاط والتحديات",
  loyalty: "الولاء",
  live: "الأحداث المباشرة",
  moderation: "قائمة المراجعة",
  complaints: "الشكاوى والاقتراحات",
  activity: "سجل النشاط",
  analytics: "الإحصائيات",
  integrations: "التكاملات",
  telegram: "تلغرام",
  settings: "إعدادات النظام",
};

function AdminTopbar() {
  const { user, logout } = useAuth();
  const { isConnected, setMobileMenuOpen, mobileMenuOpen } = useAdmin();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const pathSegments = location.split("/").filter(Boolean);

  return (
    <header className="h-16 border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl hover:bg-accent transition-colors md:hidden"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-primary-foreground">ZU</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold leading-tight">ZU Connect</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">لوحة التحكم</p>
          </div>
        </div>
        {pathSegments.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 mr-4 pr-4 border-r border-border/40 text-xs rtl:border-r-0 rtl:border-l" aria-label="مسار الصفحة">
            {pathSegments.map((segment, idx) => {
              const label = breadcrumbLabels[segment] || segment;
              const isLast = idx === pathSegments.length - 1;
              return (
                <span key={segment} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-muted-foreground/40">/</span>}
                  <span className={cn(
                    isLast ? "font-medium" : "text-muted-foreground",
                    isLast && "text-[color:var(--color-accent-gold)]"
                  )}>
                    {label}
                  </span>
                </span>
              );
            })}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="relative p-2 rounded-xl hover:bg-accent transition-colors" aria-label="الإشعارات">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full border border-border/50">
          <Circle
            className={cn(
              "h-2 w-2 fill-current",
              isConnected ? "text-emerald-500 animate-pulse" : "text-red-500"
            )}
          />
          <span className="hidden md:hidden lg:inline">{isConnected ? "متصل" : "غير متصل"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-primary/5 to-primary/10 px-3 py-1.5 rounded-full border border-primary/10">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground max-w-[80px] truncate">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="تسجيل الخروج"
          aria-label="تسجيل الخروج"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div dir="rtl" className="admin-theme h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30 text-foreground overflow-hidden">
        <AdminTopbar />
        <div className="h-0.5 bg-gradient-to-r from-[var(--color-accent-gold)]/0 via-[var(--color-accent-gold)]/60 to-[var(--color-accent-gold)]/0 shrink-0" />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8 xl:p-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
