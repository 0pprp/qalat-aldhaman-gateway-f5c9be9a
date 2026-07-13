import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerProfileProvider } from "@/contexts/CustomerProfileContext";
import Index from "./pages/Index";
import Store from "./pages/Store";
import StoreCategoryProducts from "./pages/StoreCategoryProducts";
import StoreProductDetail from "./pages/StoreProductDetail";
import StoreOrderForm from "./pages/StoreOrderForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CustomerProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/category/:slug" element={<StoreCategoryProducts />} />
            <Route path="/store/product/:id" element={<StoreProductDetail />} />
            <Route path="/store/order/:productId" element={<StoreOrderForm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CustomerProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
