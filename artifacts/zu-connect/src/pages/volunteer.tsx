import { useCreateVolunteer } from "@workspace/api-client-react";
import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Droplet, PartyPopper, Flag, Users, Radio } from "lucide-react";
import { LottieAnimation } from "@/components/ui/lottie";
import { containerVariants, itemVariants } from "@/lib/animations/variants";

const volunteerSchema = z.object({
  name: z.string().min(1, "الرجاء إدخال الاسم الرباعي").min(10, "الرجاء إدخال الاسم الرباعي كاملاً"),
  college: z.string().min(1, "الرجاء إدخال الكلية والسنة الدراسية"),
  phone: z.string().min(1, "الرجاء إدخال رقم الهاتف").regex(/^0\d{9}$/, "رقم هاتف غير صالح (يجب أن يبدأ بـ 0 ويتكون من 10 أرقام)"),
  area: z.string().min(1, "الرجاء اختيار مجال التطوع")
});

const CATEGORIES = [
  { id: "بيئي", title: "العمل البيئي", icon: Leaf, desc: "المشاركة في حملات التشجير والنظافة في الحرم الجامعي" },
  { id: "تبرع بالدم", title: "حملات التبرع بالدم", icon: Droplet, desc: "المساعدة في تنظيم وإدارة حملات التبرع بالدم الدورية" },
  { id: "فعاليات", title: "تنظيم الفعاليات", icon: PartyPopper, desc: "المساهمة في تنظيم المؤتمرات، الندوات، والمهرجانات الطلابية" },
  { id: "مبادرات وطنية", title: "مبادرات وطنية", icon: Flag, desc: "المشاركة في المبادرات والأعمال التطوعية على مستوى المدينة" },
  { id: "استقبال طلاب جدد", title: "استقبال الطلاب الجدد", icon: Users, desc: "إرشاد ومساعدة الطلاب الجدد في بداية العام الدراسي" },
  { id: "إعلام", title: "الفريق الإعلامي", icon: Radio, desc: "التصوير، التصميم، التغطية الإعلامية، وصناعة المحتوى" },
];

export default function Volunteer() {
  const prefersReducedMotion = useReducedMotion();
  const { toast } = useToast();
  const createVolunteer = useCreateVolunteer();
  
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    phone: "",
    area: "فعاليات"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = volunteerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    createVolunteer.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            title: "تم التسجيل بنجاح",
            description: "سعيدون بانضمامك لفريق التطوع، سنتواصل معك قريباً."
          });
          setFormData({ name: "", college: "", phone: "", area: "فعاليات" });
          setErrors({});
        },
        onError: () => {
          toast({
            title: "خطأ في التسجيل",
            description: "حدث خطأ أثناء إرسال طلبك. الرجاء المحاولة لاحقاً.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-4 text-center items-center">
        <LottieAnimation src="/animations/illustration/volunteer.json" className="w-[120px] h-[120px]" />
        <h1 className="text-4xl md:text-5xl font-black text-foreground">تطوع معنا</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          التطوع هو جوهر العمل الطلابي. كن جزءاً من صناعة التغيير، اكتسب مهارات جديدة، ووسع دائرة معارفك بالانضمام للجان التطوعية في الاتحاد.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              variants={itemVariants}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
               className={`bg-card border p-6 rounded-2xl flex flex-col gap-3 cursor-pointer transition-all ${formData.area === cat.id ? 'border-primary shadow-[0_0_15px_rgba(24,119,242,0.15)] scale-[1.02]' : 'border-border hover:border-primary/50'}`}
              onClick={() => setFormData({...formData, area: cat.id})}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${formData.area === cat.id ? 'bg-primary text-white' : 'bg-background text-primary'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{cat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="bg-card border border-border rounded-3xl p-8 max-w-2xl mx-auto w-full"
      >
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">استمارة التطوع</h2>
          <p className="text-sm text-muted-foreground">أكمل البيانات التالية وسنقوم بالتواصل معك</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">الاسم الرباعي *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => { setFormData({...formData, name: e.target.value}); setErrors(prev => { const n = {...prev}; delete n.name; return n; }); }}
              className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              required
            />
            {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">الكلية والسنة الدراسية *</label>
              <input 
                type="text" 
                value={formData.college}
                onChange={e => { setFormData({...formData, college: e.target.value}); setErrors(prev => { const n = {...prev}; delete n.college; return n; }); }}
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                placeholder="مثال: الهندسة - السنة الثالثة"
                required
              />
              {errors.college && <span className="text-destructive text-xs">{errors.college}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">رقم الهاتف *</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => { setFormData({...formData, phone: e.target.value}); setErrors(prev => { const n = {...prev}; delete n.phone; return n; }); }}
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground text-left"
                placeholder="09X XXX XXXX"
                dir="ltr"
                required
              />
              {errors.phone && <span className="text-destructive text-xs">{errors.phone}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">المجال المفضل للتطوع *</label>
            <select 
              value={formData.area}
              onChange={e => { setFormData({...formData, area: e.target.value}); setErrors(prev => { const n = {...prev}; delete n.area; return n; }); }}
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-foreground appearance-none cursor-pointer"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
            {errors.area && <span className="text-destructive text-xs">{errors.area}</span>}
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="mt-4 rounded-xl font-bold"
            disabled={!formData.name || !formData.phone || createVolunteer.isPending}
          >
            تأكيد التسجيل للتطوع
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
