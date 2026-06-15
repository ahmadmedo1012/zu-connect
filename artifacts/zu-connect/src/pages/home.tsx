import { useGetStats, useListNews, useListPlanner } from "@workspace/api-client-react";

import { Link } from "wouter";
import { GraduationCap, Book, Atom, Building2, Calendar, FileText, Send, Globe, AlertTriangle, CheckCircle, Lock, ChevronDown, BookOpen, Headphones, HeartPulse, Users, Library, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { getNewsCategoryIcon, getNewsCategoryColor } from "@/lib/icons/icon-maps";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LottieAnimation } from "@/components/ui/lottie";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/lib/auth/AuthContext";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

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

const HERO_PHRASES = [
  "تواصل، تعلم، وشارك في بناء مجتمع طلابي أقوى",
  "انضم إلى آلاف الطلاب في رحلتهم الجامعية",
  "كل ما تحتاجه في مكان واحد",
];

const TESTIMONIALS = [
  { name: "أحمد محمد", role: "كلية الهندسة", quote: "منصة رائعة! ساعدتني في متابعة فعاليات الاتحاد والتسجيل في الدورات.", rating: 5 },
  { name: "سارة علي", role: "كلية الطب", quote: "المكتبة الرقمية كنز حقيقي. المحاضرات المسجلة والملخصات وفرت علي وقتاً وجهداً كبيرين.", rating: 5 },
  { name: "خالد عمر", role: "كلية الحاسوب", quote: "المرشد الأكاديمي الذكي ميزة رائعة. يجيب على كل أسئلتي بسرعة ودقة.", rating: 5 },
  { name: "فاطمة حسن", role: "كلية الآداب", quote: "غرف النقاش ساعدتني في التواصل مع زملائي ومناقشة المواد الدراسية بسهولة.", rating: 5 },
  { name: "مصطفى عبدالله", role: "كلية الاقتصاد", quote: "جدول الأنشطة والتقويم الجامعي من أهم الميزات التي أستخدمها يومياً.", rating: 5 },
];

