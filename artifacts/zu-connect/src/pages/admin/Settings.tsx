import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save } from "lucide-react";

interface SystemSetting {
  key: string;
  value: any;
  type: string;
  category: string;
  description: string | null;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateSetting = (key: string, value: any) => {
    fetch(`/api/admin/settings/${key}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }).then(() => {
      setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
    });
  };

  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  const categoryLabels: Record<string, string> = {
    general: "عام",
    security: "الأمان",
    features: "الميزات",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          إعدادات النظام
        </h1>
        <p className="text-sm text-muted-foreground mt-1">إعدادات المنصة العامة</p>
      </div>

      {loading ? (
        <Card><CardContent className="p-4"><div className="h-32 bg-muted rounded animate-pulse" /></CardContent></Card>
      ) : Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-base">{categoryLabels[category] || category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{setting.key}</p>
                    {setting.description && (
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {setting.type === "boolean" ? (
                      <Switch
                        checked={!!setting.value}
                        onCheckedChange={(v) => updateSetting(setting.key, v)}
                      />
                    ) : setting.type === "number" ? (
                      <Input
                        type="number"
                        value={setting.value ?? ""}
                        onChange={(e) => updateSetting(setting.key, Number(e.target.value))}
                        className="w-24"
                      />
                    ) : (
                      <Input
                        value={setting.value ?? ""}
                        onChange={(e) => updateSetting(setting.key, e.target.value)}
                        className="w-48"
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>لا توجد إعدادات مكونة حالياً</p>
            <p className="text-xs mt-1">يمكن إضافة الإعدادات عبر البذرة الأولية (seed)</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
