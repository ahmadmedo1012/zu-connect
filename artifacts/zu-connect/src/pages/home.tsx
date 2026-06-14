import { useGetStats, useListNews, useListPlanner } from "@workspace/api-client-react";
import campusPath from "@assets/IMG_0793_1781443006842.jpeg";
import { Link } from "wouter";
import { GraduationCap, Book, Atom, Building2, Calendar, FileText, Send, Globe, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { getNewsCategoryIcon, getNewsCategoryColor } from "@/lib/icons/icon-maps";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAuth } from "@/lib/auth/AuthContext";

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

interface LeadershipMember {
  id: number;
  name: string;
  role: string;
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  const prefersReducedMotion = useReducedMotion();
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const { count, ref } = useCountUp(numericValue);
  const displayValue = value.includes("+") ? `${count.toLocaleString()}+` : count.toLocaleString();

  return (
    <motion.div
      variants={itemVariants}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:-translate-y-1 transition-transform shadow-2xl"
    >
      <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <span ref={ref} className="text-4xl font-black text-foreground">{prefersReducedMotion ? value : displayValue}</span>
      <span className="text-muted-foreground font-semibold">{label}</span>
    </motion.div>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 100]);

  const { data: stats } = useGetStats();
  const { data: news } = useListNews();
  const { data: planner } = useListPlanner();
  const { data: leadership } = useQuery<LeadershipMember[]>({
    queryKey: ["leadership"],
    queryFn: () => fetch("/api/leadership").then(r => r.json()),
  });
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'مرحباً، أنا المساعد الذكي الخاص بالاتحاد. كيف يمكنني مساعدتك؟ (جرب: امتحانات، تسجيل، مكتبة)' }
  ]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    const input = chatInput;
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    
    let aiResponded = false;

    setTimeout(() => {
      let reply = "عذراً، لم أفهم طلبك. يمكنك سؤالنا عبر صفحة اقترح/تواصل.";
      if (input.includes('امتحانات')) reply = "تبدأ الامتحانات النهائية عادة في نهاية الفصل الدراسي. يرجى مراجعة كليتك لمعرفة الجدول المحدد.";
      if (input.includes('تسجيل')) reply = "يمكنك التسجيل في الدورات عبر صفحة الدورات التدريبية في القائمة.";
      if (input.includes('مكتبة')) reply = "المكتبة الرقمية متاحة عبر صفحة المكتبة في القائمة العلوية.";
      if (input.includes('منح')) reply = "سيتم الإعلان عن المنح والفرص الجديدة عبر قسم الأخبار.";
      if (input.includes('محادثات')) reply = "غرف النقاش متاحة في صفحة 'غرف النقاش' للتواصل مع زملائك.";
      if (input.includes('تاريخ')) reply = "تأسس الاتحاد العام لطلبة جامعة الزاوية لخدمة آلاف الطلاب وتسهيل مسيرتهم.";

      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      aiResponded = true;
    }, 500);

    setTimeout(() => {
      if (!aiResponded) {
        setMessages(prev => [...prev, { role: 'ai', text: "عذراً، لم أتمكن من معالجة طلبك في الوقت المحدد. يرجى المحاولة مرة أخرى أو التواصل عبر صفحة اقترح/تواصل." }]);
      }
    }, 3000);
    
    setChatInput("");
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative w-full h-[60vh] rounded-3xl overflow-hidden bg-black flex items-center mt-4">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={campusPath}
            alt="Campus"
            style={prefersReducedMotion ? undefined : { y: parallaxY }}
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-[120px]" />
        </div>

        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute top-20 left-[15%] z-[5] text-primary/20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            >
              <GraduationCap className="w-12 h-12" />
            </motion.div>
            <motion.div
              className="absolute top-32 right-[20%] z-[5] text-primary/15"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            >
              <Book className="w-10 h-10" />
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-[30%] z-[5] text-primary/20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
            >
              <Atom className="w-14 h-14" />
            </motion.div>
          </>
        )}
        
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 p-8 md:p-16 max-w-3xl flex flex-col gap-6"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">مرحباً بك في <br/> ZU Connect</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl">
            المنصة الرقمية الرسمية للاتحاد العام لطلبة جامعة الزاوية. تواصل، تعلم، وشارك في بناء مجتمع طلابي أقوى.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link href="/services">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold">تصفح الخدمات</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full font-bold bg-transparent text-white border-white/20 hover:bg-white hover:text-black">من نحن</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <motion.section
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 -mt-24 relative z-20 px-4"
      >
        <StatCard label="طالب" value={stats?.totalStudents?.toLocaleString() || "5,240"} icon={GraduationCap} />
        <StatCard label="كلية" value={String(stats?.totalColleges ?? "14")} icon={Building2} />
        {user && <StatCard label="نشاط" value={String(stats?.totalActivities ?? "48")} icon={Calendar} />}
        {user && <StatCard label="ملف" value={String(stats?.totalLibraryFiles ?? "320")} icon={FileText} />}
      </motion.section>

      <section className="flex flex-col gap-8 bg-[#0b1f3f] -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-16 rounded-3xl border border-[#d4af37]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />
        <div className="text-center flex flex-col gap-2 relative z-10">
          <h2 className="text-3xl font-black text-white">الهيكل الإداري للاتحاد العام</h2>
          <p className="text-[#d4af37]">قيادة طلابية تعمل من أجلكم</p>
        </div>
        
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="bg-[#152a4f] border-2 border-[#d4af37] p-8 rounded-2xl text-center flex flex-col items-center w-full max-w-sm">
            <div className="w-20 h-20 bg-[#d4af37]/20 text-[#d4af37] rounded-full flex items-center justify-center text-2xl font-bold mb-4">م</div>
            <h3 className="text-2xl font-bold text-white mb-1">محمد وسام الفراح</h3>
            <p className="text-[#d4af37] font-semibold">رئيس الاتحاد العام</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <div className="bg-[#152a4f] border border-[#d4af37]/50 p-6 rounded-2xl text-center flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-1">مالك علي كشلاف</h3>
              <p className="text-[#d4af37] font-semibold">النائب الأول</p>
            </div>
            <div className="bg-[#152a4f] border border-[#d4af37]/50 p-6 rounded-2xl text-center flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-1">عبد المجيد محمد الحمري</h3>
              <p className="text-[#d4af37] font-semibold">النائب الثاني</p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-4"
          >
            {leadership?.map(member => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                className="bg-[#152a4f] border border-border p-5 rounded-2xl flex flex-col gap-2 hover:bg-[#1a3360] transition-colors"
              >
                <h4 className="font-bold text-white">{member.name}</h4>
                <p className="text-sm text-[#d4af37]">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground border-r-4 border-primary pr-3">أحدث الأخبار</h2>
            <Link href="/news" className="text-sm text-primary font-semibold hover:underline">عرض الكل</Link>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-4"
          >
            {news?.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              >
                <Link href={`/news/${item.id}`} className="bg-card border border-border p-6 rounded-2xl hover:bg-card/80 transition-colors flex flex-col gap-3 group block">
                  <div className="flex justify-between items-start gap-4">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded flex items-center gap-1"
                      style={(() => {
                        const color = getNewsCategoryColor(item.category);
                        return color ? { backgroundColor: `${color}20`, color } : {};
                      })()}
                    >
                      {(() => { const CatIcon = getNewsCategoryIcon(item.category); return <CatIcon className="w-3 h-3" />; })()}
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
                  {user && <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.body}</p>}
                </Link>
              </motion.div>
            ))}
            {!news && (
              <Skeleton variant="card" className="h-40" />
            )}
          </motion.div>
        </div>
        
        <div className="flex flex-col gap-8">
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              الأنشطة القادمة
            </h3>
            <motion.div
              variants={containerVariants}
              initial={prefersReducedMotion ? undefined : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.1 }}
              className="flex flex-col gap-4"
            >
              {planner?.slice(0, 4).map(event => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                  className="flex gap-4 items-start pb-4 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col items-center justify-center bg-background rounded-lg p-2 min-w-14">
                    <span className="text-xs text-muted-foreground">{event.month}</span>
                    <span className="text-lg font-bold text-foreground">{user ? event.date.split(' ')[0] : '--'}</span>
                  </div>
                  <div className="flex flex-col pt-1">
                    <h4 className="font-bold text-sm text-foreground line-clamp-1">{event.title}</h4>
                    {user && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.description}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <Link href="/planner">
              <Button variant="outline" className="w-full mt-2 rounded-xl">جدول الأنشطة كامل</Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-[#0b1f3f] border-b border-[#d4af37]/20 p-4">
              <h3 className="font-bold text-white">المرشد الأكاديمي (AI)</h3>
              <p className="text-xs text-[#d4af37] mt-1">اسأل عن أي شيء يخص الجامعة</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ scale: 1 }}
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#152a4f] text-white self-end rounded-tl-sm border border-[#d4af37]/30' : 'bg-background text-foreground border border-border self-start rounded-tr-sm'}`}
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>
            <form onSubmit={handleChat} className="p-3 border-t border-border flex gap-2 bg-background">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..." 
                className="flex-1 bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <motion.button
                type="submit"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                animate={prefersReducedMotion ? undefined : { boxShadow: ["0 0 0 0 rgba(212, 175, 55, 0.4)", "0 0 0 8px rgba(212, 175, 55, 0)", "0 0 0 0 rgba(212, 175, 55, 0)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="bg-[#d4af37] text-black p-2 rounded-xl hover:bg-[#d4af37]/90 flex-shrink-0"
              >
                <Send className="w-5 h-5 rtl:-scale-x-100" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
