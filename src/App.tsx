import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Insights from "./pages/Insights";
import PostDetail from "./pages/PostDetail";
import Tools from "./pages/Tools";
import Contact from "./pages/Contact";
import CourtFeeCalculator from "./pages/CourtFeeCalculator";
import CareersPage from "./pages/Careers";
import LegalDrafts from "./pages/LegalDrafts";
import CourtVCLinks from "./pages/CourtVCLinks";
import PoliceStations from "./pages/PoliceStations";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPosts from "./pages/admin/Posts";
import AdminEditPost from "./pages/admin/EditPost";
import AdminCategories from "./pages/admin/Categories";
import AdminCareers from "./pages/admin/Careers";
import AdminEditCareer from "./pages/admin/EditCareer";
import AdminApplications from "./pages/admin/Applications";
import { ScrollToTop } from "./components/ScrollToTop";
import ScrollToTopHandler from "./components/ScrollToTopHandler";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<PostDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/court-fee-calculator" element={<CourtFeeCalculator />} />
          <Route path="/tools/legal-drafts" element={<LegalDrafts />} />
          <Route path="/tools/court-vc-links" element={<CourtVCLinks />} />
          <Route path="/tools/police-stations" element={<PoliceStations />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/posts/new" element={<AdminEditPost />} />
          <Route path="/admin/posts/:id" element={<AdminEditPost />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/admin/careers/new" element={<AdminEditCareer />} />
          <Route path="/admin/careers/:id" element={<AdminEditCareer />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTopHandler />
        <ScrollToTop />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
