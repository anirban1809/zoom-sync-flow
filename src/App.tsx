import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppShell } from "./components/AppShell";
import Home from "./pages/Home";
import AIChat from "./pages/AIChat";
import Meetings from "./pages/Meetings";
import MeetingDetail from "./pages/MeetingDetail";
import Calendars from "./pages/Calendars";
import Search from "./pages/Search";
import Automations from "./pages/Automations";
import Integrations from "./pages/Integrations";
import Insights from "./pages/Insights";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import Billing from "./pages/Billing";
import Compliance from "./pages/Compliance";
import DataManagement from "./pages/DataManagement";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell><Home /></AppShell>} />
          <Route path="/ai-chat" element={<AppShell><AIChat /></AppShell>} />
          <Route path="/meetings" element={<AppShell><Meetings /></AppShell>} />
          <Route path="/meetings/:id" element={<AppShell><MeetingDetail /></AppShell>} />
          <Route path="/calendars" element={<AppShell><Calendars /></AppShell>} />
          <Route path="/search" element={<AppShell><Search /></AppShell>} />
          <Route path="/automations" element={<AppShell><Automations /></AppShell>} />
          <Route path="/integrations" element={<AppShell><Integrations /></AppShell>} />
          <Route path="/insights" element={<AppShell><Insights /></AppShell>} />
          <Route path="/notifications" element={<AppShell><Notifications /></AppShell>} />
          <Route path="/admin" element={<AppShell><Admin /></AppShell>} />
          <Route path="/billing" element={<AppShell><Billing /></AppShell>} />
          <Route path="/compliance" element={<AppShell><Compliance /></AppShell>} />
          <Route path="/data-management" element={<AppShell><DataManagement /></AppShell>} />
          <Route path="/help-support" element={<AppShell><HelpSupport /></AppShell>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
