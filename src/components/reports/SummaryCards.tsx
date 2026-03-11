import { AlertTriangle, TrendingUp } from "lucide-react";

interface CategoryStats {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface SummaryCardsProps {
  overBudgetCats: CategoryStats[];
  totalSpent: number;
  globalBudget: number;
}

export function SummaryCards({
  overBudgetCats,
  totalSpent,
  globalBudget,
}: SummaryCardsProps) {
  return overBudgetCats.length > 0 ? (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
      <div className="p-3 bg-destructive/20 text-destructive rounded-xl">
        <AlertTriangle size={24} />
      </div>
      <div>
        <p className="font-bold text-destructive">¡Alerta de Presupuesto!</p>
        <p className="text-sm text-destructive/80 font-medium">
          Has superado el límite sugerido en {overBudgetCats.length}{" "}
          {overBudgetCats.length === 1 ? "categoría" : "categorías"}.
        </p>
      </div>
    </div>
  ) : (
    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
        <TrendingUp size={24} />
      </div>
      <div>
        <p className="font-bold text-emerald-500">Gestión Saludable</p>
        <p className="text-sm text-muted-foreground font-medium">
          Tus gastos suman ${totalSpent.toFixed(2)} de un presupuesto de $
          {globalBudget.toFixed(2)}.
        </p>
      </div>
    </div>
  );
}
