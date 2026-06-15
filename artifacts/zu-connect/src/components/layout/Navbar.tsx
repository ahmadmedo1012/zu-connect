import { Link, useLocation } from "wouter";
import { 
  Home, 
  Info, 
  Users, 
  GraduationCap, 
  Newspaper, 
  BookOpen, 
  CalendarDays, 
  MessageSquare, 
  Grid2X2, 
  Lightbulb, 
  HeartHandshake, 
  HelpCircle, 
  Library,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية", icon: Home, requiresAuth: false },
  { href: "/about", label: "عن الاتحاد", icon: Info, requiresAuth: false },
  { href: "/members", label: "أعضاء الاتحاد", icon: Users, requiresAuth: false },
  { href: "/colleges", label: "الكليات", icon: GraduationCap, requiresAuth: false },
  { href: "/news", label: "الأخبار", icon: Newspaper, requiresAuth: false },
  { href: "/courses", label: "الدورات", icon: BookOpen, requiresAuth: false },
  { href: "/planner", label: "الأنشطة", icon: CalendarDays, requiresAuth: false },
  { href: "/chat", label: "غرف النقاش", icon: MessageSquare, requiresAuth: true },
  { href: "/services", label: "الخدمات", icon: Grid2X2, requiresAuth: false },
  { href: "/suggestions", label: "اقترح", icon: Lightbulb, requiresAuth: false },
  { href: "/volunteer", label: "تطوع", icon: HeartHandshake, requiresAuth: false },
  { href: "/faq", label: "الأسئلة", icon: HelpCircle, requiresAuth: false },
  { href: "/library", label: "المكتبة", icon: Library, requiresAuth: false },
];

export function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="sticky top-16 z-40 w-full border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <ScrollArea className="w-full whitespace-nowrap" dir="rtl">
          <div className="flex w-max space-x-1 space-x-reverse p-2 px-4 md:px-6">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              const locked = link.requiresAuth && !user;
              
              return (
                <Link
                  key={link.href}
                  href={locked ? "/login" : link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all select-none border-b-2",
                    isActive 
                      ? "text-foreground border-primary bg-accent" 
                      : locked
                        ? "text-muted-foreground/50 border-transparent cursor-not-allowed"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent"
                  )}
                >
                  {locked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>
    </div>
  );
}