const SERVICE_CARDS = [
  { icon: Building2, title: "الكليات والأقسام", desc: "استعرض كليات جامعة الزاوية وأقسامها المختلفة" },
  { icon: Library, title: "المكتبة الرقمية", desc: "ملخصات، كتب PDF، بحوث ومحاضرات مسجلة" },
  { icon: Calendar, title: "الفعاليات القادمة", desc: "تابع فعاليات وأنشطة الاتحاد والكليات" },
  { icon: BookOpen, title: "النشرة البريدية", desc: "آخر الأخبار والتحديثات تصلك مباشرة" },
  { icon: Headphones, title: "الدعم الفني", desc: "فريق الدعم جاهز لمساعدتك في أي استفسار" },
  { icon: HeartPulse, title: "الأندية الطلابية", desc: "انضم للأندية الطلابية وطور مهاراتك" },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);

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

  // Typewriter state
  const [typedText, setTypedText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedText(HERO_PHRASES[0]);
      return;
    }
    const full = HERO_PHRASES[phraseIdx];
    if (typedText.length < full.length) {
      const t = setTimeout(() => {
        setTypedText(full.slice(0, typedText.length + 1));
      }, 40);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setPhraseIdx((p) => (p + 1) % HERO_PHRASES.length);
        setTypedText("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [typedText, phraseIdx, prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-16 pb-16 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <section className="relative w-full min-h-[65vh] rounded-3xl overflow-hidden flex items-center mt-4 bg-gradient-to-br from-background via-background to-muted/30 border border-border">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
            style={{
              backgroundImage: `url(/images/university-photo.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              y: prefersReducedMotion ? 0 : bgY,
            }}
          />
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px]" />
        </div>

        <div className="absolute left-auto right-4 md:right-16 top-1/2 -translate-y-1/2 z-[5] w-72 h-72 opacity-30 hidden lg:block pointer-events-none">
          <LottieAnimation src="/animations/illustration/study-discussion.json" />
        </div>
        
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 p-8 md:p-16 max-w-3xl flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-bold text-primary tracking-widest">ZU Connect</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight">
            مرحباً بك في <br/> جامعتك الرقمية
          </h1>
          <div className="h-14">
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-xl">
              {prefersReducedMotion ? HERO_PHRASES[0] : typedText}
              {!prefersReducedMotion && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block w-0.5 h-6 bg-primary mr-1 -mb-0.5"
                />
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link href="/services">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-primary/20">تصفح الخدمات</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full font-bold bg-transparent border-border hover:bg-accent hover:text-foreground">من نحن</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-muted-foreground/50" />
        </motion.div>
      </section>

      <motion.section
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 md:gap-6 -mt-24 relative z-20 px-4"
      >
        <StatCard label="طالب" value={stats?.totalStudents?.toLocaleString() || "5,240"} icon={GraduationCap} />
        <StatCard label="كلية" value={String(stats?.totalColleges ?? "14")} icon={Building2} />
        <StatCard label="نشاط" value={user ? String(stats?.totalActivities ?? "48") : "•••"} icon={Calendar} />
        <StatCard label="ملف" value={user ? String(stats?.totalLibraryFiles ?? "320") : "•••"} icon={FileText} />
      </motion.section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-bold text-primary tracking-widest">خدمات سريعة</span>
          <h2 className="text-3xl font-black text-foreground">كل ما تحتاجه في مكان واحد</h2>
          <p className="text-muted-foreground max-w-xl">خدمات طلابية متكاملة صممت لتسهيل حياتك الجامعية</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
              className="bg-card border border-border p-6 rounded-2xl flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8 py-16 rounded-3xl border border-primary/20 relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="text-center flex flex-col items-center gap-3 relative z-10">
          <div className="w-20 h-20 rounded-full border-2 border-primary/30 p-1 shadow-lg shadow-primary/10">
            <img
              src="/images/union-logo.jpg"
              alt="شعار الاتحاد"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-black text-foreground">الهيكل الإداري للاتحاد العام</h2>
          <p className="text-primary">قيادة طلابية تعمل من أجلكم</p>
        </div>
        
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="bg-card border-2 border-primary p-8 rounded-2xl text-center flex flex-col items-center w-full max-w-sm">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold mb-4">م</div>
            <h3 className="text-2xl font-bold text-foreground mb-1">محمد وسام الفراح</h3>
            <p className="text-primary font-semibold">رئيس الاتحاد العام</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <div className="bg-card border border-primary/30 p-6 rounded-2xl text-center flex flex-col items-center">
              <h3 className="text-xl font-bold text-foreground mb-1">مالك علي كشلاف</h3>
              <p className="text-primary font-semibold">النائب الأول</p>
            </div>
            <div className="bg-card border border-primary/30 p-6 rounded-2xl text-center flex flex-col items-center">
              <h3 className="text-xl font-bold text-foreground mb-1">عبد المجيد محمد الحمري</h3>
              <p className="text-primary font-semibold">النائب الثاني</p>
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
                className="bg-card border border-border p-5 rounded-2xl flex flex-col gap-2 hover:bg-accent hover:border-primary/30 transition-colors"
              >
                <h4 className="font-bold text-foreground">{member.name}</h4>
                <p className="text-sm text-primary">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground border-r-4 border-primary pr-4">أحدث الأخبار</h2>
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
                <div className="bg-card border border-border p-6 rounded-2xl transition-colors flex flex-col gap-3 group">
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
                  <h3 className="text-xl font-bold text-foreground leading-snug">{item.title}</h3>
                  {user && <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.body}</p>}
                </div>
              </motion.div>
            ))}
            {!news && (
              <Skeleton variant="card" className="h-40" icon={Globe} />
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
            <div className="bg-gradient-to-l from-[#152a4f] to-[#0b1f3f] border-b border-[#d4af37]/20 p-4">
              <h3 className="font-bold text-white">المرشد الأكاديمي (AI)</h3>
              <p className="text-xs text-[#d4af37] mt-1">اسأل عن أي شيء يخص الجامعة</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3" role="log" aria-live="polite">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ scale: 1 }}
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#152a4f] text-white self-end rounded-tl-sm border border-[#d4af37]/20' : 'bg-background text-foreground border border-border self-start rounded-tr-sm'}`}
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
                aria-label="إرسال"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                animate={prefersReducedMotion ? undefined : { boxShadow: ["0 0 0 0 rgba(212, 175, 55, 0.4)", "0 0 0 8px rgba(212, 175, 55, 0)", "0 0 0 0 rgba(212, 175, 55, 0)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="bg-[#d4af37] text-black p-2 rounded-xl hover:bg-[#d4af37]/90 flex-shrink-0 font-bold"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-8 py-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-bold text-primary tracking-widest">طلابنا</span>
          <h2 className="text-3xl font-black text-foreground">ماذا يقول عنا الطلاب</h2>
          <p className="text-muted-foreground max-w-xl">آراء طلاب جامعة الزاوية حول تجربتهم مع المنصة</p>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <Carousel opts={{ loop: true, align: "start" }}>
            <CarouselContent className="items-stretch">
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 h-full">
                  <div className="bg-card border border-border p-6 rounded-2xl h-full flex flex-col gap-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {t.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
