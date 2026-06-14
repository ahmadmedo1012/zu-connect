import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import About from "@/pages/about";
import Members from "@/pages/members";
import Colleges from "@/pages/colleges";
import News from "@/pages/news";
import Courses from "@/pages/courses";
import Planner from "@/pages/planner";
import Chat from "@/pages/chat";
import Services from "@/pages/services";
import Suggestions from "@/pages/suggestions";
import Volunteer from "@/pages/volunteer";
import Faq from "@/pages/faq";
import Library from "@/pages/library";
import Login from "@/pages/login";

const queryClient = new QueryClient();

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

function Router() {
  const [location] = useLocation()

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Switch key={location}>
          <Route path="/"><AnimatedPage><Home /></AnimatedPage></Route>
          <Route path="/about"><AnimatedPage><About /></AnimatedPage></Route>
          <Route path="/members"><AnimatedPage><Members /></AnimatedPage></Route>
          <Route path="/colleges"><AnimatedPage><Colleges /></AnimatedPage></Route>
          <Route path="/news"><AnimatedPage><News /></AnimatedPage></Route>
          <Route path="/courses"><AnimatedPage><Courses /></AnimatedPage></Route>
          <Route path="/planner"><AnimatedPage><Planner /></AnimatedPage></Route>
          <Route path="/chat"><AnimatedPage><Chat /></AnimatedPage></Route>
          <Route path="/services"><AnimatedPage><Services /></AnimatedPage></Route>
          <Route path="/suggestions"><AnimatedPage><Suggestions /></AnimatedPage></Route>
          <Route path="/volunteer"><AnimatedPage><Volunteer /></AnimatedPage></Route>
          <Route path="/faq"><AnimatedPage><Faq /></AnimatedPage></Route>
          <Route path="/library"><AnimatedPage><Library /></AnimatedPage></Route>
          <Route path="/login"><AnimatedPage><Login /></AnimatedPage></Route>
          <Route><AnimatedPage><NotFound /></AnimatedPage></Route>
        </Switch>
      </AnimatePresence>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
