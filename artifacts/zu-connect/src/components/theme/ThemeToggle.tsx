import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-[60px] h-[30px] rounded-full bg-muted border border-border transition-colors duration-300 cursor-pointer flex-shrink-0"
      aria-label={theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
    >
      <span
        className="absolute top-0.5 left-0.5 w-[25px] h-[25px] rounded-full bg-background shadow-sm flex items-center justify-center transition-transform duration-300"
        style={{
          transform: theme === "dark" ? "translateX(30px)" : "translateX(0)",
        }}
      >
        {theme === "dark" ? (
          <Moon className="w-3.5 h-3.5 text-foreground" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
}
