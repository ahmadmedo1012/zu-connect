import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Pagination } from "@/components/admin/Pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Search } from "lucide-react";

interface User {
  id: number;
  name: string;
  identifier: string;
  role: string;
  points: number;
  referralCode: string | null;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);

    fetch(`/api/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const roleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      teacher: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      student: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    const labels: Record<string, string> = {
      admin: "إدارة",
      teacher: "أستاذ",
      student: "طالب",
    };
    return (
      <Badge variant="secondary" className={styles[role] || ""}>
        {labels[role] || role}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">إدارة المستخدمين</h1>
        <p className="text-sm text-muted-foreground mt-1">عرض وإدارة جميع مستخدمي المنصة</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو المعرف..."
            className="pr-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleSearch}>بحث</Button>
      </div>

      <DataTable
        columns={[
          { key: "id", header: "#", render: (u: User) => u.id },
          { key: "name", header: "الاسم", render: (u: User) => u.name },
          { key: "identifier", header: "المعرف", render: (u: User) => u.identifier },
          { key: "role", header: "الدور", render: (u: User) => roleBadge(u.role) },
          { key: "points", header: "النقاط", render: (u: User) => u.points },
          { key: "createdAt", header: "تاريخ التسجيل", render: (u: User) => new Date(u.createdAt).toLocaleDateString("ar-EG") },
        ]}
        data={users}
        isLoading={loading}
        keyExtractor={(u: User) => u.id}
        emptyMessage="لا يوجد مستخدمون"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
