import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeClass(resolved: ResolvedTheme) {
  const root = document.documentElement;
  /* small transition window for smooth class swaps */
  root.classList.add("theme-transitioning");
  root.classList.toggle("dark", resolved === "dark");
  requestAnimationFrame(() => {
    setTimeout(() => root.classList.remove("theme-transitioning"), 300);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolved] = useState<ResolvedTheme>(() => resolveTheme(getStoredTheme()));

  const apply = useCallback((t: Theme) => {
    const resolved = resolveTheme(t);
    setResolved(resolved);
    applyThemeClass(resolved);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    apply(t);
  }, [apply]);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [theme, setTheme]);

  /* initial apply */
  useEffect(() => {
    apply(theme);
  }, []);

  /* follow OS preference when stored = system */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (!stored || stored === "system") {
        const t: Theme = "system";
        setThemeState(t);
        apply(t);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [apply]);

  return (
    <ThemeContext value={{ theme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
