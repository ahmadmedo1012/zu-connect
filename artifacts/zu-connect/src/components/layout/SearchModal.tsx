import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, Building2, Users, Newspaper, LayoutDashboard } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "الأخبار", icon: Newspaper, href: "/news" },
  { label: "الدورات", icon: BookOpen, href: "/courses" },
  { label: "الخدمات", icon: LayoutDashboard, href: "/services" },
  { label: "الكليات", icon: Building2, href: "/colleges" },
  { label: "الأعضاء", icon: Users, href: "/members" },
] as const;

const SUGGESTIONS = [
  { title: "الرئيسية", desc: "العودة إلى الصفحة الرئيسية", href: "/" },
  { title: "الملف الشخصي", desc: "عرض وتحديث بياناتك", href: "/profile" },
  { title: "الإشعارات", desc: "آخر التحديثات والتنبيهات", href: "/notifications" },
  { title: "المساعدة", desc: "الأسئلة الشائعة والدعم", href: "/help" },
] as const;

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const navigate = (href: string) => {
    setLocation(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal panel */}
          <motion.div
            dir="rtl"
            className={cn(
              "relative z-10 w-full max-w-xl rounded-2xl border overflow-hidden",
              "glass-card"
            )}
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
          >
            {/* search input row */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في Zu Connect..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-base leading-relaxed focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset rounded-md px-1"
              />
              {/* close button */}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted-foreground bg-muted rounded-md border border-border">
                ESC
              </kbd>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent transition-colors sm:hidden"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* body — only show when query is empty */}
            {!query && (
              <div className="p-4 space-y-5">
                {/* category pills */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3">
                    تصفح سريع
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => navigate(cat.href)}
                        className={cn(
                          "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium group",
                          "bg-muted hover:shadow-sm border border-border",
                          "transition-all min-h-[40px]"
                        )}
                      >
                        <span className="w-7 h-7 rounded-full flex items-center justify-center bg-transparent group-hover:bg-primary/15 transition-colors">
                          <cat.icon className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        </span>
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* popular destinations */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3">
                    وجهات شائعة
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.href}
                        onClick={() => navigate(s.href)}
                        className={cn(
                          "flex flex-col items-start gap-0.5 p-3 rounded-xl text-right",
                          "bg-muted/50 hover:bg-muted border border-border/50 hover:border-border",
                          "transition-colors min-h-[60px]"
                        )}
                      >
                        <span className="text-sm font-semibold text-foreground">{s.title}</span>
                        <span className="text-xs text-muted-foreground">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* empty state when query has no results (placeholder) */}
            {query && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">جاري البحث عن &quot;{query}&quot;...</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
