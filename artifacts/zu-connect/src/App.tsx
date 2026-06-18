import * as React from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion, ReducedMotionProvider } from "@/hooks/use-reduced-motion";
import NotFound from "@/pages/not-found";
import AdminNotFound from "@/pages/admin/NotFound";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { setupAuthTokenGetter } from "@/lib/auth/setupAuth";

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
import Profile from "@/pages/profile";
import Loyalty from "@/pages/Loyalty";
import LoyaltyHistory from "@/pages/LoyaltyHistory";
import Rewards from "@/pages/Rewards";
import Leaderboard from "@/pages/Leaderboard";

// Admin imports
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminRoles from "@/pages/admin/Roles";
import AdminLiveEvents from "@/pages/admin/LiveEvents";
import AdminModeration from "@/pages/admin/Moderation";
import AdminComplaints from "@/pages/admin/Complaints";
import AdminReferrals from "@/pages/admin/Referrals";
import AdminGamification from "@/pages/admin/Gamification";
import AdminAnnouncements from "@/pages/admin/Announcements";
import AdminFiles from "@/pages/admin/Files";
import AdminActivity from "@/pages/admin/Activity";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminIntegrations from "@/pages/admin/Integrations";
import AdminTelegram from "@/pages/admin/Telegram";
import AdminSettings from "@/pages/admin/Settings";
import AdminAudit from "@/pages/admin/Audit";
import AdminLoyalty from "@/pages/admin/Loyalty";

const queryClient = new QueryClient();

setupAuthTokenGetter();

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

function LoadingBar() {
  const [location] = useLocation()
  const prefersReducedMotion = useReducedMotion()
  const [show, setShow] = React.useState(false)
  const prevRef = React.useRef(location)

  React.useEffect(() => {
    if (prevRef.current !== location) {
      setShow(true)
      prevRef.current = location
      const timer = setTimeout(() => setShow(false), 600)
      return () => clearTimeout(timer)
    }
    return
  }, [location])

  if (prefersReducedMotion || !show) return null

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-gradient-to-l from-primary via-primary/50 to-primary/20 origin-left pointer-events-none"
      style={{ transformOrigin: "left" }}
    />
  )
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminGuard>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin">{() => <AdminDashboard />}</Route>
      <Route path="/admin/users">{() => <AdminUsers />}</Route>
      <Route path="/admin/roles">{() => <AdminRoles />}</Route>
      <Route path="/admin/live">{() => <AdminLiveEvents />}</Route>
      <Route path="/admin/moderation">{() => <AdminModeration />}</Route>
      <Route path="/admin/complaints">{() => <AdminComplaints />}</Route>
      <Route path="/admin/referrals">{() => <AdminReferrals />}</Route>
      <Route path="/admin/gamification">{() => <AdminGamification />}</Route>
      <Route path="/admin/announcements">{() => <AdminAnnouncements />}</Route>
      <Route path="/admin/files">{() => <AdminFiles />}</Route>
      <Route path="/admin/activity">{() => <AdminActivity />}</Route>
      <Route path="/admin/analytics">{() => <AdminAnalytics />}</Route>
      <Route path="/admin/integrations">{() => <AdminIntegrations />}</Route>
      <Route path="/admin/telegram">{() => <AdminTelegram />}</Route>
      <Route path="/admin/settings">{() => <AdminSettings />}</Route>
      <Route path="/admin/audit">{() => <AdminAudit />}</Route>
      <Route path="/admin/loyalty">{() => <AdminLoyalty />}</Route>
      <Route>{() => <AdminNotFound />}</Route>
    </Switch>
  );
}

function Router() {
  const [location] = useLocation()

  // Admin routes use completely separate layout (no public navbar/footer)
  if (location.startsWith("/admin")) {
    return (
      <AdminRoute>
        <AdminErrorBoundary>
          <AdminRouter />
        </AdminErrorBoundary>
      </AdminRoute>
    );
  }

  // Public routes use AppLayout with Topbar + Navbar + Footer
  return (
    <AppLayout>
      <LoadingBar />
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
          <Route path="/profile"><AnimatedPage><Profile /></AnimatedPage></Route>
          <Route path="/loyalty"><AnimatedPage><Loyalty /></AnimatedPage></Route>
          <Route path="/loyalty/history"><AnimatedPage><LoyaltyHistory /></AnimatedPage></Route>
          <Route path="/loyalty/rewards"><AnimatedPage><Rewards /></AnimatedPage></Route>
          <Route path="/leaderboard"><AnimatedPage><Leaderboard /></AnimatedPage></Route>
          <Route><AnimatedPage><NotFound /></AnimatedPage></Route>
        </Switch>
      </AnimatePresence>
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ReducedMotionProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}

export default App;