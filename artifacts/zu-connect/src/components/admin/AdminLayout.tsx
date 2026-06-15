import { useAuth } from "@/lib/auth/AuthContext";
import { useAdmin, AdminProvider } from "./AdminContext";
import { AdminSidebar } from "./AdminSidebar";
import { LogOut, User, Circle } from "lucide-react";
import { useLocation } from "wouter";

function AdminTopbar() {
  const { user, logout } = useAuth();
  const { isConnected } = useAdmin();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">لوحة التحكم</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Circle
            className={cn(
              "h-2.5 w-2.5 fill-current",
              isConnected ? "text-green-500" : "text-red-500"
            )}
          />
          {isConnected ? "متصل" : "غير متصل"}
        </div>
        <span className="text-sm text-muted-foreground">{user?.name}</span>
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

import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div dir="rtl" className="h-screen flex flex-col bg-background text-foreground">
        <AdminTopbar />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
