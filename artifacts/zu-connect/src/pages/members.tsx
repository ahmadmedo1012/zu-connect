import { useListMembers } from "@workspace/api-client-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Mail, Phone, MessageCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
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

const CATEGORIES = ["الكل", "القيادة التنفيذية", "رؤساء اللجان", "ممثلو الكليات"];

export default function Members() {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { user } = useAuth();
  const { data: members, isLoading } = useListMembers(
    activeCategory !== "الكل" ? { category: activeCategory } : {}
  );

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-foreground">أعضاء الاتحاد</h1>
        <p className="text-muted-foreground">تعرف على زملائك الممثلين في الاتحاد العام للطلبة وممثلي الكليات المختلفة.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
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
        <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">الأسماء متاحة للجميع. سجل الدخول لعرض التفاصيل الكاملة للأعضاء.</p>
          </div>
          <Link href="/login" className="text-sm font-bold text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Skeleton key={i} variant="card" className="h-[300px]" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {members?.map(member => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:-translate-y-1 transition-transform group"
            >
              {user ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/80 to-[#0b1f3f] p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-black text-white">
                      {member.initials}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="font-bold text-lg text-foreground leading-tight">{member.name}</h3>
                    <p className="text-sm font-semibold text-primary">{member.role}</p>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-col">
                      <span>{member.department}</span>
                      <span>{member.year}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 w-full pt-4 border-t border-border/50">
                    <button className="p-2 rounded-full bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-background border-2 border-border flex items-center justify-center text-3xl font-black text-muted-foreground">
                    ?
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="font-bold text-lg text-foreground leading-tight">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">سجل الدخول للمزيد</p>
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
