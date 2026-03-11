"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { EditExpenseModal } from "@/components/expenses/EditExpenseModal";
import { ScannerModal } from "@/components/expenses/ScannerModal";

/**
 * Interface Expense: Estructura de datos principal para los gastos.
 */
interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  merchant: string;
  status?: "pending" | "completed";
  imageUrl?: string;
  items?: Array<{ description: string; quantity: number; price: number }>;
}

/**
 * Componente Principal de la Página de Gastos.
 */
function ExpensesContent() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const saved = localStorage.getItem("gastos-data");
    if (saved) setExpenses(JSON.parse(saved));

    if (searchParams.get("openScanner") === "true") {
      setIsScannerOpen(true);
    }
  }, [searchParams]);

  const addExpense = (data: any) => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      amount: data.amount || 0,
      date: data.date || new Date().toLocaleDateString(),
      merchant: data.merchant || "Nuevo Gasto Escaneado",
      category: data.category || "Sin Categoría",
      status: "completed",
      imageUrl: data.imageUrl || "",
      items: data.items || [],
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem("gastos-data", JSON.stringify(updated));
    setIsScannerOpen(false);
  };

  const deleteExpense = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este gasto?")) {
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      localStorage.setItem("gastos-data", JSON.stringify(updated));
    }
    setActiveMenu(null);
  };

  const handleUpdateExpense = () => {
    if (!editingExpense) return;
    const updated = expenses.map((e) =>
      e.id === editingExpense.id ? editingExpense : e,
    );
    setExpenses(updated);
    localStorage.setItem("gastos-data", JSON.stringify(updated));
    setEditingExpense(null);
  };

  const filteredExpenses = expenses.filter(
    (e) =>
      e.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="p-8 space-y-8 max-w-7xl mx-auto"
      onClick={() => setActiveMenu(null)}
    >
      <PageHeader
        title="Mis Gastos"
        description="Gestiona y escanea tus recibos fácilmente."
      >
        <button
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
        >
          <Receipt size={20} />
          Escanear Recibo
        </button>
      </PageHeader>

      <ExpenseFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <ExpenseTable
        expenses={filteredExpenses}
        activeMenu={activeMenu}
        onMenuToggle={(id, e) => {
          e.stopPropagation();
          setActiveMenu(activeMenu === id ? null : id);
        }}
        onEdit={setEditingExpense}
        onDelete={deleteExpense}
      />

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onUpdate={handleUpdateExpense}
          setEditingExpense={setEditingExpense}
        />
      )}

      {isScannerOpen && (
        <ScannerModal
          onClose={() => setIsScannerOpen(false)}
          onScanComplete={addExpense}
        />
      )}
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div>Cargando la gestión de gastos...</div>}>
      <ExpensesContent />
    </Suspense>
  );
}
