import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricCard } from "@/components/admin/MetricCard";
import { Trophy, Users, Award, Gift, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

async function adminFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "فشل الطلب" }));
    throw new Error(err.error || err.message || "فشل الطلب");
  }
  return res.json();
}

export default function AdminLoyalty() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);
  const [config, setConfig] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [redemptionPagination, setRedemptionPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustPoints, setAdjustPoints] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, a, r, ach, t, c, red] = await Promise.all([
        adminFetch("/api/admin/loyalty/stats"),
        adminFetch("/api/admin/loyalty/actions"),
        adminFetch("/api/admin/loyalty/rewards"),
        adminFetch("/api/admin/loyalty/achievements"),
        adminFetch("/api/admin/loyalty/tiers"),
        adminFetch("/api/admin/loyalty/config"),
        adminFetch("/api/admin/loyalty/redemptions?status=pending"),
      ]);
      setStats(s);
      setActions(a.items);
      setRewards(r.items);
      setAchievements(ach.items);
      setTiers(t.items);
      setConfig(c.items);
      setRedemptions(red.items);
      setRedemptionPagination(red.pagination);
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleAction = async (key: string, enabled: boolean) => {
    try {
      await adminFetch(`/api/admin/loyalty/actions/${key}`, {
        method: "PUT",
        body: JSON.stringify({ enabled }),
      });
      toast({ title: "تم التحديث", description: `تم ${enabled ? "تفعيل" : "تعطيل"} الإجراء` });
      loadData();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const handleAdjust = async () => {
    if (!adjustUserId || !adjustPoints || !adjustReason) {
      toast({ title: "خطأ", description: "جميع الحقول مطلوبة", variant: "destructive" });
      return;
    }
    setAdjusting(true);
    try {
      await adminFetch(`/api/admin/loyalty/users/${adjustUserId}/adjust`, {
        method: "POST",
        body: JSON.stringify({ points: parseInt(adjustPoints), reason: adjustReason }),
      });
      toast({ title: "تم التعديل", description: "تم تعديل نقاط المستخدم" });
      setAdjustUserId(""); setAdjustPoints(""); setAdjustReason("");
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setAdjusting(false);
    }
  };

  const fulfillRedemption = async (id: number) => {
    try {
      await adminFetch(`/api/admin/loyalty/redemptions/${id}/fulfill`, { method: "PUT", body: JSON.stringify({ adminNote: "تم بواسطة المدير" }) });
      toast({ title: "تم التنفيذ", description: "تم تأكيد استيفاء المكافأة" });
      loadData();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const cancelRedemption = async (id: number) => {
    try {
      await adminFetch(`/api/admin/loyalty/redemptions/${id}/cancel`, { method: "PUT", body: JSON.stringify({ adminNote: "تم الإلغاء بواسطة المدير" }) });
      toast({ title: "تم الإلغاء", description: "تم إلغاء الاستبدال واسترداد النقاط" });
      loadData();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-6"><div className="animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-2xl" />)}</div></div>;

  return (
    <div className="p-6 flex flex-col gap-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة نظام الولاء</h1>
        <Button variant="outline" size="sm" onClick={loadData}>تحديث</Button>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Users} title="إجمالي المستخدمين" value={stats.users.total} />
          <MetricCard icon={Trophy} title="إجمالي النقاط" value={stats.users.totalPoints.toLocaleString()} />
          <MetricCard icon={Award} title="الشارات الممنوحة" value={stats.achievementsAwarded} />
          <MetricCard icon={Gift} title="استبدالات معلقة" value={stats.pendingRedemptions} />
        </div>
      )}

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="rounded-xl">
          <TabsTrigger value="actions" className="rounded-lg">الإجراءات</TabsTrigger>
          <TabsTrigger value="rewards" className="rounded-lg">المكافآت</TabsTrigger>
          <TabsTrigger value="achievements" className="rounded-lg">الإنجازات</TabsTrigger>
          <TabsTrigger value="tiers" className="rounded-lg">المستويات</TabsTrigger>
          <TabsTrigger value="config" className="rounded-lg">الإعدادات</TabsTrigger>
          <TabsTrigger value="redemptions" className="rounded-lg">الاستبدالات</TabsTrigger>
          <TabsTrigger value="adjust" className="rounded-lg">تعديل النقاط</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>إجراءات كسب النقاط</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المفتاح</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>النقاط</TableHead>
                    <TableHead>الحد اليومي</TableHead>
                    <TableHead>فترة التهدئة</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.map((a: any) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.actionKey}</TableCell>
                      <TableCell>{a.nameAr}</TableCell>
                      <TableCell>{a.pointValue}</TableCell>
                      <TableCell>{a.dailyLimit > 0 ? a.dailyLimit : "غير محدود"}</TableCell>
                      <TableCell>{a.cooldownMinutes ? `${a.cooldownMinutes} د` : "--"}</TableCell>
                      <TableCell>
                        <Button
                          size="sm" variant={a.enabled ? "default" : "outline"}
                          className="rounded-xl text-xs"
                          onClick={() => toggleAction(a.actionKey, !a.enabled)}
                        >
                          {a.enabled ? "مفعل" : "معطل"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>المكافآت</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>التكلفة</TableHead>
                    <TableHead>المخزون</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>فعال</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-bold">{r.nameAr}</TableCell>
                      <TableCell>{r.pointCost}</TableCell>
                      <TableCell>{r.stock === -1 ? "غير محدود" : r.stock}</TableCell>
                      <TableCell>{r.rewardType === "digital" ? "رقمي" : "مادي"}</TableCell>
                      <TableCell><Badge variant={r.isActive ? "default" : "secondary"}>{r.isActive ? "نعم" : "لا"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>الإنجازات</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المفتاح</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>مكافأة النقاط</TableHead>
                    <TableHead>مخفي</TableHead>
                    <TableHead>فعال</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievements.map((a: any) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.key}</TableCell>
                      <TableCell>{a.nameAr}</TableCell>
                      <TableCell>{a.pointReward}</TableCell>
                      <TableCell>{a.isHidden ? "نعم" : "لا"}</TableCell>
                      <TableCell><Badge variant={a.isActive ? "default" : "secondary"}>{a.isActive ? "نعم" : "لا"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>المستويات</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المفتاح</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الحد الأدنى</TableHead>
                    <TableHead>الحد الأقصى</TableHead>
                    <TableHead>الترتيب</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiers.map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.key}</TableCell>
                      <TableCell>{t.nameAr}</TableCell>
                      <TableCell>{t.minPoints}</TableCell>
                      <TableCell>{t.maxPoints ?? "غير محدود"}</TableCell>
                      <TableCell>{t.sortOrder}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>إعدادات الولاء</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المفتاح</TableHead>
                    <TableHead>القيمة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.map((c: any) => (
                    <TableRow key={c.key}>
                      <TableCell className="font-mono text-xs">{c.key}</TableCell>
                      <TableCell className="font-mono text-xs">{JSON.stringify(c.value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redemptions" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>استبدالات المكافآت</CardTitle></CardHeader>
            <CardContent>
              {redemptions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">لا توجد استبدالات معلقة</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>المكافأة</TableHead>
                      <TableHead>النقاط</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redemptions.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.userName}</TableCell>
                        <TableCell>{r.rewardName}</TableCell>
                        <TableCell>{r.pointsSpent}</TableCell>
                        <TableCell>{new Date(r.createdAt).toLocaleDateString("ar-EG")}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="default" className="rounded-xl" onClick={() => fulfillRedemption(r.id)}>
                            <CheckCircle className="w-4 h-4 ml-1" /> تنفيذ
                          </Button>
                          <Button size="sm" variant="destructive" className="rounded-xl" onClick={() => cancelRedemption(r.id)}>
                            <XCircle className="w-4 h-4 ml-1" /> إلغاء
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjust" className="mt-4">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>تعديل نقاط المستخدم</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4 max-w-md">
              <Input
                placeholder="معرف المستخدم"
                value={adjustUserId}
                onChange={e => setAdjustUserId(e.target.value)}
                type="number"
                className="rounded-xl"
              />
              <Input
                placeholder="عدد النقاط (موجب/سالب)"
                value={adjustPoints}
                onChange={e => setAdjustPoints(e.target.value)}
                type="number"
                className="rounded-xl"
              />
              <Input
                placeholder="سبب التعديل"
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                className="rounded-xl"
              />
              <Button onClick={handleAdjust} disabled={adjusting} className="rounded-xl">
                {adjusting ? "جاري..." : "تعديل النقاط"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
