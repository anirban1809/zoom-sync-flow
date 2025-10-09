import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import Home from "./pages/Home";
import Meetings from "./pages/Meetings";
import MeetingDetail from "./pages/MeetingDetail";
import Calendars from "./pages/Calendars";
import Tasks from "./pages/Tasks";
import Accounts from "./pages/Accounts";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import Billing from "./pages/Billing";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell><Home /></AppShell>} />
          <Route path="/meetings" element={<AppShell><Meetings /></AppShell>} />
          <Route path="/meetings/:id" element={<AppShell><MeetingDetail /></AppShell>} />
          <Route path="/calendars" element={<AppShell><Calendars /></AppShell>} />
          <Route path="/tasks" element={<AppShell><Tasks /></AppShell>} />
          <Route path="/templates" element={<AppShell><div className="p-8 text-center text-muted-foreground">Templates page coming soon</div></AppShell>} />
          <Route path="/search" element={<AppShell><div className="p-8 text-center text-muted-foreground">Search page coming soon</div></AppShell>} />
          <Route path="/automations" element={<AppShell><div className="p-8 text-center text-muted-foreground">Automations page coming soon</div></AppShell>} />
          <Route path="/integrations" element={<AppShell><div className="p-8 text-center text-muted-foreground">Integrations page coming soon</div></AppShell>} />
          <Route path="/insights" element={<AppShell><div className="p-8 text-center text-muted-foreground">Insights page coming soon</div></AppShell>} />
          <Route path="/accounts" element={<AppShell><Accounts /></AppShell>} />
          <Route path="/notifications" element={<AppShell><Notifications /></AppShell>} />
          <Route path="/admin" element={<AppShell><Admin /></AppShell>} />
          <Route path="/billing" element={<AppShell><Billing /></AppShell>} />
          <Route path="/compliance" element={<AppShell><Compliance /></AppShell>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
