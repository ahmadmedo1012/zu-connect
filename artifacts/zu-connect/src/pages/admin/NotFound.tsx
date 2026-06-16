import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AdminNotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="text-6xl font-bold text-muted-foreground/30">404</div>
      <h2 className="text-xl font-bold">الصفحة غير موجودة</h2>
      <p className="text-muted-foreground">الصفحة التي تبحث عنها غير موجودة في لوحة التحكم</p>
      <Button onClick={() => setLocation("/admin")}>
        <ArrowRight className="h-4 w-4 ml-2" />
        العودة إلى لوحة التحكم
      </Button>
    </div>
  );
}
