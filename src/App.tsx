import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Portal from "./pages/Portal";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import RfidMonitor from "./pages/RfidMonitor";
import Reorders from "./pages/Reorders";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierProducts from "./pages/supplier/SupplierProducts";
import SupplierOrders from "./pages/supplier/SupplierOrders";
import SupplierInvoices from "./pages/supplier/SupplierInvoices";
import CustomerBrowse from "./pages/customer/CustomerBrowse";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerOrders from "./pages/customer/CustomerOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Portal Selection */}
          <Route path="/portal" element={<Portal />} />

          {/* Manager Portal */}
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/rfid-monitor" element={<RfidMonitor />} />
          <Route path="/reorders" element={<Reorders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />

          {/* Supplier Portal */}
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/supplier/products" element={<SupplierProducts />} />
          <Route path="/supplier/orders" element={<SupplierOrders />} />
          <Route path="/supplier/invoices" element={<SupplierInvoices />} />

          {/* Customer Portal */}
          <Route path="/customer" element={<CustomerBrowse />} />
          <Route path="/customer/cart" element={<CustomerCart />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
