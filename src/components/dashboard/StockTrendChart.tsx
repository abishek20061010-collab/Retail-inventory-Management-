import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { api } from "@/data/api";

const StockTrendChart = () => {
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    api.trends.getAll().then(setTrends);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={trends} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorInStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorLowStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOutOfStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(0 72% 51%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(0 72% 51%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 10% 18%)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(228 12% 12%)",
            border: "1px solid hsl(228 10% 18%)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Area type="monotone" dataKey="inStock" stroke="hsl(142 71% 45%)" fill="url(#colorInStock)" strokeWidth={2} />
        <Area type="monotone" dataKey="lowStock" stroke="hsl(38 92% 50%)" fill="url(#colorLowStock)" strokeWidth={2} />
        <Area type="monotone" dataKey="outOfStock" stroke="hsl(0 72% 51%)" fill="url(#colorOutOfStock)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StockTrendChart;
