import { useListCourses, useEnrollCourse, useUnenrollCourse, getListCoursesQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LottieAnimation } from "@/components/ui/lottie";
import { cn } from "@/lib/utils";
import { getCourseCategoryIcon } from "@/lib/icons/icon-maps";
import { User, Clock, BarChart, Users, Lock, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import { Empty } from "@/components/ui/empty";

const CATEGORIES = ["الكل", "لغات", "تقنية", "مهارات شخصية", "علمي"];

export default function Courses() {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { user } = useAuth();
  const { data: courses, isLoading } = useListCourses(
    activeCategory !== "الكل" ? { category: activeCategory } : {}
  );
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const enrollCourse = useEnrollCourse();
  const unenrollCourse = useUnenrollCourse();
  
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);

  const handleEnroll = (id: number) => {
    enrollCourse.mutate(
      { id, data: { studentId: "guest" } },
      {
        onSuccess: () => {
          setEnrolledIds(prev => [...prev, id]);
          toast({ title: "تم التسجيل بنجاح", description: "سيتم التواصل معك لتأكيد الحضور" });
          queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        }
      }
    );
  };

  const handleUnenroll = (id: number) => {
    unenrollCourse.mutate(
      { id, data: { studentId: "guest" } },
      {
        onSuccess: () => {
          setEnrolledIds(prev => prev.filter(courseId => courseId !== id));
          toast({ title: "تم إلغاء التسجيل" });
          queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-4">
        <LottieAnimation src="/animations/illustration/graduation.json" className="w-[120px] h-[120px] self-start" />
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">الدورات التدريبية</h1>
        <p className="text-muted-foreground max-w-2xl">طور مهاراتك من خلال الدورات المجانية وشبه المجانية المقدمة بالتعاون مع مراكز التدريب المعتمدة.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
              activeCategory === cat 
                ? "bg-primary text-white border-primary" 
                : "bg-card text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {!user && (
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">تصفح الدورات المتاحة. سجل الدخول للتسجيل وعرض التفاصيل الكاملة.</p>
          </div>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} variant="card" className="h-[340px]" icon={BookOpen} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses?.length === 0 ? (
            <div className="col-span-full">
              <Empty icon={BookOpen} title="لا توجد دورات" description="لا توجد دورات في هذا التصنيف حالياً. الرجاء المحاولة لاحقاً." />
            </div>
          ) : courses?.map(course => {
            const isEnrolled = enrolledIds.includes(course.id);
            const colors = [
              "from-blue-600 to-blue-900",
              "from-emerald-500 to-teal-900",
              "from-orange-500 to-red-900",
              "from-purple-500 to-pink-900",
              "from-primary to-[#4a0a18]"
            ];
            const gradient = colors[(course.colorScheme ?? 0) % colors.length];

            return (
              <motion.div
                key={course.id}
                variants={itemVariants}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group"
              >
                <div className={cn("h-32 bg-gradient-to-br relative p-4 flex items-end", gradient)}>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded font-bold">
                    {(() => { const CatIcon = getCourseCategoryIcon(course.category); return <CatIcon className="w-3 h-3" />; })()}
                    {course.category}
                  </div>
                  <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight">{course.title}</h3>
                </div>
                
                <div className="p-5 flex flex-col gap-5 flex-1">
                  {user && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {user && (
                      <div className="flex items-center gap-2 text-foreground/80">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{course.instructor}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <BarChart className="w-4 h-4 text-muted-foreground" />
                      <span>{course.level}</span>
                    </div>
                    {user && (
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{course.enrolledCount} / {course.totalSeats} مقعد</span>
                      </div>
                    )}
                  </div>
                  
                  {user && (
                    <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-border/50">
                      <div className="flex gap-2 mt-4">
                        {isEnrolled ? (
                          <Button 
                            variant="outline" 
                            className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleUnenroll(course.id)}
                            disabled={unenrollCourse.isPending}
                          >
                            إلغاء التسجيل
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1 font-bold"
                            disabled={enrollCourse.isPending}
                            onClick={() => handleEnroll(course.id)}
                          >
                            تسجيل في الدورة
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
