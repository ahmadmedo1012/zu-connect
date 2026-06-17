import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatePresence, motion, Suspense } from "framer-motion";
import { lazy, useCallback } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import NotFound from "@/pages/not-found";
import AdminNotFound from "@/pages/admin/NotFound";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { setupAuthTokenGetter } from "@/lib/auth/setupAuth";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded pages
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

// Admin lazy imports
const AdminGuard = lazy(() => import("@/components/admin/AdminGuard"));
const AdminErrorBoundary = lazy(() => import("@/components/admin/AdminErrorBoundary"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
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

const queryClient = new QueryClient();

setupAuthTokenGetter();

// Premium loading fallback
function PageFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 px-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton variant="text" className="h-6 w-3/4" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
        <Skeleton variant="card" className="h-40" />
        <Skeleton variant="card" className="h-40" />
        <Skeleton variant="card" className="h-40" />
      </div>
    </div>
  );
}

function AdminFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 px-4">
      <div className="w-full max-w-4xl space-y-4">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="card" className="h-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton variant="card" className="h-24" />
          <Skeleton variant="card" className="h-24" />
          <Skeleton variant="card" className="h-24" />
          <Skeleton variant="card" className="h-24" />
        </div>
        <Skeleton variant="card" className="h-64" />
      </div>
    </div>
  );
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
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
  );
}

// Memoized wrapper to prevent re-renders
const withSuspense = useCallback((Component: React.ComponentType, fallback: React.ReactElement) => {
  return () => (
    <Suspense fallback={fallback}>
      <AnimatedPage>
        <Component />
      </AnimatedPage>
    </Suspense>
  );
}, []);

const PublicPage = withSuspense;
const AdminPage = withSuspense;

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
    </ThemeProvider>
  );
}

export default App;
