import { useListLibrary } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { getLibraryTypeIcon } from "@/lib/icons/icon-maps";
import { Download, Star, Filter, Lock, Book } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie";
import { useAuth } from "@/lib/auth/AuthContext";
import { Link } from "wouter";
import { containerVariants, itemVariants } from "@/lib/animations/variants";
import { Empty } from "@/components/ui/empty";

const TYPES = ["الكل", "ملخصات", "بحوث", "كتب PDF", "محاضرات مسجلة"];

export default function Library() {
  const prefersReducedMotion = useReducedMotion();
  const [activeType, setActiveType] = useState("الكل");
  const { user } = useAuth();
  const { data: resources, isLoading } = useListLibrary(
    activeType !== "الكل" ? { type: activeType } : {}
  );
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "جاري التحميل...",
      description: "سيتم تنزيل الملف قريباً",
    });
  };

  return (
    <div className="flex flex-col gap-8 py-8 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <LottieAnimation src="/animations/illustration/book-sparkle.json" className="w-[120px] h-[120px] self-start" />
        <h1 className="text-3xl md:text-4xl font-black text-foreground border-r-4 border-primary pr-4">المكتبة الرقمية</h1>
        <p className="text-muted-foreground">آلاف الملفات، الملخصات، والبحوث الأكاديمية متاحة للتحميل مجاناً.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 text-foreground font-bold ml-4">
          <Filter className="w-5 h-5" />
          تصفية حسب:
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(type => (
            <motion.button
              key={type}
              onClick={() => setActiveType(type)}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                activeType === type 
                  ? "bg-primary text-white border-primary" 
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {!user && (
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">العناوين والأنواع متاحة للجميع. سجل الدخول لتحميل الملفات وعرض التفاصيل.</p>
          </div>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Skeleton key={i} variant="card" className="h-48" icon={Book} />
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
          {resources?.length === 0 ? (
            <div className="col-span-full">
              <Empty icon={Book} title="لا توجد ملفات" description="لم نجد أي ملفات تطابق بحثك. حاول تغيير نوع الملف أو البحث بكلمة مختلفة.">
                <LottieAnimation src="/animations/empty/book-flip.json" className="w-[140px] h-[140px]" />
              </Empty>
            </div>
          ) : resources?.map(resource => (
            <motion.div
              key={resource.id}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              className="bg-card border border-border p-5 rounded-2xl flex flex-col gap-4 hover:border-primary/50 transition-colors group"
            >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {(() => { const TypeIcon = getLibraryTypeIcon(resource.type); return <TypeIcon className="w-6 h-6" />; })()}
                  </div>
                  <span className="text-[10px] font-bold bg-accent text-muted-foreground px-2 py-1 rounded">
                    {resource.type}
                  </span>
                </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-foreground line-clamp-1" title={resource.title}>{resource.title}</h3>
                {user && (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-1">{resource.subtitle}</p>
                    <p className="text-xs text-primary font-semibold mt-1">{resource.college}</p>
                  </>
                )}
              </div>
              
              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" /> {resource.rating}
                  </span>
                  {user && (
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" /> {resource.downloadCount}
                    </span>
                  )}
                </div>
                
                {user && (
                  <motion.button
                    onClick={handleDownload}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.1, boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" }}
                    className="w-8 h-8 rounded-full bg-background hover:bg-primary text-muted-foreground hover:text-primary-foreground flex items-center justify-center transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
