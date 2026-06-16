import { useLocation, Link } from "wouter";
import { useAdmin } from "./AdminContext";
import {
  LayoutDashboard, Users, Shield, Radio, ClipboardCheck, MessageSquare,
  Gift, Trophy, Megaphone, File, Activity, BarChart, Puzzle, Send,
  Settings, ScrollText, ChevronLeft, ChevronRight, X, Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  permission: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "الرئيسية",
    items: [
      { label: "لوحة التحكم", icon: LayoutDashboard, path: "/admin", permission: "admin.view" },
    ],
  },
  {
    label: "الإدارة",
    items: [
      { label: "المستخدمون", icon: Users, path: "/admin/users", permission: "admin.users" },
      { label: "الأدوار والصلاحيات", icon: Shield, path: "/admin/roles", permission: "admin.roles" },
      { label: "سجل التدقيق", icon: ScrollText, path: "/admin/audit", permission: "admin.audit" },
    ],
  },
  {
    label: "المحتوى",
    items: [
      { label: "الإعلانات", icon: Megaphone, path: "/admin/announcements", permission: "admin.announcements" },
      { label: "الملفات", icon: File, path: "/admin/files", permission: "admin.files" },
      { label: "الإحالات", icon: Gift, path: "/admin/referrals", permission: "admin.referrals" },
      { label: "النقاط والتحديات", icon: Trophy, path: "/admin/gamification", permission: "admin.gamification" },
    ],
  },
  {
    label: "الرقابة",
    items: [
      { label: "الأحداث المباشرة", icon: Radio, path: "/admin/live", permission: "admin.live" },
      { label: "قائمة المراجعة", icon: ClipboardCheck, path: "/admin/moderation", permission: "admin.moderation" },
      { label: "الشكاوى والاقتراحات", icon: MessageSquare, path: "/admin/complaints", permission: "admin.complaints" },
      { label: "سجل النشاط", icon: Activity, path: "/admin/activity", permission: "admin.activity" },
    ],
  },
  {
    label: "التحليلات",
    items: [
      { label: "الإحصائيات", icon: BarChart, path: "/admin/analytics", permission: "admin.analytics" },
    ],
  },
  {
    label: "الإعدادات",
    items: [
      { label: "التكاملات", icon: Puzzle, path: "/admin/integrations", permission: "admin.integrations" },
      { label: "تلغرام", icon: Send, path: "/admin/telegram", permission: "admin.telegram" },
      { label: "إعدادات النظام", icon: Settings, path: "/admin/settings", permission: "admin.settings" },
    ],
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useAdmin();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location, setMobileMenuOpen]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 h-16 border-b border-border/50">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-primary-foreground">ZU</span>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight">ZU Connect</span>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors hidden md:flex"
          title={sidebarCollapsed ? "توسيع" : "طي"}
        >
          {sidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.label}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                      isActive
                        ? "bg-primary/10 text-primary font-medium shadow-sm border border-primary/10"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isActive ? "text-primary" : "group-hover:scale-110"
                    )} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    {isActive && !sidebarCollapsed && (
                      <span className="mr-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!sidebarCollapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Wrench className="h-3 w-3" />
            <span>v1.0.0</span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 border-l border-border/50 bg-background/95 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out md:hidden shadow-2xl",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      <aside
        className={cn(
          "border-l border-border/50 bg-gradient-to-b from-background to-muted/10 flex-col transition-all duration-300 ease-in-out h-full hidden md:flex",
          sidebarCollapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
