import { Topbar } from "./Topbar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans" dir="rtl">
      <div className="relative flex flex-col min-h-[100dvh]">
        {/* gentle animated gradient orbs + dot grid */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-dot-grid">
          <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07] dark:opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
              animation: "drift-orb 20s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full opacity-[0.05] dark:opacity-[0.03]"
            style={{
              background: "radial-gradient(circle, hsl(var(--accent-gold)) 0%, transparent 70%)",
              animation: "drift-orb 25s ease-in-out infinite alternate-reverse",
            }}
          />
          <div
            className="absolute top-[40%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.02]"
            style={{
              background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)",
              animation: "drift-orb 30s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute top-[60%] right-[-8%] w-[600px] h-[600px] rounded-full opacity-[0.04] dark:opacity-[0.02]"
            style={{
              background: "radial-gradient(circle, hsl(262 80% 54%) 0%, transparent 70%)",
              animation: "drift-orb 22s ease-in-out infinite reverse",
            }}
          />
        </div>
        <Topbar />
        <Navbar />
        <main
          className={cn(
            "flex-1 w-full mx-auto",
            isMobile
              ? "px-4"
              : "px-6 max-w-7xl"
          )}
        >
          {children}
        </main>
        <Footer />
      </div>

      {/* keyframes defined in index.css — drift-orb, orbit, etc. */}
    </div>
  );
}
