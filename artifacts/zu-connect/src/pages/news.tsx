import { useListNews } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { getNewsCategoryIcon, getNewsCategoryColor } from "@/lib/icons/icon-maps";
import { Eye, Calendar, ArrowUpLeft, Lock, Newspaper, Megaphone } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import { Empty } from "@/components/ui/empty";

const CATEGORIES = ["الكل", "أخبار الكليات", "إعلانات عامة", "أنشطة طلابية", "منح دراسية"];

export default function News() {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { user } = useAuth();
  const { data: news, isLoading } = useListNews(
    activeCategory !== "الكل" ? { category: activeCategory } : {}
  );

  return (
    <div className="flex flex-col gap-8 py-8 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <LottieAnimation src="/animations/illustration/megaphone.json" className="w-[120px] h-[120px] self-start" />
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">الأخبار والأنشطة</h1>
        <p className="text-muted-foreground">تابع آخر التحديثات والأخبار الخاصة بكليات جامعة الزاوية والاتحاد العام.</p>
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
            <p className="text-sm text-muted-foreground">عناوين الأخبار متاحة للجميع. سجل الدخول لقراءة المحتوى الكامل.</p>
          </div>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => (
            <Skeleton key={i} variant="card" className="h-40" icon={Megaphone} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {news?.length === 0 ? (
            <div className="col-span-full">
              <Empty icon={Newspaper} title="لا توجد أخبار" description="لا توجد أخبار في هذا التصنيف حالياً. تابعنا لاحقاً." />
            </div>
          ) : news?.map((item, i) => {
            const CategoryIcon = getNewsCategoryIcon(item.category);
            const categoryColor = getNewsCategoryColor(item.category);
            return (
              <motion.div key={item.id} variants={itemVariants} whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }} className={cn(
                "bg-card border border-border rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:border-primary/50 transition-colors",
                i === 0 ? "md:col-span-2 lg:col-span-2 md:flex-row" : "flex-col"
              )}>
                <div className={cn(
                  "bg-muted/50 relative overflow-hidden",
                  i === 0 ? "md:w-1/2 min-h-[200px]" : "h-48"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1F2125] to-[#0a0b0c] flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-4xl opacity-20 font-black text-white">ZU</span>
                  </div>
                  <div
                    className="absolute top-4 right-4 flex items-center gap-1.5 text-white text-xs font-bold px-2 py-1 rounded"
                    style={categoryColor ? { backgroundColor: `${categoryColor}20`, color: categoryColor } : { backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    <CategoryIcon className="w-3 h-3" />
                    {item.category}
                  </div>
                </div>
                
                <div className={cn(
                  "p-6 flex flex-col gap-4 flex-1",
                  i === 0 ? "md:w-1/2 justify-center" : ""
                )}>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.viewCount}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className={cn("font-bold text-foreground group-hover:text-primary transition-colors leading-snug", i === 0 ? "text-2xl" : "text-xl line-clamp-2")}>
                      {item.title}
                    </h3>
                    {user && (
                      <p className={cn("text-sm text-muted-foreground leading-relaxed", i === 0 ? "line-clamp-4" : "line-clamp-2")}>
                        {item.body}
                      </p>
                    )}
                  </div>
                  
                  {user && (
                    <div className="mt-auto pt-4 flex items-center text-sm font-bold text-primary group-hover:translate-x-[4px] transition-transform w-fit">
                      اقرأ المزيد <ArrowUpLeft className="w-4 h-4 mr-1" />
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
