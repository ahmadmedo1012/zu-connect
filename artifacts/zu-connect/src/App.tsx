import * as React from "react";
import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion, ReducedMotionProvider } from "@/hooks/use-reduced-motion";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { setupAuthTokenGetter } from "@/lib/auth/setupAuth";

// Lazy-loaded page components
const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Members = lazy(() => import("@/pages/members"));
const Colleges = lazy(() => import("@/pages/colleges"));
const News = lazy(() => import("@/pages/news"));
const Courses = lazy(() => import("@/pages/courses"));
const Planner = lazy(() => import("@/pages/planner"));
const Chat = lazy(() => import("@/pages/chat"));
const Services = lazy(() => import("@/pages/services"));
const Suggestions = lazy(() => import("@/pages/suggestions"));
const Volunteer = lazy(() => import("@/pages/volunteer"));
const Faq = lazy(() => import("@/pages/faq"));
const Library = lazy(() => import("@/pages/library"));
const Login = lazy(() => import("@/pages/login"));
const Profile = lazy(() => import("@/pages/profile"));
const Loyalty = lazy(() => import("@/pages/Loyalty"));
const LoyaltyHistory = lazy(() => import("@/pages/LoyaltyHistory"));
const Rewards = lazy(() => import("@/pages/Rewards"));
const Leaderboard = lazy(() => import("@/pages/Leaderboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Admin lazy-loaded pages
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminRoles = lazy(() => import("@/pages/admin/Roles"));
const AdminLiveEvents = lazy(() => import("@/pages/admin/LiveEvents"));
const AdminModeration = lazy(() => import("@/pages/admin/Moderation"));
const AdminComplaints = lazy(() => import("@/pages/admin/Complaints"));
const AdminReferrals = lazy(() => import("@/pages/admin/Referrals"));
const AdminGamification = lazy(() => import("@/pages/admin/Gamification"));
const AdminAnnouncements = lazy(() => import("@/pages/admin/Announcements"));
const AdminFiles = lazy(() => import("@/pages/admin/Files"));
const AdminActivity = lazy(() => import("@/pages/admin/Activity"));
const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));
const AdminIntegrations = lazy(() => import("@/pages/admin/Integrations"));
const AdminTelegram = lazy(() => import("@/pages/admin/Telegram"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const AdminAudit = lazy(() => import("@/pages/admin/Audit"));
const AdminLoyalty = lazy(() => import("@/pages/admin/Loyalty"));
const AdminNotFound = lazy(() => import("@/pages/admin/NotFound"));

// Non-lazy imports (layout, guards, providers - needed on first paint)
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { AdminLayout } from "@/components/admin/AdminLayout";

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

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
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
      <Route path="/admin">{() => <Suspense fallback={<LoadingSpinner />}><AdminDashboard /></Suspense>}</Route>
      <Route path="/admin/users">{() => <Suspense fallback={<LoadingSpinner />}><AdminUsers /></Suspense>}</Route>
      <Route path="/admin/roles">{() => <Suspense fallback={<LoadingSpinner />}><AdminRoles /></Suspense>}</Route>
      <Route path="/admin/live">{() => <Suspense fallback={<LoadingSpinner />}><AdminLiveEvents /></Suspense>}</Route>
      <Route path="/admin/moderation">{() => <Suspense fallback={<LoadingSpinner />}><AdminModeration /></Suspense>}</Route>
      <Route path="/admin/complaints">{() => <Suspense fallback={<LoadingSpinner />}><AdminComplaints /></Suspense>}</Route>
      <Route path="/admin/referrals">{() => <Suspense fallback={<LoadingSpinner />}><AdminReferrals /></Suspense>}</Route>
      <Route path="/admin/gamification">{() => <Suspense fallback={<LoadingSpinner />}><AdminGamification /></Suspense>}</Route>
      <Route path="/admin/announcements">{() => <Suspense fallback={<LoadingSpinner />}><AdminAnnouncements /></Suspense>}</Route>
      <Route path="/admin/files">{() => <Suspense fallback={<LoadingSpinner />}><AdminFiles /></Suspense>}</Route>
      <Route path="/admin/activity">{() => <Suspense fallback={<LoadingSpinner />}><AdminActivity /></Suspense>}</Route>
      <Route path="/admin/analytics">{() => <Suspense fallback={<LoadingSpinner />}><AdminAnalytics /></Suspense>}</Route>
      <Route path="/admin/integrations">{() => <Suspense fallback={<LoadingSpinner />}><AdminIntegrations /></Suspense>}</Route>
      <Route path="/admin/telegram">{() => <Suspense fallback={<LoadingSpinner />}><AdminTelegram /></Suspense>}</Route>
      <Route path="/admin/settings">{() => <Suspense fallback={<LoadingSpinner />}><AdminSettings /></Suspense>}</Route>
      <Route path="/admin/audit">{() => <Suspense fallback={<LoadingSpinner />}><AdminAudit /></Suspense>}</Route>
      <Route path="/admin/loyalty">{() => <Suspense fallback={<LoadingSpinner />}><AdminLoyalty /></Suspense>}</Route>
      <Route>{() => <Suspense fallback={<LoadingSpinner />}><AdminNotFound /></Suspense>}</Route>
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
          <Route path="/">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Home /></AnimatedPage></Suspense>}</Route>
          <Route path="/about">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><About /></AnimatedPage></Suspense>}</Route>
          <Route path="/members">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Members /></AnimatedPage></Suspense>}</Route>
          <Route path="/colleges">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Colleges /></AnimatedPage></Suspense>}</Route>
          <Route path="/news">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><News /></AnimatedPage></Suspense>}</Route>
          <Route path="/courses">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Courses /></AnimatedPage></Suspense>}</Route>
          <Route path="/planner">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Planner /></AnimatedPage></Suspense>}</Route>
          <Route path="/chat">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Chat /></AnimatedPage></Suspense>}</Route>
          <Route path="/services">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Services /></AnimatedPage></Suspense>}</Route>
          <Route path="/suggestions">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Suggestions /></AnimatedPage></Suspense>}</Route>
          <Route path="/volunteer">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Volunteer /></AnimatedPage></Suspense>}</Route>
          <Route path="/faq">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Faq /></AnimatedPage></Suspense>}</Route>
          <Route path="/library">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Library /></AnimatedPage></Suspense>}</Route>
          <Route path="/login">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Login /></AnimatedPage></Suspense>}</Route>
          <Route path="/profile">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Profile /></AnimatedPage></Suspense>}</Route>
          <Route path="/loyalty">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Loyalty /></AnimatedPage></Suspense>}</Route>
          <Route path="/loyalty/history">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><LoyaltyHistory /></AnimatedPage></Suspense>}</Route>
          <Route path="/loyalty/rewards">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Rewards /></AnimatedPage></Suspense>}</Route>
          <Route path="/leaderboard">{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><Leaderboard /></AnimatedPage></Suspense>}</Route>
          <Route>{() => <Suspense fallback={<LoadingSpinner />}><AnimatedPage><NotFound /></AnimatedPage></Suspense>}</Route>
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