import { useListMembers } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Mail, Phone, MessageCircle, Lock as LockIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import { Empty } from "@/components/ui/empty";

const CATEGORIES = ["الكل", "القيادة التنفيذية", "رؤساء اللجان", "ممثلو الكليات"];

export default function Members() {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { user } = useAuth();
  const { data: members, isLoading } = useListMembers(
    activeCategory !== "الكل" ? { category: activeCategory } : {}
  );

  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">أعضاء الاتحاد</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">تعرف على زملائك الممثلين في الاتحاد العام للطلبة وممثلي الكليات المختلفة.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border min-h-[44px]",
              activeCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-card text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {!user && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <LockIcon className="w-5 h-5 text-muted-foreground shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">الأسماء متاحة للجميع. سجل الدخول لعرض التفاصيل الكاملة للأعضاء.</p>
          </div>
          <Link href="/login" className="text-xs sm:text-sm font-bold text-primary hover:underline shrink-0">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Skeleton key={i} variant="card" className="h-[280px] md:h-[320px]" icon={Users} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {members?.length === 0 ? (
            <div className="col-span-full">
              <Empty icon={Users} title="لا يوجد أعضاء" description="لا يوجد أعضاء في هذا التصنيف حالياً." />
            </div>
          ) : members?.map(member => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02, y: -2 }}
              className="bg-card border border-border p-5 md:p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:-translate-y-1 transition-transform group touch-manipulation"
            >
              {user ? (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl md:text-3xl font-black text-primary">
                      {member.initials}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="font-bold text-base md:text-lg text-foreground leading-tight break-words">{member.name}</h3>
                    <p className="text-xs sm:text-sm font-semibold text-primary">{member.role}</p>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 flex flex-col gap-0.5">
                      <span>{member.department}</span>
                      <span>{member.year}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 w-full pt-4 border-t border-border/50">
                    <button className="p-2.5 rounded-full bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="إرسال بريد">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-full bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="اتصال هاتفي">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-full bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="إرسال رسالة">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-background border-2 border-border flex items-center justify-center text-2xl md:text-3xl font-black text-muted-foreground">
                    ?
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="font-bold text-base md:text-lg text-foreground leading-tight">{member.name}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">سجل الدخول للمزيد</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
