import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Generate from "./pages/Generate";
import Browse from "./pages/Browse";
import RecipeDetail from "./pages/RecipeDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/* ---- Footer with your name ---- */}
      <footer
        style={{
          textAlign: "center",
          padding: "16px",
          opacity: 0.6,
          fontSize: "14px",
          marginTop: "20px",
        }}
      >
        Built by <strong>Adnan</strong>
      </footer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
