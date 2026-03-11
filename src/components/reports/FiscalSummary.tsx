import { FileText, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card";

interface CategoryStats {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface FiscalSummaryProps {
  totalSpent: number;
  overBudgetCats: CategoryStats[];
}

export function FiscalSummary({
  totalSpent,
  overBudgetCats,
}: FiscalSummaryProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumen Fiscal</h2>
      <div className="space-y-4">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all cursor-pointer group p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">Declaración Fiscal</p>
              <p className="text-[10px] text-muted-foreground font-medium">
                Descarga consolidado de {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </Card>

        <div className="p-6 bg-muted/30 border border-border/50 rounded-2xl text-center space-y-2">
          <CalendarIcon
            className="mx-auto text-muted-foreground opacity-30"
            size={22}
          />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Semana Actual
          </p>
          <p className="text-xl font-extrabold text-primary">Corte: Dom 15</p>
        </div>

        <Card className="space-y-4 bg-primary/5 p-6">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            Sugerencia AI
          </h3>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            &quot;Observamos un aumento en **
            {overBudgetCats[0]?.name || "gastos hormiga"}**. Ajustar un 5% tus
            compras de impulso podría ahorrarte $
            {(totalSpent * 0.05).toFixed(0)} este mes.&quot;
          </p>
        </Card>
      </div>
    </div>
  );
}
