import { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Store, ClipboardList, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/customer", icon: Store, label: "Browse Products" },
  { to: "/customer/cart", icon: ShoppingCart, label: "My Cart" },
  { to: "/customer/orders", icon: ClipboardList, label: "My Orders" },
];

const CustomerLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-warning to-[hsl(25,95%,53%)]">
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Customer Portal</h1>
            <p className="text-[10px] font-mono text-muted-foreground">SHELFSYNC</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-warning/10 text-warning glow-warning"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-warning")} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => navigate("/portal")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </button>
        </div>
      </aside>

      <div className="ml-64">
        <header className="flex h-16 items-center border-b border-border bg-card/50 px-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default CustomerLayout;
