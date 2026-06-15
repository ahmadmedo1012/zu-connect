import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveFeed } from "@/components/admin/LiveFeed";
import { Radio, Trash2 } from "lucide-react";
import { adminSocket } from "@/components/admin/AdminSocket";

interface LiveEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
}

export default function AdminLiveEvents() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/live/events?limit=100", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const eventTypes = [
      "admin:new_login", "admin:new_registration", "admin:new_referral",
      "admin:referral_rewarded", "admin:new_complaint", "admin:new_suggestion",
      "admin:moderation_action", "admin:announcement_published", "admin:system_alert",
      "admin:content_created", "admin:content_updated", "admin:content_deleted",
    ];

    const unsubs = eventTypes.map((type) =>
      adminSocket.on(type, (event: any) => {
        setEvents((prev) => [
          { id: `${type}_${Date.now()}`, type, payload: event.payload, timestamp: event._meta?.emittedAt || new Date().toISOString() },
          ...prev.slice(0, 199),
        ]);
      })
    );

    return () => unsubs.forEach((u) => u());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Radio className="h-5 w-5" />
            الأحداث المباشرة
          </h1>
          <p className="text-sm text-muted-foreground mt-1">مراقبة الأحداث في الوقت الفعلي</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEvents([])}>
          <Trash2 className="h-4 w-4 ml-1" />
          مسح
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <LiveFeed events={events} isLoading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
