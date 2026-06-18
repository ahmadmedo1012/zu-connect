import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, toggle } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggle}
      className="group relative w-[62px] h-[30px] rounded-full bg-muted border border-border transition-all duration-500 cursor-pointer flex-shrink-0 hover:ring-2 hover:ring-ring/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
    >
      {/* track icons */}
      <Sun className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-400/70 pointer-events-none transition-all duration-500" />
      <Moon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-sky-300/70 pointer-events-none transition-all duration-500" />

      {/* knob */}
      <span
        className="absolute top-0.5 w-[25px] h-[25px] rounded-full bg-background shadow-card flex items-center justify-center transition-all duration-500 ease-spring group-hover:shadow-dropdown rtl:right-auto ltr:left-[2px]"
        style={{
          /* use inset-inline-start via logical prop — RTL-aware */
          insetInlineStart: isDark ? "33px" : "2px",
        }}
      >
        <span className="transition-transform duration-500" style={{ transform: isDark ? "rotate(180deg)" : "rotate(0deg)" }}>
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-sky-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </span>
      </span>
    </button>
  );
}
