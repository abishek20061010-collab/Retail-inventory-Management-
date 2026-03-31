import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StockTrendChart from "@/components/dashboard/StockTrendChart";
import { categoryDistribution } from "@/data/mockData";
import { api } from "@/data/api";

const Analytics = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.inventory.getAll().then(setProducts);
  }, []);

  const stockData = products.map((p) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name,
    stock: p.currentStock,
    threshold: p.minThreshold,
  }));

  return (
    <AppLayout title="Analytics">
      <div className="space-y-6">
        {/* Trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stock Trend (7 Days)</h3>
          <StockTrendChart />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stock vs Threshold */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stock vs Min Threshold</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData} margin={{ top: 5, right: 5, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 10% 18%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} angle={-35} textAnchor="end" axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(228 12% 12%)", border: "1px solid hsl(228 10% 18%)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="stock" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threshold" fill="hsl(0 72% 51% / 0.5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Products by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(228 12% 12%)", border: "1px solid hsl(228 10% 18%)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span className="text-xs text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
