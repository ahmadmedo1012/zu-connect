import { useListColleges } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getCollegeIcon } from "@/lib/icons/icon-maps";
import { Users, FileText, Calendar, Activity, GraduationCap, Lock, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

export default function Colleges() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const { data: colleges, isLoading } = useListColleges();

  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">الكليات المعتمدة</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">تضم جامعة الزاوية 14 كلية مختلفة، تصفح خدمات كل كلية ونشاطاتها.</p>
      </div>

      {!user && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">أسماء الكليات متاحة للجميع. سجل الدخول لمشاهدة الإحصائيات والخدمات.</p>
          </div>
          <Link href="/login" className="text-xs sm:text-sm font-bold text-primary hover:underline shrink-0">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} variant="card" className="h-[180px] md:h-[220px]" icon={Building2} />
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
          {colleges?.length === 0 ? (
            <div className="col-span-full">
              <Empty icon={GraduationCap} title="لا توجد كليات" description="لم يتم تحميل قائمة الكليات بعد. الرجاء المحاولة لاحقاً." />
            </div>
          ) : colleges?.map(college => {
            const Icon = getCollegeIcon(college.name);
            return (
              <motion.div
                key={college.id}
                variants={itemVariants}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02, y: -3 }}
                className="bg-card border border-border p-5 md:p-6 rounded-2xl flex flex-col gap-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer touch-manipulation"
              >
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-background flex items-center justify-center text-xl md:text-2xl group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  {user && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md">
                      <Users className="w-3 h-3" />
                      {college.studentCount}
                    </div>
                  )}
                </div>

                <h3 className="text-base md:text-xl font-bold text-foreground leading-snug">{college.name}</h3>

                {user && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {college.hasNews && (
                      <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1.5 rounded font-semibold">
                        <FileText className="w-3 h-3" /> أخبار
                      </span>
                    )}
                    {college.hasSchedules && (
                      <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1.5 rounded font-semibold">
                        <Calendar className="w-3 h-3" /> جداول
                      </span>
                    )}
                    {college.hasActivities && (
                      <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1.5 rounded font-semibold">
                        <Activity className="w-3 h-3" /> نشاطات
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
