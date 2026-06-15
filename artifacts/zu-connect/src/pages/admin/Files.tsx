import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { File } from "lucide-react";

export default function AdminFiles() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <File className="h-5 w-5" />
          إدارة الملفات
        </h1>
        <p className="text-sm text-muted-foreground mt-1">عرض وإدارة الملفات المرفوعة</p>
      </div>

      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <File className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>إدارة الملفات قريباً</p>
          <p className="text-xs mt-1">هذه الواجهة قيد التطوير</p>
        </CardContent>
      </Card>
    </div>
  );
}
