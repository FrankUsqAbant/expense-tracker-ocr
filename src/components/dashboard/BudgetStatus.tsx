import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card } from "../ui/Card";

interface Expense {
  amount: number;
  merchant: string;
  category: string;
  date: string;
}

interface BudgetStatusProps {
  totalExpenses: number;
  budget: number;
  expensePercentage: number;
  expenses: Expense[];
}

export function BudgetStatus({
  totalExpenses,
  budget,
  expensePercentage,
  expenses,
}: BudgetStatusProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Estado Presupuesto</h2>
      <Card className="space-y-6">
        {/* Progreso Global */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span>Total Consumido</span>
            <span
              className={cn(
                expensePercentage > 90 ? "text-destructive" : "text-primary",
              )}
            >
              {Math.round(expensePercentage)}%
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/50">
            <div
              className={cn(
                "h-full transition-all duration-1000",
                expensePercentage > 90 ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${expensePercentage}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">
            ${totalExpenses.toFixed(2)} de ${budget.toFixed(2)}
          </p>
        </div>

        {/* Desglose por Categorías comunes */}
        <div className="space-y-4 pt-2 border-t border-border/50">
          {["Alimentación", "Transporte", "Entretenimiento"].map((cat) => {
            const spent = expenses
              .filter((e) => e.category === cat)
              .reduce((acc, curr) => acc + curr.amount, 0);
            const catBudget = budget > 0 ? budget * 0.3 : 0;
            const catPerc =
              catBudget > 0 ? Math.min((spent / catBudget) * 100, 100) : 0;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-muted-foreground">{cat}</span>
                  <span>${spent.toFixed(0)}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-1000"
                    style={{ width: `${catPerc}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/reports"
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground text-xs font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
        >
          Ver Análisis Detallado
        </Link>
      </Card>
    </div>
  );
}
