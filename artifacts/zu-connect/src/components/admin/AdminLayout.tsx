import { useAuth } from "@/lib/auth/AuthContext";
import { useAdmin, AdminProvider } from "./AdminContext";
import { AdminSidebar } from "./AdminSidebar";
import { LogOut, User, Circle, Menu, Bell } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

function AdminTopbar() {
  const { user, logout } = useAuth();
  const { isConnected, setMobileMenuOpen, mobileMenuOpen } = useAdmin();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <header className="h-16 border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl hover:bg-accent transition-colors md:hidden"
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
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="relative p-2 rounded-xl hover:bg-accent transition-colors">
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
          <span className="hidden sm:inline">{isConnected ? "متصل" : "غير متصل"}</span>
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
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
