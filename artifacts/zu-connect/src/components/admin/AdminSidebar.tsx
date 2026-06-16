import { useLocation, Link } from "wouter";
import { useAdmin } from "./AdminContext";
import {
  LayoutDashboard, Users, Shield, Radio, ClipboardCheck, MessageSquare,
  Gift, Trophy, Megaphone, File, Activity, BarChart, Puzzle, Send,
  Settings, ScrollText, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  permission: string;
}

const navItems: NavItem[] = [
  { label: "لوحة التحكم", icon: LayoutDashboard, path: "/admin", permission: "admin.view" },
  { label: "المستخدمون", icon: Users, path: "/admin/users", permission: "admin.users" },
  { label: "الأدوار والصلاحيات", icon: Shield, path: "/admin/roles", permission: "admin.roles" },
  { label: "الأحداث المباشرة", icon: Radio, path: "/admin/live", permission: "admin.live" },
  { label: "قائمة المراجعة", icon: ClipboardCheck, path: "/admin/moderation", permission: "admin.moderation" },
  { label: "الشكاوى والاقتراحات", icon: MessageSquare, path: "/admin/complaints", permission: "admin.complaints" },
  { label: "الإحالات", icon: Gift, path: "/admin/referrals", permission: "admin.referrals" },
  { label: "النقاط والتحديات", icon: Trophy, path: "/admin/gamification", permission: "admin.gamification" },
  { label: "الإعلانات", icon: Megaphone, path: "/admin/announcements", permission: "admin.announcements" },
  { label: "الملفات", icon: File, path: "/admin/files", permission: "admin.files" },
  { label: "سجل النشاط", icon: Activity, path: "/admin/activity", permission: "admin.activity" },
  { label: "الإحصائيات", icon: BarChart, path: "/admin/analytics", permission: "admin.analytics" },
  { label: "التكاملات", icon: Puzzle, path: "/admin/integrations", permission: "admin.integrations" },
  { label: "تلغرام", icon: Send, path: "/admin/telegram", permission: "admin.telegram" },
  { label: "إعدادات النظام", icon: Settings, path: "/admin/settings", permission: "admin.settings" },
  { label: "سجل التدقيق", icon: ScrollText, path: "/admin/audit", permission: "admin.audit" },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useAdmin();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location, setMobileMenuOpen]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-3 border-b border-border h-14">
        {!sidebarCollapsed && (
          <span className="font-bold text-sm tracking-wide">ZU Connect</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors hidden md:block"
          title={sidebarCollapsed ? "توسيع" : "طي"}
        >
          {sidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="p-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">ZU Connect Admin</p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar (overlay) */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 border-l border-border bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "border-l border-border bg-sidebar text-sidebar-foreground flex-col transition-all duration-300 h-full hidden md:flex",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
