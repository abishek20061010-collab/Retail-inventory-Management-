import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/data/api";

const Header = ({ title }: { title: string }) => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    api.alerts.getAll().then(setAlerts);
  }, []);

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, SKUs..."
            className="w-64 bg-secondary pl-9 text-sm border-border focus:ring-primary"
          />
        </div>
        <div className="relative">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-critical p-0 text-[10px] text-critical-foreground">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          SM
        </div>
      </div>
    </header>
  );
};

export default Header;
