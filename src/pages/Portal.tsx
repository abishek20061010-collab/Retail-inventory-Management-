import { useNavigate } from "react-router-dom";
import { Radio, ShieldCheck, Truck, ShoppingCart, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const portals = [
  {
    id: "manager",
    title: "Manager Portal",
    description: "Inventory management, RFID monitoring, analytics & reorder control",
    icon: ShieldCheck,
    path: "/manager",
    gradient: "from-primary to-[hsl(240,80%,65%)]",
    glow: "glow-primary",
  },
  {
    id: "supplier",
    title: "Supplier Portal",
    description: "Manage product catalog, process incoming orders & generate invoices",
    icon: Truck,
    path: "/supplier",
    gradient: "from-success to-[hsl(160,60%,45%)]",
    glow: "glow-success",
  },
  {
    id: "customer",
    title: "Customer Portal",
    description: "Browse products, place orders & track deliveries",
    icon: ShoppingCart,
    path: "/customer",
    gradient: "from-warning to-[hsl(25,95%,53%)]",
    glow: "glow-warning",
  },
];

const Portal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <Radio className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ShelfSync</h1>
        </div>
        <p className="text-muted-foreground font-mono text-sm">RFID INVENTORY MANAGEMENT SYSTEM</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {portals.map((portal, i) => (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`group relative rounded-xl border border-border bg-card p-6 cursor-pointer transition-all duration-300 hover:border-primary/30 hover:${portal.glow}`}
            onClick={() => navigate(portal.path)}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${portal.gradient} mb-5`}>
              <portal.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">{portal.title}</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{portal.description}</p>
            <div className="flex items-center justify-between">
              <button className={`px-4 py-2 rounded-lg bg-gradient-to-r ${portal.gradient} text-sm font-medium text-primary-foreground transition-transform hover:scale-105`}>
                Enter Portal
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Exit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 text-xs text-muted-foreground font-mono"
      >
        v1.0 — RFID-Powered Retail Inventory
      </motion.p>
    </div>
  );
};

export default Portal;
