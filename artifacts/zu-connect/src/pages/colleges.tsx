import { useListColleges } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getCollegeIcon } from "@/lib/icons/icon-maps";
import { Users, FileText, Calendar, Activity, GraduationCap, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";


const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Colleges() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const { data: colleges, isLoading } = useListColleges();

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">الكليات المعتمدة</h1>
        <p className="text-muted-foreground">تضم جامعة الزاوية 14 كلية مختلفة، تصفح خدمات كل كلية ونشاطاتها.</p>
      </div>

      {!user && (
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">أسماء الكليات متاحة للجميع. سجل الدخول لمشاهدة الإحصائيات والخدمات.</p>
          </div>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} variant="card" className="h-[200px]" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-5 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  {user && (
                    <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md">
                      <Users className="w-3 h-3" />
                      {college.studentCount}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-foreground">{college.name}</h3>
                
                {user && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {college.hasNews && (
                      <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1 rounded font-semibold">
                        <FileText className="w-3 h-3" /> أخبار
                      </span>
                    )}
                    {college.hasSchedules && (
                      <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1 rounded font-semibold">
                        <Calendar className="w-3 h-3" /> جداول
                      </span>
                    )}
                    {college.hasActivities && (
                      <span className="text-[10px] flex items-center gap-1 bg-background text-muted-foreground px-2 py-1 rounded font-semibold">
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
