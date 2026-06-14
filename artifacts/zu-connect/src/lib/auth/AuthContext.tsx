import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Role = "student" | "teacher" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  role: Role;
  identifier: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string, name: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.id && payload.name && payload.role && payload.identifier) {
      return { id: payload.id, name: payload.name, role: payload.role, identifier: payload.identifier };
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, name: string, role: Role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", name);
    const decoded = decodeToken(token);
    if (decoded) {
      setUser(decoded);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
