import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Settings, Activity } from "lucide-react";

interface TelegramConfig {
  botTokenConfigured: boolean;
  defaultChatId: string | null;
  isServiceReady: boolean;
  mappings: Array<{
    id: number;
    eventType: string;
    enabled: boolean;
    chatId: string | null;
    template: string | null;
    priority: string;
  }>;
}

export default function AdminTelegram() {
  const { toast } = useToast();
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    fetch("/api/admin/telegram/config", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setChatId(data.defaultChatId || "");
        setLoading(false);
      })
      .catch(() => { setLoading(false); toast({ title: "خطأ", description: "فشل تحميل إعدادات تلغرام", variant: "destructive" }); });
  }, []);

  const updateConfig = () => {
    fetch("/api/admin/telegram/config", {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ defaultChatId: chatId }),
    })
      .then((r) => r.json())
      .then(() => toast({ title: "تم الحفظ", description: "تم تحديث إعدادات تلغرام" }))
      .catch(() => toast({ title: "خطأ", description: "فشل حفظ الإعدادات", variant: "destructive" }));
  };

  const sendTest = (cid?: string) => {
    fetch("/api/admin/telegram/test", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: cid || chatId || undefined }),
    })
      .then((r) => r.json())
      .then((data) => toast({ title: data.success ? "تم الإرسال" : "فشل الإرسال", description: data.success ? "تم إرسال رسالة اختبار" : "تعذر إرسال رسالة الاختبار", variant: data.success ? "default" : "destructive" }))
      .catch(() => toast({ title: "خطأ", description: "فشل إرسال رسالة الاختبار", variant: "destructive" }));
  };

  const toggleMapping = (eventType: string, enabled: boolean) => {
    if (!config) return;
    const updatedMappings = config.mappings.map((m) =>
      m.eventType === eventType ? { ...m, enabled } : m
    );
    if (!updatedMappings.find((m) => m.eventType === eventType)) {
      updatedMappings.push({ id: 0, eventType, enabled, chatId: null, template: null, priority: "normal" });
    }
    fetch("/api/admin/telegram/config", {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        mappings: updatedMappings.map((m) => ({
          eventType: m.eventType,
          enabled: m.enabled,
          chatId: m.chatId,
          template: m.template,
          priority: m.priority,
        })),
      }),
    }).then(() => {
      setConfig({ ...config, mappings: updatedMappings });
    }).catch((e) => {
      toast({ title: "خطأ", description: "فشل حفظ إعدادات تلغرام", variant: "destructive" });
    });
  };

  const eventLabels: Record<string, string> = {
    new_registration: "تسجيل مستخدم جديد",
    new_referral: "إحالة جديدة",
    referral_rewarded: "مكافأة إحالة",
    new_complaint: "شكوى جديدة",
    new_suggestion: "اقتراح جديد",
    system_alert: "تنبيه نظام",
    announcement_published: "نشر إعلان",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Send className="h-5 w-5" />
          إعدادات تلغرام
        </h1>
        <p className="text-sm text-muted-foreground mt-1">تهيئة بوت تلغرام للإشعارات</p>
      </div>

      {loading ? (
        <Card><CardContent className="p-4"><div className="h-32 bg-muted rounded animate-pulse" /></CardContent></Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                الإعدادات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">حالة البوت:</span>
                {config?.isServiceReady ? (
                  <Badge className="bg-green-500">نشط</Badge>
                ) : (
                  <Badge variant="destructive">غير نشط</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">تم تعيين التوكن:</span>
                <Badge variant={config?.botTokenConfigured ? "default" : "secondary"}>
                  {config?.botTokenConfigured ? "نعم" : "لا"}
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">معرف المجموعة الافتراضي</label>
                <div className="flex gap-2">
                  <Input
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="-1001234567890"
                  />
                  <Button variant="outline" onClick={updateConfig}>حفظ</Button>
                  <Button variant="secondary" onClick={() => sendTest()}>اختبار</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                الأحداث والإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {config?.mappings.map((mapping) => (
                  <div key={mapping.eventType} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <span className="text-sm">{eventLabels[mapping.eventType] || mapping.eventType}</span>
                      <span className="text-xs text-muted-foreground mr-2">
                        ({mapping.priority})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {mapping.chatId && (
                        <span className="text-xs text-muted-foreground">{mapping.chatId}</span>
                      )}
                      <Button
                        variant={mapping.enabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMapping(mapping.eventType, !mapping.enabled)}
                      >
                        {mapping.enabled ? "مفعل" : "معطل"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
