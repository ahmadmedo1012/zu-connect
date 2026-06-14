import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
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

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/members" component={Members} />
        <Route path="/colleges" component={Colleges} />
        <Route path="/news" component={News} />
        <Route path="/courses" component={Courses} />
        <Route path="/planner" component={Planner} />
        <Route path="/chat" component={Chat} />
        <Route path="/services" component={Services} />
        <Route path="/suggestions" component={Suggestions} />
        <Route path="/volunteer" component={Volunteer} />
        <Route path="/faq" component={Faq} />
        <Route path="/library" component={Library} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
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
