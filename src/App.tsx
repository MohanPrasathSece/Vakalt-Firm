import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ScrollToTop } from "./components/ScrollToTop";
import ScrollToTopHandler from "./components/ScrollToTopHandler";

// Lazy Load Pages for Performance
const Index = lazy(() => import("./pages/Index"));
const Insights = lazy(() => import("./pages/Insights"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Tools = lazy(() => import("./pages/Tools"));
const Contact = lazy(() => import("./pages/Contact"));
const CourtFeeCalculator = lazy(() => import("./pages/CourtFeeCalculator"));
const CareersPage = lazy(() => import("./pages/Careers"));
const SubmitJob = lazy(() => import("./pages/SubmitJob"));
const LegalDrafts = lazy(() => import("./pages/LegalDrafts"));
const CourtVCLinks = lazy(() => import("./pages/CourtVCLinks"));
const PoliceStations = lazy(() => import("./pages/PoliceStations"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy Load Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminPosts = lazy(() => import("./pages/admin/Posts"));
const AdminEditPost = lazy(() => import("./pages/admin/EditPost"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminCareers = lazy(() => import("./pages/admin/Careers"));
const AdminEditCareer = lazy(() => import("./pages/admin/EditCareer"));
const AdminApplications = lazy(() => import("./pages/admin/Applications"));

// Configure Query Client for optimal caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Unused data is garbage collected after 30 mins
      retry: 1, // Only retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus to save bandwidth
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="/careers/submit" element={<SubmitJob />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
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
          </Suspense>
          <ScrollToTopHandler />
          <ScrollToTop />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
