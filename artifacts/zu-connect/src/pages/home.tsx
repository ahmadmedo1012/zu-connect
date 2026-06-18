import { useGetStats, useListNews, useListPlanner } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { GraduationCap, Building2, Calendar, FileText, Send, Globe, Headphones, HeartPulse, Library, Star, UserPlus, ChevronDown, Sparkles, TrendingUp, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { getNewsCategoryIcon, getNewsCategoryColor } from "@/lib/icons/icon-maps";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuth } from "@/lib/auth/AuthContext";
import { containerVariants, itemVariants, scaleIn } from "@/lib/animations/variants";

const HERO_PHRASES = ["تواصل، تعلم، وشارك في بناء مجتمع طلابي أقوى", "انضم إلى آلاف الطلاب في رحلتهم الجامعية", "كل ما تحتاجه في مكان واحد"];
const TESTIMONIALS = [
  { name: "أحمد محمد", role: "كلية الهندسة", quote: "منصة رائعة! ساعدتني في متابعة فعاليات الاتحاد والتسجيل في الدورات." },
  { name: "سارة علي", role: "كلية الطب", quote: "المكتبة الرقمية كنز حقيقي. المحاضرات المسجلة والملخصات وفرت علي وقتاً وجهداً كبيرين." },
  { name: "خالد عمر", role: "كلية الحاسوب", quote: "المرشد الأكاديمي الذكي ميزة رائعة. يجيب على كل أسئلتي بسرعة ودقة." },
  { name: "فاطمة حسن", role: "كلية الآداب", quote: "غرف النقاش ساعدتني في التواصل مع زملائي ومناقشة المواد الدراسية بسهولة." },
  { name: "مصطفى عبدالله", role: "كلية الاقتصاد", quote: "جدول الأنشطة والتقويم الجامعي من أهم الميزات التي أستخدمها يومياً." },
];
const SERVICE_CARDS = [
  { icon: Building2, title: "الكليات والأقسام", desc: "استعرض كليات جامعة الزاوية وأقسامها المختلفة" },
  { icon: Library, title: "المكتبة الرقمية", desc: "ملخصات، كتب PDF، بحوث ومحاضرات مسجلة" },
  { icon: Calendar, title: "الفعاليات القادمة", desc: "تابع فعاليات وأنشطة الاتحاد والكليات" },
  { icon: BookOpen, title: "النشرة البريدية", desc: "آخر الأخبار والتحديثات تصلك مباشرة" },
  { icon: Headphones, title: "الدعم الفني", desc: "فريق الدعم جاهز لمساعدتك في أي استفسار" },
  { icon: HeartPulse, title: "الأندية الطلابية", desc: "انضم للأندية الطلابية وطور مهاراتك" },
  { icon: UserPlus, title: "دعوة صديق", desc: "ادعُ أصدقاءك للانضمام للمنصة واحصل على المكافآت" },
];
const AI_REPLIES: Record<string, string> = {
  امتحانات: "تبدأ الامتحانات النهائية عادة في نهاية الفصل الدراسي.", تسجيل: "يمكنك التسجيل في الدورات عبر صفحة الدورات التدريبية.", مكتبة: "المكتبة الرقمية متاحة عبر صفحة المكتبة.", منح: "سيتم الإعلان عن المنح والفرص الجديدة عبر قسم الأخبار.",
};
interface LeadershipMember { id: number; name: string; role: string }

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const fn = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setCount(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(fn);
        };
        requestAnimationFrame(fn);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function StatCard({ label, value, icon: Icon, large }: { label: string; value: string; icon: React.ElementType; large?: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const n = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const { count, ref } = useCountUp(n);
  const display = value.includes("+") ? `${count.toLocaleString()}+` : count.toLocaleString();
  return (
    <motion.div variants={itemVariants} className={`bg-card border border-border rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:-translate-y-1 transition-transform ${large ? "p-6 md:p-8" : "p-4 md:p-6"}`}>
      <div className={`${large ? "w-14 h-14 md:w-16 md:h-16" : "w-10 h-10 md:w-12 md:h-12"} rounded-xl bg-background flex items-center justify-center text-primary`}>
        <Icon className={`${large ? "w-7 h-7 md:w-8 md:h-8" : "w-5 h-5 md:w-6 md:h-6"}`} />
      </div>
      <span ref={ref} className={`${large ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"} font-black text-foreground`}>{prefersReducedMotion ? value : display}</span>
      <span className={`${large ? "text-sm md:text-lg" : "text-xs md:text-base"} text-muted-foreground font-semibold`}>{label}</span>
    </motion.div>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const { data: stats } = useGetStats();
  const { data: news } = useListNews();
  const { data: planner } = useListPlanner();
  const { data: leadership } = useQuery<LeadershipMember[]>({ queryKey: ["leadership"], queryFn: () => fetch("/api/leadership").then(r => r.json()) });
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([{ role: "ai", text: "مرحباً، أنا المساعد الذكي الخاص بالاتحاد. كيف يمكنني مساعدتك؟" }]);
  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    const input = chatInput.trim();
    if (!input) return;
    setMessages(m => [...m, { role: "user", text: input }]);
    setTimeout(() => setMessages(m => [...m, { role: "ai", text: Object.entries(AI_REPLIES).find(([k]) => input.includes(k))?.[1] || "عذراً، لم أفهم طلبك." }]), 500);
    setChatInput("");
  };
  const [typedText, setTypedText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) { setTypedText(HERO_PHRASES[0]); return; }
    const full = HERO_PHRASES[phraseIdx];
    if (typedText.length < full.length) { const t = setTimeout(() => setTypedText(full.slice(0, typedText.length + 1)), 40); return () => clearTimeout(t); }
    const t = setTimeout(() => { setPhraseIdx(p => (p + 1) % HERO_PHRASES.length); setTypedText(""); }, 3000);
    return () => clearTimeout(t);
  }, [typedText, phraseIdx, prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      {/* ── 1. HERO — split layout ── */}
      <section className="relative w-full min-h-[50vh] md:min-h-[60vh] rounded-3xl overflow-hidden flex items-center bg-gradient-to-br from-background via-background to-muted/30 border border-border px-4 md:px-6 py-12 md:py-16">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{ backgroundImage: "url(/images/university-photo.jpg)", backgroundSize: "cover", backgroundPosition: "center", y: prefersReducedMotion ? 0 : bgY }} />
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px]" />
        </div>
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* RTL: right side visually — title + CTA */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-bold text-primary tracking-widest">ZU Connect</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-foreground leading-tight max-w-3xl">مرحباً بك في<br />جامعتك الرقمية</h1>
            <div className="h-14">
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium max-w-xl">
                {prefersReducedMotion ? HERO_PHRASES[0] : typedText}
                {!prefersReducedMotion && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} className="inline-block w-0.5 h-5 md:h-6 bg-primary mr-1 -mb-0.5" />}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href="/services"><Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold shadow-lg shadow-primary/20">تصفح الخدمات</Button></Link>
              <Link href="/about"><Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold">من نحن</Button></Link>
            </div>
          </div>
          {/* RTL: left side visually — feature highlight card */}
          <motion.div variants={scaleIn} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true }}
            className="w-full md:w-[320px] lg:w-[380px] shrink-0 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-primary" /></div>
              <span className="font-bold text-foreground text-lg">إحصائيات المنصة</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { icon: TrendingUp, label: "نسبة الرضا", value: "92%" },
                { icon: GraduationCap, label: "الطلاب المسجلون", value: "5,240+" },
                { icon: Building2, label: "الكليات", value: "14" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-background rounded-xl p-3">
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground text-sm">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-primary/5 rounded-xl p-3 text-center"><span className="text-xs text-muted-foreground">انضم إلى آلاف الطلاب في رحلتهم الجامعية</span></div>
          </motion.div>
        </div>
        <motion.div initial={prefersReducedMotion ? undefined : { opacity: 0 }} animate={prefersReducedMotion ? undefined : { opacity: 1, y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"><ChevronDown className="w-6 h-6 text-muted-foreground/50" /></motion.div>
      </section>

      {/* ── 2. STATS — bento grid (2 large + 2 small, irregular spans) ── */}
      <motion.section variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
      >
        <div className="col-span-2 md:col-span-2 md:row-span-2"><StatCard label="طالب" value={stats?.totalStudents?.toLocaleString() || "5,240"} icon={GraduationCap} large /></div>
        <StatCard label="كلية" value={String(stats?.totalColleges ?? "14")} icon={Building2} />
        <StatCard label="نشاط" value={user ? String(stats?.totalActivities ?? "48") : "•••"} icon={Calendar} />
        <div className="col-span-2"><StatCard label="ملف" value={user ? String(stats?.totalLibraryFiles ?? "320") : "•••"} icon={FileText} /></div>
      </motion.section>

      {/* ── 3. SERVICES — asymmetric grid ── */}
      <section className="flex flex-col gap-8 bg-muted/30 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-primary tracking-widest">خدمات سريعة</span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground border-r-4 border-primary pr-4">كل ما تحتاجه في مكان واحد</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">خدمات طلابية متكاملة صممت لتسهيل حياتك الجامعية</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICE_CARDS.map((card, i) => (
            <motion.div key={card.title} initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }} whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              onClick={() => { if (card.title === "دعوة صديق") setLocation(user ? "/profile" : "/login"); }}
              whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
              className={`bg-card border border-border p-5 md:p-6 rounded-2xl flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer touch-manipulation ${i === 0 ? "lg:col-span-2 lg:min-h-[260px]" : ""} ${i === 3 ? "lg:col-span-2 lg:min-h-[240px]" : ""} ${i === 1 || i === 2 ? "lg:min-h-[220px]" : ""}`}
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <card.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg text-foreground">{card.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. LEADERSHIP — overlapping horizontal scroll ── */}
      <section className="flex flex-col gap-8 rounded-3xl border border-primary/20 relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background p-6 md:p-8">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col items-start gap-3 relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-primary/30 p-1 shadow-lg shadow-primary/10">
            <img src="/images/union-logo.jpg" alt="شعار الاتحاد" loading="lazy" width={80} height={80} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground border-r-4 border-primary pr-4">الهيكل الإداري للاتحاد العام</h2>
            <p className="text-xs sm:text-base text-primary">قيادة طلابية تعمل من أجلكم</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="bg-card border-2 border-primary p-6 md:p-8 rounded-2xl text-center flex flex-col items-center w-full max-w-sm">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mb-4">م</div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">محمد وسام الفراح</h3>
            <p className="text-xs sm:text-base text-primary font-semibold">رئيس الاتحاد العام</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl">
            <div className="bg-card border border-primary/30 p-5 md:p-6 rounded-2xl text-center flex flex-col items-center">
              <h3 className="text-base md:text-xl font-bold text-foreground mb-1">مالك علي كشلاف</h3>
              <p className="text-xs sm:text-base text-primary font-semibold">النائب الأول</p>
            </div>
            <div className="bg-card border border-primary/30 p-5 md:p-6 rounded-2xl text-center flex flex-col items-center">
              <h3 className="text-base md:text-xl font-bold text-foreground mb-1">عبد المجيد محمد الحمري</h3>
              <p className="text-xs sm:text-base text-primary font-semibold">النائب الثاني</p>
            </div>
          </div>
          <motion.div variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.1 }}
            className="flex gap-4 md:gap-0 w-full overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 scrollbar-thin touch-pan-x"
          >
            {leadership?.map((member, i) => (
              <motion.div key={member.id} variants={itemVariants}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, zIndex: 50 }}
                className={`bg-card border border-border p-4 md:p-5 rounded-2xl flex flex-col gap-2 hover:bg-accent hover:border-primary/30 transition-all min-w-[200px] md:min-w-0 snap-start ${i > 0 ? "md:-mr-8 md:relative" : ""}`}
                style={{ zIndex: leadership.length - i }}
              >
                <h4 className="font-bold text-sm md:text-base text-foreground">{member.name}</h4>
                <p className="text-xs sm:text-sm text-primary">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. NEWS + ACTIVITIES — side-by-side on desktop ── */}
      <section className="flex flex-col gap-6 bg-muted/30 rounded-3xl p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground border-r-4 border-primary pr-4">أحدث الأخبار</h2>
              <Link href="/news" className="text-xs sm:text-sm text-primary font-semibold hover:underline">عرض الكل</Link>
            </div>
            <motion.div variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.1 }} className="flex flex-col gap-4">
              {news?.slice(0, 3).map(item => (
                <motion.div key={item.id} variants={itemVariants} whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}>
                  <div className="bg-card border border-border p-5 md:p-6 rounded-2xl transition-colors flex flex-col gap-3 group">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-[10px] sm:text-xs font-bold px-2 py-1 rounded flex items-center gap-1" style={(() => { const c = getNewsCategoryColor(item.category); return c ? { backgroundColor: `${c}20`, color: c } : {}; })()}>
                        {(() => { const CatIcon = getNewsCategoryIcon(item.category); return <CatIcon className="w-3 h-3" />; })()}{item.category}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-foreground leading-snug break-words">{item.title}</h3>
                    {user && <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.body}</p>}
                  </div>
                </motion.div>
              ))}
              {!news && <Skeleton variant="card" className="h-28 md:h-40" icon={Globe} />}
            </motion.div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 flex flex-col gap-4">
              <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />الأنشطة القادمة
              </h3>
              <motion.div variants={containerVariants} initial={prefersReducedMotion ? undefined : "hidden"} whileInView={prefersReducedMotion ? undefined : "visible"} viewport={{ once: true, amount: 0.1 }} className="flex flex-col gap-4">
                {planner?.slice(0, 4).map(event => (
                  <motion.div key={event.id} variants={itemVariants} className="flex gap-4 items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex flex-col items-center justify-center bg-background rounded-lg p-2 min-w-14">
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{event.month}</span>
                      <span className="text-base sm:text-lg font-bold text-foreground">{user ? event.date.split(" ")[0] : "--"}</span>
                    </div>
                    <div className="flex flex-col pt-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1">{event.title}</h4>
                      {user && <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-1">{event.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <Link href="/planner"><Button variant="outline" className="w-full mt-2 rounded-xl font-semibold">جدول الأنشطة كامل</Button></Link>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[300px] md:h-[400px] sticky bottom-0 md:static z-10 shadow-2xl md:shadow-none">
              <div className="bg-gradient-to-l from-card to-muted border-b border-border p-4">
                <h3 className="font-bold text-foreground text-sm md:text-base">المرشد الأكاديمي (AI)</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">اسأل عن أي شيء يخص الجامعة</p>
              </div>
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3" role="log" aria-live="polite">
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={false} animate={{ scale: 1 }} className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground self-end rounded-tl-sm" : "bg-background text-foreground border border-border self-start rounded-tr-sm"}`}>
                    {msg.text}
                  </motion.div>
                ))}
              </div>
              <form onSubmit={handleChat} className="p-3 border-t border-border flex gap-2 bg-background">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="اكتب سؤالك هنا..."
                  className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground" />
                <button type="submit" aria-label="إرسال"
                  className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 flex-shrink-0 font-bold transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-primary tracking-widest">طلابنا</span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground border-r-4 border-primary pr-4">ماذا يقول عنا الطلاب</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">آراء طلاب جامعة الزاوية حول تجربتهم مع المنصة</p>
        </div>
        <div className="w-full">
          <Carousel opts={{ loop: true, align: "start" }}>
            <CarouselContent className="items-stretch">
              {TESTIMONIALS.map((t, i) => (
                <CarouselItem key={i} className="basis-full sm:basis-1/2 lg:basis-1/3 h-full">
                  <div className="bg-card border border-border p-5 md:p-6 rounded-2xl h-full flex flex-col gap-4">
                    <div className="flex gap-1">{Array.from({ length: 5 }).map((_, j) => (<Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary" />))}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-sm font-bold">{t.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-foreground truncate">{t.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
