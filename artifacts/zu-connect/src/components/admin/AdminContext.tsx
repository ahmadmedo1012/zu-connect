import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { adminSocket } from "./AdminSocket";

interface AdminContextValue {
  isConnected: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === "admin") {
      const token = localStorage.getItem("token");
      if (token) {
        adminSocket.connect(token);
      }
    }

    return () => {
      adminSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    adminSocket.onConnectionChange(setIsConnected);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <AdminContext.Provider value={{
      isConnected, sidebarCollapsed, toggleSidebar, setSidebarCollapsed,
      mobileMenuOpen, setMobileMenuOpen,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
