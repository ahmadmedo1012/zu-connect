import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Puzzle, Save } from "lucide-react";

interface Integration {
  id: number;
  key: string;
  value: string | null;
  type: string;
  category: string;
  description: string | null;
  isSecret: boolean;
}

export default function AdminIntegrations() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/integrations", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setIntegrations(data);
        const values: Record<string, string> = {};
        data.forEach((i: Integration) => { values[i.key] = i.value || ""; });
        setEditValues(values);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveIntegration = (key: string) => {
    fetch(`/api/admin/integrations/${key}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ value: editValues[key] }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIntegrations((prev) =>
          prev.map((i) => (i.key === key ? { ...i, value: data.value } : i))
        );
      }).catch((e) => {
        toast({ title: "خطأ", description: "فشل حفظ التكامل", variant: "destructive" });
      });
  };

  const grouped = integrations.reduce((acc, i) => {
    if (!acc[i.category]) acc[i.category] = [];
    acc[i.category].push(i);
    return acc;
  }, {} as Record<string, Integration[]>);

  const categoryLabels: Record<string, string> = {
    telegram: "تلغرام",
    email: "البريد الإلكتروني",
    storage: "التخزين",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Puzzle className="h-5 w-5" />
          التكاملات
        </h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة تكاملات الخدمات الخارجية</p>
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
              {items.map((integration) => (
                <div key={integration.key} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{integration.key}</p>
                    {integration.description && (
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={integration.isSecret ? "password" : "text"}
                      value={editValues[integration.key] || ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({ ...prev, [integration.key]: e.target.value }))
                      }
                      className="w-48"
                    />
                    <Button variant="outline" size="sm" onClick={() => saveIntegration(integration.key)}>
                      <Save className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Puzzle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد تكاملات مكونة</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
