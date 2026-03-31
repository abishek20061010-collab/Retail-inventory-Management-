import { Package, AlertTriangle, RefreshCw, Radio } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import KpiCard from "@/components/dashboard/KpiCard";
import StockLevelBar from "@/components/dashboard/StockLevelBar";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import StockTrendChart from "@/components/dashboard/StockTrendChart";
import { products, alerts, reorderRequests } from "@/data/mockData";

const Dashboard = () => {
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.currentStock > 0 && p.currentStock <= p.minThreshold).length;
  const outOfStockCount = products.filter((p) => p.currentStock === 0).length;
  const activeRfid = products.filter((p) => p.rfidStatus === "active").length;
  const pendingReorders = reorderRequests.filter((r) => r.status === "pending" || r.status === "approved").length;
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const sortedByStock = [...products].sort(
    (a, b) => a.currentStock / a.maxCapacity - b.currentStock / b.maxCapacity
  );

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Products"
            value={totalProducts}
            subtitle={`${activeRfid} RFID tags active`}
            icon={<Package className="h-5 w-5 text-primary" />}
          />
          <KpiCard
            title="Low Stock Alerts"
            value={lowStockCount + outOfStockCount}
            subtitle={`${outOfStockCount} out of stock`}
            icon={<AlertTriangle className="h-5 w-5 text-warning" />}
            glowClass={lowStockCount + outOfStockCount > 0 ? "glow-warning" : undefined}
          />
          <KpiCard
            title="Pending Reorders"
            value={pendingReorders}
            subtitle="Auto-triggered"
            icon={<RefreshCw className="h-5 w-5 text-primary" />}
          />
          <KpiCard
            title="RFID Active"
            value={`${activeRfid}/${totalProducts}`}
            subtitle="Tags responding"
            icon={<Radio className="h-5 w-5 text-success" />}
            trend={{ value: "98% uptime", positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Stock Levels */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Real-Time Shelf Stock Levels
            </h3>
            <div className="space-y-4">
              {sortedByStock.map((product) => (
                <StockLevelBar key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent Alerts</h3>
              {unreadAlerts > 0 && (
                <span className="flex h-5 items-center rounded-full bg-critical/20 px-2 text-[10px] font-bold text-critical">
                  {unreadAlerts} new
                </span>
              )}
            </div>
            <RecentAlerts />
          </div>
        </div>

        {/* Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Stock Status Trend (7 Days)
          </h3>
          <StockTrendChart />
          <div className="mt-3 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">In Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Low Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-critical" />
              <span className="text-xs text-muted-foreground">Out of Stock</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
