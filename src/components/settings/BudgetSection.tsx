import { DollarSign } from "lucide-react";
import { Card } from "../ui/Card";

interface BudgetSectionProps {
  budget: number;
  onBudgetChange: (value: number) => void;
}

export function BudgetSection({ budget, onBudgetChange }: BudgetSectionProps) {
  return (
    <Card className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <DollarSign className="text-emerald-500" size={22} />
        Presupuesto Mensual
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">
            Límite de Gasto Mensual ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
              $
            </span>
            <input
              type="number"
              value={budget}
              onChange={(e) => onBudgetChange(parseFloat(e.target.value) || 0)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold text-lg transition-all"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-muted-foreground italic ml-1">
            Este valor se usará para calcular tus ahorros y mostrar alertas en
            los reportes.
          </p>
        </div>
      </div>
    </Card>
  );
}
