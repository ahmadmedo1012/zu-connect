import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggle}
      className="relative w-[56px] h-[28px] rounded-full bg-muted border border-border transition-all duration-300 cursor-pointer flex-shrink-0 hover:ring-2 hover:ring-ring/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
    >
      {/* track bg with gradient */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200 to-sky-700 opacity-60 dark:opacity-80 transition-opacity duration-300" />

      {/* knob — single icon, no duplication */}
      <span
        className="absolute top-[2px] flex items-center justify-center w-[23px] h-[23px] rounded-full bg-white dark:bg-gray-800 shadow-sm transition-all duration-300"
        style={{
          insetInlineStart: isDark ? "30px" : "2px",
        }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-sky-400" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" />
        )}
      </span>
    </button>
  );
}
