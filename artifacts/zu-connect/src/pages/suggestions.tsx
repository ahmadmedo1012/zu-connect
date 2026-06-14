import { useCreateSuggestion } from "@workspace/api-client-react";
import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";

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

const suggestionSchema = z.object({
  name: z.string().optional(),
  college: z.string().optional(),
  type: z.enum(["اقتراح", "شكوى", "فكرة نشاط", "أخرى"]),
  message: z.string().min(1, "الرجاء كتابة الرسالة").min(5, "الرسالة قصيرة جداً")
});

export default function Suggestions() {
  const prefersReducedMotion = useReducedMotion();
  const { toast } = useToast();
  const createSuggestion = useCreateSuggestion();
  
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    type: "اقتراح",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = suggestionSchema.safeParse(formData);
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
    createSuggestion.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            title: "تم الإرسال بنجاح",
            description: "شكراً لتواصلك معنا، سيتم مراجعة طلبك بأقرب وقت."
          });
          setFormData({ name: "", college: "", type: "اقتراح", message: "" });
          setErrors({});
        },
        onError: () => {
          toast({
            title: "خطأ في الإرسال",
            description: "حدث خطأ أثناء إرسال رسالتك. الرجاء المحاولة لاحقاً.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-white border-r-4 border-primary pr-4">اقترح / تواصل</h1>
        <p className="text-muted-foreground">نحن هنا للاستماع لأفكارك ومقترحاتك أو شكواك. تواصلك معنا يساهم في تحسين البيئة الجامعية.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div variants={itemVariants} className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white mb-2">نموذج التواصل</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white">الاسم (اختياري)</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-white">الكلية (اختياري)</label>
                <input 
                  type="text" 
                  value={formData.college}
                  onChange={e => setFormData({...formData, college: e.target.value})}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
                  placeholder="اسم كليتك"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white">نوع الرسالة *</label>
              <select 
                value={formData.type}
                onChange={e => { setFormData({...formData, type: e.target.value}); setErrors(prev => { const n = {...prev}; delete n.type; return n; }); }}
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white appearance-none cursor-pointer"
                required
              >
                <option value="اقتراح">اقتراح</option>
                <option value="شكوى">شكوى</option>
                <option value="فكرة نشاط">فكرة نشاط</option>
                <option value="أخرى">أخرى</option>
              </select>
              {errors.type && <span className="text-red-400 text-xs">{errors.type}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white">الرسالة أو المقترح *</label>
              <textarea 
                value={formData.message}
                onChange={e => { setFormData({...formData, message: e.target.value}); setErrors(prev => { const n = {...prev}; delete n.message; return n; }); }}
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white min-h-[150px] resize-none"
                placeholder="اكتب رسالتك هنا بالتفصيل..."
                required
              />
              {errors.message && <span className="text-red-400 text-xs">{errors.message}</span>}
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="mt-4 rounded-xl font-bold"
              disabled={!formData.message || createSuggestion.isPending}
            >
              إرسال الرسالة
            </Button>
          </form>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white border-r-2 border-primary pr-3">مكتب الاتحاد</h3>
            
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p>مقر الاتحاد العام لطلبة جامعة الزاوية، الحرم الجامعي الرئيسي، بجوار المكتبة المركزية.</p>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary shrink-0" />
                <p>أوقات الدوام: الأحد - الخميس (9:00 ص - 2:00 م)</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <p>+218 23 123 4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <p>info@zu-connect.edu.ly</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#152a4f] border border-[#d4af37]/30 rounded-3xl p-6 text-center flex flex-col gap-3">
            <h3 className="text-white font-bold">بوابة الشكاوى العاجلة</h3>
            <p className="text-xs text-[#d4af37]/80">في حال وجود شكوى طارئة تتعلق بالامتحانات أو الخدمات الأساسية، يمكنك التواصل مباشرة مع الخط الساخن للاتحاد.</p>
            <Button variant="outline" className="mt-2 bg-transparent text-[#d4af37] border-[#d4af37] hover:bg-[#d4af37] hover:text-black">
              الخط الساخن: 1442
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
