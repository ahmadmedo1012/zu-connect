import { useAuth } from "@/lib/auth/AuthContext";
import { useAdmin, AdminProvider } from "./AdminContext";
import { AdminSidebar } from "./AdminSidebar";
import { LogOut, User, Circle, Menu } from "lucide-react";
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
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md hover:bg-accent transition-colors md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold hidden sm:block">لوحة التحكم</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          <Circle
            className={cn(
              "h-2 w-2 fill-current",
              isConnected ? "text-green-500" : "text-red-500"
            )}
          />
          <span className="hidden sm:inline">{isConnected ? "متصل" : "غير متصل"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          <User className="h-3.5 w-3.5" />
          <span className="max-w-[100px] truncate">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-md hover:bg-accent transition-colors"
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
      <div dir="rtl" className="h-screen flex flex-col bg-background text-foreground">
        <AdminTopbar />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-background to-muted/20">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
