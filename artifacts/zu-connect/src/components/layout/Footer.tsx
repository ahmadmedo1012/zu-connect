import { Link } from "wouter";

const QUICK_LINKS = [
  { href: "/about", label: "عن الاتحاد" },
  { href: "/services", label: "الخدمات الطلابية" },
  { href: "/news", label: "الأخبار والأنشطة" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/colleges", label: "الكليات" },
  { href: "/library", label: "المكتبة" },
];

const SOCIAL_PLACEHOLDERS = [
  { name: "فيسبوك", icon: "F" },
  { name: "تويتر", icon: "X" },
  { name: "تيليجرام", icon: "T" },
  { name: "انستغرام", icon: "I" },
];

export function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-border bg-gradient-to-b from-card to-card/95 dark:from-[#0d111a] dark:to-[#090c14]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* brand */}
          <div className="flex flex-col gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-xl text-foreground tracking-tight">ZU Connect</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              المنصة الرسمية للاتحاد العام لطلبة جامعة الزاوية. نهدف إلى تقديم أفضل الخدمات للطلاب وتسهيل
              مسيرتهم الأكاديمية والأنشطة الطلابية.
            </p>
            {/* social icons placeholder */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL_PLACEHOLDERS.map((s) => (
                <span
                  key={s.name}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  title={s.name}
                  aria-label={s.name}
                >
                  {s.icon}
                </span>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h3 className="font-bold text-lg text-foreground">روابط سريعة</h3>
            <div className="flex flex-col gap-1.5">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-muted-foreground hover:text-primary transition-all text-sm w-fit py-1 hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* contact */}
          <div className="flex flex-col gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-lg text-foreground">تواصل معنا</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex flex-col gap-0.5 py-1">
                <span className="text-[10px] text-foreground/50 font-semibold tracking-wide uppercase">البريد الإلكتروني</span>
                <a href="mailto:info@zu-connect.edu.ly" className="hover:text-primary transition-colors">info@zu-connect.edu.ly</a>
              </div>
              <div className="flex flex-col gap-0.5 py-1">
                <span className="text-[10px] text-foreground/50 font-semibold tracking-wide uppercase">الهاتف</span>
                <p>+218 23 123 4567</p>
              </div>
              <div className="flex flex-col gap-0.5 py-1">
                <span className="text-[10px] text-foreground/50 font-semibold tracking-wide uppercase">العنوان</span>
                <p>جامعة الزاوية، الزاوية، ليبيا</p>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} الاتحاد العام لطلبة جامعة الزاوية. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
