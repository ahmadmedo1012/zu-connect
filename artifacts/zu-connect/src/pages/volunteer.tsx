import { useCreateVolunteer } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Droplet, PartyPopper, Flag, Users, Radio } from "lucide-react";

const CATEGORIES = [
  { id: "بيئي", title: "العمل البيئي", icon: Leaf, desc: "المشاركة في حملات التشجير والنظافة في الحرم الجامعي" },
  { id: "تبرع بالدم", title: "حملات التبرع بالدم", icon: Droplet, desc: "المساعدة في تنظيم وإدارة حملات التبرع بالدم الدورية" },
  { id: "فعاليات", title: "تنظيم الفعاليات", icon: PartyPopper, desc: "المساهمة في تنظيم المؤتمرات، الندوات، والمهرجانات الطلابية" },
  { id: "مبادرات وطنية", title: "مبادرات وطنية", icon: Flag, desc: "المشاركة في المبادرات والأعمال التطوعية على مستوى المدينة" },
  { id: "استقبال طلاب جدد", title: "استقبال الطلاب الجدد", icon: Users, desc: "إرشاد ومساعدة الطلاب الجدد في بداية العام الدراسي" },
  { id: "إعلام", title: "الفريق الإعلامي", icon: Radio, desc: "التصوير، التصميم، التغطية الإعلامية، وصناعة المحتوى" },
];

export default function Volunteer() {
  const { toast } = useToast();
  const createVolunteer = useCreateVolunteer();
  
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    phone: "",
    area: "فعاليات"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVolunteer.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            title: "تم التسجيل بنجاح",
            description: "سعيدون بانضمامك لفريق التطوع، سنتواصل معك قريباً."
          });
          setFormData({ name: "", college: "", phone: "", area: "فعاليات" });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white">تطوع معنا</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          التطوع هو جوهر العمل الطلابي. كن جزءاً من صناعة التغيير، اكتسب مهارات جديدة، ووسع دائرة معارفك بالانضمام للجان التطوعية في الاتحاد.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <div 
              key={cat.id} 
              className={`bg-card border p-6 rounded-2xl flex flex-col gap-3 cursor-pointer transition-all ${formData.area === cat.id ? 'border-primary shadow-[0_0_15px_rgba(227,38,82,0.1)] scale-[1.02]' : 'border-border hover:border-primary/50'}`}
              onClick={() => setFormData({...formData, area: cat.id})}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${formData.area === cat.id ? 'bg-primary text-white' : 'bg-background text-primary'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{cat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white">استمارة التطوع</h2>
          <p className="text-sm text-muted-foreground">أكمل البيانات التالية وسنقوم بالتواصل معك</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">الاسم الرباعي *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white">الكلية والسنة الدراسية *</label>
              <input 
                type="text" 
                value={formData.college}
                onChange={e => setFormData({...formData, college: e.target.value})}
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
                placeholder="مثال: الهندسة - السنة الثالثة"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white">رقم الهاتف *</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white text-left"
                placeholder="09X XXX XXXX"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">المجال المفضل للتطوع *</label>
            <select 
              value={formData.area}
              onChange={e => setFormData({...formData, area: e.target.value})}
              className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white appearance-none cursor-pointer"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
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
      </div>
    </div>
  );
}
