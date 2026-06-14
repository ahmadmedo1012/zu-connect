import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl text-foreground">ZU Connect</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              المنصة الرسمية للاتحاد العام لطلبة جامعة الزاوية. نهدف إلى تقديم أفضل الخدمات للطلاب وتسهيل مسيرتهم الأكاديمية والأنشطة الطلابية.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg text-foreground">روابط سريعة</h3>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm w-fit">عن الاتحاد</Link>
              <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm w-fit">الخدمات الطلابية</Link>
              <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors text-sm w-fit">الأخبار والأنشطة</Link>
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm w-fit">الأسئلة الشائعة</Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg text-foreground">تواصل معنا</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>البريد الإلكتروني: info@zu-connect.edu.ly</p>
              <p>الهاتف: +218 23 123 4567</p>
              <p>العنوان: جامعة الزاوية، الزاوية، ليبيا</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} الاتحاد العام لطلبة جامعة الزاوية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
