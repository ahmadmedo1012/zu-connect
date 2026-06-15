import { Topbar } from "./Topbar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary/30" dir="rtl">
      <Topbar />
      <Navbar />
      <main className="flex-1 w-full mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
