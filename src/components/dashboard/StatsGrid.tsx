import { TrendingUp, TrendingDown, DollarSign, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../ui/Card";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface StatsGridProps {
  budget: number;
  totalExpenses: number;
  saving: number;
}

export function StatsGrid({ budget, totalExpenses, saving }: StatsGridProps) {
  const stats: StatItem[] = [
    {
      label: "Presupuesto",
      value: `$${budget.toFixed(2)}`,
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Gastos Mes",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color:
        totalExpenses > budget && budget > 0
          ? "text-destructive"
          : "text-amber-500",
      bg:
        totalExpenses > budget && budget > 0
          ? "bg-destructive/10"
          : "bg-amber-500/10",
    },
    {
      label: "Ahorro",
      value: `$${saving.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="flex items-center gap-4 hover:translate-y-[-4px] transition-transform cursor-default p-6"
        >
          <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
