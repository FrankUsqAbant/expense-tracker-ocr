"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryCards } from "@/components/reports/SummaryCards";
import { ChartsGrid } from "@/components/reports/ChartsGrid";
import { DetailedBreakdown } from "@/components/reports/DetailedBreakdown";
import { FiscalSummary } from "@/components/reports/FiscalSummary";
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

interface CategoryStats {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

/**
 * ReportsPage: Pantalla de análisis y generación de informes.
 */
export default function ReportsPage() {
  const [expenses, setExpenses] = useState<
    { amount: number; category: string }[]
  >([]);
  const [globalBudget, setGlobalBudget] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("gastos-data");
    if (saved) setExpenses(JSON.parse(saved));

    const savedBudget = localStorage.getItem("gastos-budget");
    if (savedBudget) setGlobalBudget(parseFloat(savedBudget));
  }, []);

  const categories = ["Alimentación", "Transporte", "Entretenimiento", "Otros"];
  const stats: CategoryStats[] = categories.map((name) => {
    const spent = expenses
      .filter((e) => e.category === name)
      .reduce((acc, curr) => acc + curr.amount, 0);

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
          ? "rgba(59, 130, 246, 0.8)"
          : name === "Transporte"
            ? "rgba(16, 185, 129, 0.8)"
            : name === "Entretenimiento"
              ? "rgba(244, 63, 94, 0.8)"
              : "rgba(107, 114, 128, 0.8)",
    };
  });

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const overBudgetCats = stats.filter(
    (s) => s.spent > s.budget && s.budget > 0,
  );

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
      <PageHeader
        title="Reportes & Análisis"
        description="Visualiza tus hábitos de gasto y exporta informes fiscales."
      >
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg active:scale-95 text-sm">
          <Download size={20} />
          Exportar PDF/CSV
        </button>
      </PageHeader>

      <SummaryCards
        overBudgetCats={overBudgetCats}
        totalSpent={totalSpent}
        globalBudget={globalBudget}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ChartsGrid
            totalSpent={totalSpent}
            globalBudget={globalBudget}
            doughnutData={doughnutData}
            barData={barData}
          />
          <DetailedBreakdown stats={stats} />
        </div>
        <FiscalSummary
          totalSpent={totalSpent}
          overBudgetCats={overBudgetCats}
        />
      </div>
    </div>
  );
}
