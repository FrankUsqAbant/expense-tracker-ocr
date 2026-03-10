"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import {
  BarChart3,
  Download,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar as CalendarIcon,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

/**
 * Estructura de estadísticas por categoría de gasto.
 */
interface CategoryStats {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

/**
 * ReportsPage: Pantalla de análisis y generación de informes.
 * Procesa los datos de gastos para mostrar el progreso del presupuesto por categoría con gráficos.
 */
export default function ReportsPage() {
  const { user } = useAuth();

  // Estado local para los gastos procedentes de localStorage
  const [expenses, setExpenses] = useState<
    { amount: number; category: string }[]
  >([]);
  const [globalBudget, setGlobalBudget] = useState<number>(0);

  useEffect(() => {
    // Carga de datos reales
    const saved = localStorage.getItem("gastos-data");
    if (saved) setExpenses(JSON.parse(saved));

    const savedBudget = localStorage.getItem("gastos-budget");
    if (savedBudget) setGlobalBudget(parseFloat(savedBudget));
  }, []);

  /**
   * Cálculo de estadísticas por categoría.
   */
  const categories = ["Alimentación", "Transporte", "Entretenimiento", "Otros"];
  const stats: CategoryStats[] = categories.map((name) => {
    const spent = expenses
      .filter((e) => e.category === name)
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Repartición sugerida: Alimentación (40%), Transporte (20%), Entretenimiento (20%), Otros (20%)
    const distribution: Record<string, number> = {
      Alimentación: 0.4,
      Transporte: 0.2,
      Entretenimiento: 0.2,
      Otros: 0.2,
    };

    return {
      name,
      spent,
      budget: globalBudget * (distribution[name] || 0.2),
      color:
        name === "Alimentación"
          ? "rgba(59, 130, 246, 0.8)" // blue-500
          : name === "Transporte"
            ? "rgba(16, 185, 129, 0.8)" // emerald-500
            : name === "Entretenimiento"
              ? "rgba(244, 63, 94, 0.8)" // rose-500
              : "rgba(107, 114, 128, 0.8)", // gray-500
    };
  });

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const overBudgetCats = stats.filter(
    (s) => s.spent > s.budget && s.budget > 0,
  );

  // --- Gráfico de Dona ---
  const doughnutData = {
    labels: stats.map((s) => s.name),
    datasets: [
      {
        data: stats.map((s) => s.spent),
        backgroundColor: stats.map((s) => s.color),
        borderColor: stats.map((s) => s.color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  // --- Gráfico de Barras ---
  const barData = {
    labels: stats.map((s) => s.name),
    datasets: [
      {
        label: "Presupuesto Sugerido",
        data: stats.map((s) => s.budget),
        backgroundColor: "rgba(107, 114, 128, 0.2)",
        borderRadius: 8,
      },
      {
        label: "Gasto Real",
        data: stats.map((s) => s.spent),
        backgroundColor: stats.map((s) => s.color),
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Reportes & Análisis
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Visualiza tus hábitos de gasto y exporta informes fiscales.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg active:scale-95 text-sm">
          <Download size={20} />
          Exportar PDF/CSV
        </button>
      </header>

      {/* Alertas dinámicas */}
      {overBudgetCats.length > 0 ? (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
          <div className="p-3 bg-destructive/20 text-destructive rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="font-bold text-destructive">
              ¡Alerta de Presupuesto!
            </p>
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gráfico de Dona */}
            <div className="glass p-6 rounded-3xl space-y-4">
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
            </div>

            {/* Gráfico de Barras */}
            <div className="glass p-6 rounded-3xl space-y-4">
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
            </div>
          </div>

          {/* Listado de progreso */}
          <div className="glass p-8 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-primary" />
              Desglose Detallado
            </h2>
            <div className="space-y-6">
              {stats.map((cat, i) => {
                const percentage =
                  cat.budget > 0
                    ? Math.min((cat.spent / cat.budget) * 100, 100)
                    : 0;
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
          </div>
        </div>

        {/* Panel lateral de acciones */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Resumen Fiscal</h2>
          <div className="space-y-4">
            <div className="glass p-6 rounded-2xl border-l-4 border-l-primary hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors transition-all duration-500">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm">Declaración Fiscal</p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Descarga consolidado de {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 border border-border/50 rounded-2xl text-center space-y-2">
              <CalendarIcon
                className="mx-auto text-muted-foreground opacity-30"
                size={22}
              />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Semana Actual
              </p>
              <p className="text-xl font-extrabold text-primary">
                Corte: Dom 15
              </p>
            </div>

            <div className="glass p-6 rounded-2xl space-y-4 bg-primary/5">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                Sugerencia AI
              </h3>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "Observamos un aumento en **
                {overBudgetCats[0]?.name || "gastos hormiga"}**. Ajustar un 5%
                tus compras de impulso podría ahorrarte $
                {(totalSpent * 0.05).toFixed(0)} este mes."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
