"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetStatus } from "@/components/dashboard/BudgetStatus";

/**
 * DashboardPage: Panel de control principal.
 * Muestra el resumen financiero del usuario basándose en los gastos guardados en localStorage.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  // Estado local para almacenar la lista de gastos y el presupuesto
  const [expenses, setExpenses] = useState<
    { amount: number; merchant: string; category: string; date: string }[]
  >([]);
  const [budget, setBudget] = useState<number>(0);

  // Efecto para sincronizar los gastos y el presupuesto desde el almacenamiento local
  useEffect(() => {
    const savedExpenses = localStorage.getItem("gastos-data");
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    const savedBudget = localStorage.getItem("gastos-budget");
    if (savedBudget) setBudget(parseFloat(savedBudget));
  }, []);

  // --- Cálculos de resumen financiero ---
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const saving = budget > 0 ? budget - totalExpenses : 0;

  // Porcentaje de gasto respecto al presupuesto
  const expensePercentage =
    budget > 0 ? Math.min((totalExpenses / budget) * 100, 100) : 0;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title={`Hola, ${user?.name || "Usuario"} 👋`}
        description="Aquí tienes el resumen de tus finanzas hoy."
      >
        <Link
          href="/expenses?openScanner=true"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95 text-sm"
        >
          <Plus size={20} />
          Nuevo Gasto
        </Link>
      </PageHeader>

      <StatsGrid
        budget={budget}
        totalExpenses={totalExpenses}
        saving={saving}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentTransactions expenses={expenses} />
        </div>
        <div>
          <BudgetStatus
            totalExpenses={totalExpenses}
            budget={budget}
            expensePercentage={expensePercentage}
            expenses={expenses}
          />
        </div>
      </div>
    </div>
  );
}
