import { Link } from "wouter";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MessageSquare, BookOpen, Library, GraduationCap, CalendarDays, HeartHandshake, Lightbulb, Users, Globe, Flag, ShieldQuestion, Briefcase } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie";

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

const SERVICES = [
  { id: 1, title: "صندوق الاقتراحات", icon: Lightbulb, href: "/suggestions", desc: "أرسل أفكارك ومقترحاتك لتطوير الجامعة" },
  { id: 2, title: "غرف النقاش", icon: MessageSquare, href: "/chat", desc: "تواصل مع زملائك وناقش المواضيع الأكاديمية" },
  { id: 3, title: "الدورات التدريبية", icon: BookOpen, href: "/courses", desc: "سجل في الدورات التطويرية والمجانية" },
  { id: 4, title: "المكتبة الرقمية", icon: Library, href: "/library", desc: "حمل الملخصات والكتب والمناهج الدراسية" },
  { id: 5, title: "التصويت الإلكتروني", icon: Users, href: "#", desc: "شارك في استطلاعات الرأي والانتخابات (قريباً)" },
  { id: 6, title: "المرشد الأكاديمي (AI)", icon: Globe, href: "/", desc: "اسأل المساعد الذكي عن أي استفسار جامعي" },
  { id: 7, title: "التطوع", icon: HeartHandshake, href: "/volunteer", desc: "انضم لفرق التطوع وساهم في خدمة الجامعة" },
  { id: 8, title: "المنح والفرص", icon: Flag, href: "/news", desc: "اكتشف أحدث المنح الدراسية والفرص" },
  { id: 9, title: "خدمات الكلية", icon: GraduationCap, href: "/colleges", desc: "استعرض خدمات كليتك وجداول المحاضرات" },
  { id: 10, title: "الأنشطة القادمة", icon: CalendarDays, href: "/planner", desc: "اطلع على جدول الأنشطة والفعاليات" },
  { id: 11, title: "تواصل مع الاتحاد", icon: ShieldQuestion, href: "/suggestions", desc: "تواصل مباشرة مع مكاتب الاتحاد العام" },
  { id: 12, title: "شؤون الخريجين", icon: Briefcase, href: "/news", desc: "متابعة فرص العمل للخريجين" },
];

export default function Services() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4 text-center items-center max-w-3xl mx-auto mb-4">
        <LottieAnimation src="/animations/illustration/services-desk.json" className="w-[120px] h-[120px]" />
        <h1 className="text-3xl md:text-4xl font-black text-foreground">الخدمات الطلابية</h1>
        <p className="text-muted-foreground text-lg">بوابة موحدة لجميع الخدمات الأكاديمية والأنشطة الطلابية التي يقدمها الاتحاد لطلبة جامعة الزاوية.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {SERVICES.map(service => {
          const Icon = service.icon;
          return (
            <motion.div key={service.id} variants={itemVariants} whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}>
              <Link
                href={service.href}
                className="bg-card border border-border p-6 rounded-3xl flex flex-col gap-4 hover:bg-primary/5 hover:border-primary/50 transition-all group block"
              >
                <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
