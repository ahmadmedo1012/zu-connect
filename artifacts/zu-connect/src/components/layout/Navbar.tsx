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
  Library
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/about", label: "عن الاتحاد", icon: Info },
  { href: "/members", label: "أعضاء الاتحاد", icon: Users },
  { href: "/colleges", label: "الكليات", icon: GraduationCap },
  { href: "/news", label: "الأخبار", icon: Newspaper },
  { href: "/courses", label: "الدورات", icon: BookOpen },
  { href: "/planner", label: "الأنشطة", icon: CalendarDays },
  { href: "/chat", label: "غرف النقاش", icon: MessageSquare },
  { href: "/services", label: "الخدمات", icon: Grid2X2 },
  { href: "/suggestions", label: "اقترح", icon: Lightbulb },
  { href: "/volunteer", label: "تطوع", icon: HeartHandshake },
  { href: "/faq", label: "الأسئلة", icon: HelpCircle },
  { href: "/library", label: "المكتبة", icon: Library },
];

export function Navbar() {
  const [location] = useLocation();

  return (
    <div className="sticky top-16 z-40 w-full border-b border-border bg-card">
      <div className="max-w-7xl mx-auto">
        <ScrollArea className="w-full whitespace-nowrap" dir="rtl">
          <div className="flex w-max space-x-1 space-x-reverse p-2 px-4 md:px-6">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all select-none border-b-2",
                    isActive 
                      ? "text-foreground border-primary bg-accent" 
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-4 h-4" />
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
