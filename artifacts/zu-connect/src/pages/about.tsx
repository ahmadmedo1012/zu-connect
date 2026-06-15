import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LottieAnimation } from "@/components/ui/lottie";
import { containerVariants, itemVariants } from "@/lib/animations/variants";



export default function About() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="flex flex-col gap-8 py-8 max-w-6xl mx-auto px-4 md:px-6">
      <div className="relative w-full h-[180px] md:h-[260px] rounded-3xl overflow-hidden">
        <img
          src="/images/university-photo.jpg"
          alt="جامعة الزاوية"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-4 text-center -mt-12 md:-mt-16 relative z-10">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-primary/30 p-1.5 bg-background shadow-xl shadow-primary/10">
          <img
            src="/images/union-logo.jpg"
            alt="شعار الاتحاد"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground">عن الاتحاد</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          الممثل الشرعي والوحيد لطلبة جامعة الزاوية، نسعى لبناء بيئة جامعية متكاملة تدعم التفوق والإبداع.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-card border border-border p-8 rounded-2xl flex flex-col gap-4">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-black text-xl mb-2">ر</div>
          <h2 className="text-2xl font-bold text-foreground">رؤيتنا 2030</h2>
          <p className="text-muted-foreground leading-relaxed">
            أن نكون المؤسسة الطلابية الرائدة على مستوى الجامعات الليبية في تقديم الخدمات النوعية، وخلق بيئة محفزة على الابتكار، والريادة، والمشاركة المجتمعية الفعالة بحلول عام 2030.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-card border border-border p-8 rounded-2xl flex flex-col gap-4">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-black text-xl mb-2">ر</div>
          <h2 className="text-2xl font-bold text-foreground">رسالتنا</h2>
          <p className="text-muted-foreground leading-relaxed">
            الدفاع عن حقوق ومكتسبات الطلاب، وتوفير الدعم الأكاديمي والاجتماعي، وصقل مهاراتهم وقدراتهم من خلال البرامج والأنشطة المتنوعة، ليكونوا قادة المستقبل وصناع التغيير.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: "سنة التأسيس", value: "2008" },
          { label: "طالب وطالبة", value: "+5,240" },
          { label: "نشاط منجز", value: "+120" }
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="flex flex-col items-center justify-center gap-2 p-6 border-t-2 border-primary/30">
            <span className="text-5xl font-black text-foreground">{stat.value}</span>
            <span className="text-lg text-muted-foreground font-semibold">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col gap-8 mt-8"
      >
        <h2 className="text-3xl font-bold text-foreground border-r-4 border-primary pr-4">مسيرتنا التاريخية</h2>
        <div className="flex flex-col gap-6 relative pr-8 md:pr-16">
          <div className="absolute right-4 md:right-8 top-2 bottom-2 w-0.5 bg-border rounded-full" />
          
          {[
            { year: "2008", title: "التأسيس الأول", desc: "انطلاق أول تشكيل طلابي رسمي في الجامعة لتمثيل الطلاب." },
            { year: "2012", title: "توسيع الصلاحيات", desc: "اعتماد اللائحة التنظيمية الجديدة ومشاركة الاتحاد في مجلس الجامعة." },
            { year: "2015", title: "مرحلة إعادة الهيكلة", desc: "تحديث الهيكل التنظيمي ليشمل مكاتب متخصصة للخدمات الطلابية." },
            { year: "2018", title: "إطلاق الأنشطة الكبرى", desc: "تنظيم أول مؤتمر طلابي شامل وإطلاق دوري الجامعات." },
            { year: "2021", title: "التحول الرقمي", desc: "إطلاق أول منصة إلكترونية مصغرة لتقديم الخدمات عن بعد." },
            { year: "2024", title: "النسخة الجديدة للاتحاد", desc: "انتخاب مجلس جديد برؤية تطويرية شاملة لخدمة 5 آلاف طالب." },
            { year: "2026", title: "منصة ZU Connect", desc: "إطلاق المنصة الشاملة لتكون الرابط الرقمي لكل طالب بالجامعة." }
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="relative flex items-start gap-6">
              <div className="absolute right-4 md:right-8 top-1 w-6 h-6 -translate-x-1/2 rounded-full bg-background border-4 border-primary z-10" />
              <div className="flex flex-col gap-1 w-full bg-card border border-border p-5 rounded-2xl">
                <span className="text-primary font-black text-xl">{item.year}</span>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
