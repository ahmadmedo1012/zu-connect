import { useListPlanner } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { LottieAnimation } from "@/components/ui/lottie";
import { Calendar, CalendarX, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

const MONTHS = ["مايو 2026", "يونيو 2026", "يوليو 2026", "أغسطس 2026", "عرض الكل"];

export default function Planner() {
  const prefersReducedMotion = useReducedMotion();
  const [activeMonth, setActiveMonth] = useState("مايو 2026");
  const { user } = useAuth();
  const { data: plannerEvents, isLoading } = useListPlanner(
    activeMonth !== "عرض الكل" ? { month: activeMonth } : {}
  );

  return (
    <div className="flex flex-col gap-8 py-8 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <LottieAnimation src="/animations/illustration/calendar-planning.json" className="w-[120px] h-[120px] self-start" />
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">الأنشطة القادمة</h1>
        <p className="text-muted-foreground">جدول زمني لجميع الفعاليات والأنشطة القادمة التي ينظمها الاتحاد.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {MONTHS.map(month => (
          <button
            key={month}
            onClick={() => setActiveMonth(month)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
              activeMonth === month 
                ? "bg-primary text-white border-primary" 
                : "bg-card text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
            )}
          >
            {month}
          </button>
        ))}
      </div>

      {!user && (
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">عناوين الأنشطة متاحة للجميع. سجل الدخول لمشاهدة التفاصيل والتواريخ الكاملة.</p>
          </div>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-6 relative pl-4 md:pl-0 pr-4 md:pr-12">
          <div className="absolute right-8 md:right-16 top-2 bottom-2 w-0.5 bg-border rounded-full" />
          {[1,2,3,4].map(i => (
            <div key={i} className="relative flex items-start gap-6">
               <div className="absolute -right-[13px] md:-right-[37px] top-1 w-6 h-6 rounded-full bg-background border-4 border-border z-10" />
               <Skeleton variant="card" className="w-full h-24" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col gap-6 relative pl-4 md:pl-0 pr-4 md:pr-12"
        >
          <div className="absolute right-8 md:right-16 top-2 bottom-2 w-0.5 bg-border rounded-full" />
          
          {plannerEvents?.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Empty icon={CalendarX} title="لا توجد أنشطة" description="لا توجد أنشطة مجدولة في هذا الشهر. الرجاء اختيار شهر آخر." />
            </motion.div>
          ) : (
            plannerEvents?.map((event) => (
              <motion.div key={event.id} variants={itemVariants} whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }} className="relative flex items-start gap-6 group">
                <div className="absolute -right-[13px] md:-right-[37px] top-1 w-6 h-6 rounded-full bg-background border-4 border-primary z-10 group-hover:bg-primary transition-colors" />
                <div className="flex flex-col md:flex-row gap-4 w-full bg-card border border-border p-5 rounded-2xl group-hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center justify-center bg-background rounded-xl p-3 min-w-24 text-center shrink-0 border border-border">
                    <span className="text-xs text-muted-foreground font-bold">{event.month}</span>
                    {user ? (
                      <span className="text-2xl font-black text-foreground">{event.date.split(' ')[0]}</span>
                    ) : (
                      <span className="text-2xl font-black text-muted-foreground">--</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 justify-center">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                    {user ? (
                      <>
                        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/80 font-bold">
                          <Calendar className="w-3 h-3" /> {event.date}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">سجل الدخول لمشاهدة التفاصيل</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
