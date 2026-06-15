import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";

interface AdminRole {
  id: number;
  name: string;
  label: string;
  level: number;
  permissions: string[];
  createdAt: string;
}

export default function AdminRoles() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/roles", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setRoles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">الأدوار والصلاحيات</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة أدوار المشرفين والصلاحيات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {role.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">{role.name} · المستوى {role.level}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 8).map((perm) => (
                  <Badge key={perm} variant="outline" className="text-xs">{perm}</Badge>
                ))}
                {role.permissions.length > 8 && (
                  <Badge variant="secondary" className="text-xs">+{role.permissions.length - 8}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
