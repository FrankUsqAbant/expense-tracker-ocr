import { MoreVertical, Edit, Trash2, FileText } from "lucide-react";
import { Card } from "../ui/Card";

interface ExpenseItem {
  description: string;
  quantity: number;
  price: number;
}

interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  merchant: string;
  imageUrl?: string;
  items?: ExpenseItem[];
}

interface ExpenseTableProps {
  expenses: Expense[];
  activeMenu: string | null;
  onMenuToggle: (id: string, e: React.MouseEvent) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseTable({
  expenses,
  activeMenu,
  onMenuToggle,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  return (
    <Card className="p-0 overflow-hidden border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-bold text-sm">Comercio</th>
              <th className="px-6 py-4 font-bold text-sm">Fecha</th>
              <th className="px-6 py-4 font-bold text-sm">Categoría</th>
              <th className="px-6 py-4 font-bold text-sm text-right">Monto</th>
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
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
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
                    <button
                      onClick={(e) => onMenuToggle(expense.id, e)}
                      className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenu === expense.id && (
                      <div className="absolute right-6 top-10 z-10 w-32 bg-card border border-border shadow-xl rounded-lg">
                        <button
                          onClick={() => onEdit(expense)}
                          className="w-full text-left px-4 py-2 hover:bg-muted flex gap-2 items-center text-xs font-bold"
                        >
                          <Edit size={14} /> Editar
                        </button>
                        <button
                          onClick={() => onDelete(expense.id)}
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
    </Card>
  );
}
