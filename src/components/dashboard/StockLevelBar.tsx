import { cn } from "@/lib/utils";
import type { Product } from "@/data/mockData";

const StockLevelBar = ({ product }: { product: Product }) => {
  const percentage = Math.round((product.currentStock / product.maxCapacity) * 100);
  const thresholdPercent = Math.round((product.minThreshold / product.maxCapacity) * 100);

  const getColor = () => {
    if (product.currentStock === 0) return "bg-critical";
    if (product.currentStock <= product.minThreshold) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-[140px]">
        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground font-mono">{product.shelfLocation}</p>
      </div>
      <div className="relative flex-1 h-5 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", getColor())}
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-0 h-full w-px bg-muted-foreground/40"
          style={{ left: `${thresholdPercent}%` }}
        />
      </div>
      <span className={cn(
        "min-w-[50px] text-right text-sm font-mono font-medium",
        product.currentStock === 0 ? "text-critical" : product.currentStock <= product.minThreshold ? "text-warning" : "text-success"
      )}>
        {product.currentStock}/{product.maxCapacity}
      </span>
    </div>
  );
};

export default StockLevelBar;
