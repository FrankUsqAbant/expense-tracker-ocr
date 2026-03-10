"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OCRScanner } from "@/components/ocr-scanner";
import {
  Receipt,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Tag,
  MoreVertical,
  ArrowRight,
  X,
  Trash2,
  Edit,
  Save,
  FileText,
} from "lucide-react";

/**
 * Interface Expense: Estructura de datos principal para los gastos.
 */
interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  merchant: string;
  status: "pending" | "completed";
  imageUrl?: string; // URL persistente de Cloudinary
  items?: Array<{ description: string; quantity: number; price: number }>; // Desglose de artículos
}

/**
 * Componente Principal de la Página de Gastos.
 * Maneja la lista de gastos, búsqueda, edición y el escáner OCR.
 */
function ExpensesContent() {
  // --- Estados Principales ---
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // Menú de tres puntos (Editar/Borrar)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null); // Estado para el modal de edición
  const searchParams = useSearchParams();

  /**
   * Carga de datos inicial desde localStorage.
   */
  useEffect(() => {
    const saved = localStorage.getItem("gastos-data");
    if (saved) setExpenses(JSON.parse(saved));

    // Si viene de una redirección con parámetro, abrimos el escáner automáticamente
    if (searchParams.get("openScanner") === "true") {
      setIsScannerOpen(true);
    }
  }, [searchParams]);

  /**
   * Añade un nuevo gasto a la lista y persiste en local.
   */
  const addExpense = (data: {
    amount: number;
    date: string;
    merchant: string;
    category: string;
    imageUrl?: string;
    items?: Array<{ description: string; quantity: number; price: number }>;
  }) => {
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

  /**
   * Elimina un gasto tras confirmación.
   */
  const deleteExpense = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este gasto?")) {
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      localStorage.setItem("gastos-data", JSON.stringify(updated));
    }
    setActiveMenu(null);
  };

  /**
   * Guarda los cambios de un gasto editado.
   */
  const handleUpdateExpense = () => {
    if (!editingExpense) return;
    const updated = expenses.map((e) =>
      e.id === editingExpense.id ? editingExpense : e,
    );
    setExpenses(updated);
    localStorage.setItem("gastos-data", JSON.stringify(updated));
    setEditingExpense(null);
  };

  return (
    <div
      className="p-8 space-y-8 max-w-7xl mx-auto"
      onClick={() => setActiveMenu(null)}
    >
      {/* HEADER: Título y Botón Principal */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Mis Gastos</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gestiona y escanea tus recibos fácilmente.
          </p>
        </div>
        <button
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
        >
          <Receipt size={20} />
          Escanear Recibo
        </button>
      </header>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por comercio o categoría..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted text-sm">
            <CalendarIcon size={18} />
            Este Mes
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted text-sm">
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {/* TABLA DE GASTOS */}
      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-sm">Comercio</th>
                <th className="px-6 py-4 font-bold text-sm">Fecha</th>
                <th className="px-6 py-4 font-bold text-sm">Categoría</th>
                <th className="px-6 py-4 font-bold text-sm text-right">
                  Monto
                </th>
                <th className="px-6 py-4 font-bold text-sm"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground text-lg"
                  >
                    Aún no hay gastos. ¡Escanea un ticket!
                  </td>
                </tr>
              ) : (
                expenses
                  .filter(
                    (e) =>
                      e.merchant
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      e.category
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Miniatura de Cloudinary o Letra Inicial */}
                          {expense.imageUrl ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
                              <img
                                src={expense.imageUrl}
                                className="w-full h-full object-cover"
                                alt="Ticket"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                              {expense.merchant[0]}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">
                              {expense.merchant}
                            </span>
                            {expense.items && expense.items.length > 0 && (
                              <span className="text-[10px] text-primary flex items-center gap-0.5">
                                <FileText size={10} /> {expense.items.length}{" "}
                                artículos
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {expense.date}
                      </td>
                      <td className="px-6 py-4 lowercase italic text-[11px]">
                        <span className="bg-accent/10 px-2 py-1 rounded-md">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-primary">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        {/* Menú de Acciones */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(
                              activeMenu === expense.id ? null : expense.id,
                            );
                          }}
                          className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {activeMenu === expense.id && (
                          <div className="absolute right-6 top-10 z-10 w-32 bg-card border border-border shadow-xl rounded-lg">
                            <button
                              onClick={() => setEditingExpense(expense)}
                              className="w-full text-left px-4 py-2 hover:bg-muted flex gap-2 items-center text-xs font-bold"
                            >
                              <Edit size={14} /> Editar
                            </button>
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive flex gap-2 items-center text-xs font-bold"
                            >
                              <Trash2 size={14} /> Borrar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {editingExpense && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-8 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Editar Detalle</h2>
              <button onClick={() => setEditingExpense(null)}>
                <X />
              </button>
            </div>
            {/* Visualización del Recibo Guardado */}
            {editingExpense.imageUrl && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase opacity-50">
                  Recibo en Cloudinary
                </span>
                <a
                  href={editingExpense.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-32 rounded-lg overflow-hidden border"
                >
                  <img
                    src={editingExpense.imageUrl}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </a>
              </div>
            )}
            {/* Formulario de Edición */}
            <div className="space-y-4">
              <input
                value={editingExpense.merchant}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    merchant: e.target.value,
                  })
                }
                className="w-full p-3 bg-muted rounded-xl outline-none"
                placeholder="Comercio"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="p-3 bg-muted rounded-xl outline-none font-bold"
                />
                <input
                  value={editingExpense.date}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      date: e.target.value,
                    })
                  }
                  className="p-3 bg-muted rounded-xl outline-none"
                />
              </div>
              <button
                onClick={handleUpdateExpense}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Save /> Actualizar Gasto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DEL ESCÁNER OCR */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Receipt className="text-primary" /> Nuevo Escaneo
              </h2>
              <button onClick={() => setIsScannerOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <OCRScanner onScanComplete={addExpense} />
            </div>
          </div>
        </div>
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
