import { Topbar } from "./Topbar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary/30" dir="rtl">
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[300px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-gold/10 rounded-full blur-[300px]" />
        </div>
        <Topbar />
        <Navbar />
        <main className="flex-1 w-full mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}