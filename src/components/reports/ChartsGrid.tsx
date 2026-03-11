import { Receipt, BarChart3, AlertTriangle } from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Card } from "../ui/Card";

import { ChartData } from "chart.js";

interface ChartsGridProps {
  totalSpent: number;
  globalBudget: number;
  doughnutData: ChartData<"doughnut">;
  barData: ChartData<"bar">;
}

export function ChartsGrid({
  totalSpent,
  globalBudget,
  doughnutData,
  barData,
}: ChartsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gráfico de Dona */}
      <Card className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Receipt className="text-primary" size={20} />
          Distribución
        </h3>
        <div className="aspect-square flex items-center justify-center p-4">
          {totalSpent > 0 ? (
            <Doughnut
              data={doughnutData}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          ) : (
            <div className="text-center space-y-2 opacity-30">
              <Receipt size={48} className="mx-auto" />
              <p className="text-xs italic font-medium">Sin datos aún</p>
            </div>
          )}
        </div>
      </Card>

      {/* Gráfico de Barras */}
      <Card className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="text-accent" size={20} />
          Presupuesto vs Real
        </h3>
        <div className="aspect-square flex items-center justify-center p-4">
          {globalBudget > 0 ? (
            <Bar
              data={barData}
              options={{
                indexAxis: "y",
                plugins: { legend: { display: false } },
              }}
            />
          ) : (
            <div className="text-center space-y-2 opacity-30">
              <AlertTriangle size={48} className="mx-auto" />
              <p className="text-xs italic font-medium">
                Configura un presupuesto
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
