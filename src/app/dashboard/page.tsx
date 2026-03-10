"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Datos para las tarjetas de estadísticas superiores
  const stats = [
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header con Bienvenida Personalizada */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Hola, {user?.name || "Usuario"} 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Aquí tienes el resumen de tus finanzas hoy.
          </p>
        </div>
        <Link
          href="/expenses?openScanner=true"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95 text-sm"
        >
          <Plus size={20} />
          Nuevo Gasto
        </Link>
      </header>

      {/* Grid de Estadísticas con animaciones suaves */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass p-6 rounded-2xl flex items-center gap-4 hover:translate-y-[-4px] transition-transform cursor-default"
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
          </div>
        ))}
      </div>

      {/* Área de Tráfico Principal: Transacciones y Presupuesto */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Izquierdo: Lista de Transacciones Recientes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Transacciones Recientes</h2>
            <Link
              href="/expenses"
              className="text-primary font-semibold hover:underline text-sm"
            >
              Ver todas
            </Link>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 space-y-4">
              {expenses.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Receipt className="mx-auto opacity-20 mb-3" size={48} />
                  <p>No hay transacciones aún registrado.</p>
                </div>
              ) : (
                expenses.slice(0, 5).map((expense, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Receipt size={20} />
                      </div>
                      <div>
                        <p className="font-bold">{expense.merchant}</p>
                        <p className="text-sm text-muted-foreground lowercase italic">
                          {expense.category} • {expense.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive">
                        -${expense.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Estado del Presupuesto Dinámico */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Estado Presupuesto</h2>
          <div className="glass p-6 rounded-2xl space-y-6">
            {/* Progreso Global */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Total Consumido</span>
                <span
                  className={cn(
                    expensePercentage > 90
                      ? "text-destructive"
                      : "text-primary",
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
                const catBudget = budget > 0 ? budget * 0.3 : 0; // Simulamos presupuesto por categoría como 30% del total
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
          </div>
        </div>
      </div>
    </div>
  );
}
