import { useState, useEffect, useRef } from "react";
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
  Lock,
  UserPlus,
  Award,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

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
  { href: "/profile", label: "برنامج الدعوات", icon: UserPlus, requiresAuth: true },
  { href: "/loyalty", label: "نقاطي", icon: Award, requiresAuth: true },
  { href: "/leaderboard", label: "المتصدرين", icon: TrendingUp, requiresAuth: false },
];

export function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="sticky top-16 z-40 w-full border-b border-border bg-card">
      <div className={cn("mx-auto", isMobile ? "px-2" : "max-w-6xl px-4 md:px-6")}>
        {isMobile ? (
          <MobileNav
            location={location}
            user={user}
            panelOpen={panelOpen}
            onToggle={() => setPanelOpen(!panelOpen)}
            onClose={() => setPanelOpen(false)}
          />
        ) : (
          <ScrollArea className="w-full whitespace-nowrap" dir="rtl">
            <div className="flex w-max space-x-1 space-x-reverse p-2 md:px-6">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                const locked = link.requiresAuth && !user;

                return (
                  <Link
                    key={link.href}
                    href={locked ? "/login" : link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all select-none",
                      "whitespace-nowrap min-h-[44px]",
                      isActive
                        ? "text-foreground bg-primary/15 border border-primary/30"
                        : locked
                          ? "text-muted-foreground/50 border border-transparent cursor-not-allowed"
                          : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {locked ? <Lock className="w-4 h-4 shrink-0" /> : <Icon className="w-4 h-4 shrink-0" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

function MobileNav({
  location,
  user,
  panelOpen,
  onToggle,
  onClose,
}: {
  location: string;
  user: unknown;
  panelOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (panelOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [panelOpen, onClose]);

  const linkVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03, duration: 0.2 },
    }),
  };

  return (
    <>
      {/* Hamburger / X toggle button */}
      <div className="flex items-center justify-center px-2 py-1.5">
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-full transition-colors",
            panelOpen ? "bg-accent" : "bg-accent/50 hover:bg-accent"
          )}
          aria-label={panelOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          <motion.div
            animate={{ rotate: panelOpen ? 90 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {panelOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="navbar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={onClose}
            />

            {/* Slide-down panel from top */}
            <motion.div
              key="navbar-panel"
              ref={panelRef}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="absolute top-full left-0 right-0 z-50 bg-card border-b border-border shadow-2xl overflow-y-auto max-h-[70vh]"
              dir="rtl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-bold text-lg">القائمة</span>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-accent transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col p-3 gap-1">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = location === link.href;
                  const locked = link.requiresAuth && !user;
                  return (
                    <motion.div
                      key={link.href}
                      custom={i}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={locked ? "/login" : link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px]",
                          isActive
                            ? "text-foreground bg-primary/15 border border-primary/30"
                            : locked
                              ? "text-muted-foreground/50 cursor-not-allowed"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {locked ? <Lock className="w-5 h-5 shrink-0" /> : <Icon className="w-5 h-5 shrink-0" />}
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
