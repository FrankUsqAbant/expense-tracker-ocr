import { FileText } from "lucide-react";
import { Card } from "../ui/Card";
import { cn } from "@/lib/utils";

interface CategoryStats {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface DetailedBreakdownProps {
  stats: CategoryStats[];
}

export function DetailedBreakdown({ stats }: DetailedBreakdownProps) {
  return (
    <Card className="p-8 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <FileText className="text-primary" />
        Desglose Detallado
      </h2>
      <div className="space-y-6">
        {stats.map((cat, i) => {
          const percentage =
            cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;
          const isOver = cat.spent > cat.budget && cat.budget > 0;

          return (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Asignado Sugerido: ${cat.budget.toFixed(0)}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-extrabold text-lg",
                    isOver ? "text-destructive" : "text-primary",
                  )}
                >
                  ${cat.spent.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                <div
                  className="h-full transition-all duration-1000 shadow-inner"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
