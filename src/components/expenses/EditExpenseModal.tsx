import { X, Save } from "lucide-react";

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

interface EditExpenseModalProps {
  expense: Expense;
  onClose: () => void;
  onUpdate: () => void;
  setEditingExpense: (expense: Expense | null) => void;
}

export function EditExpenseModal({
  expense,
  onClose,
  onUpdate,
  setEditingExpense,
}: EditExpenseModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-8 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold">Editar Detalle</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        {expense.imageUrl && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase opacity-50">
              Recibo en Cloudinary
            </span>
            <a
              href={expense.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-32 rounded-lg overflow-hidden border"
            >
              <img
                src={expense.imageUrl}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
                alt="Receipt"
              />
            </a>
          </div>
        )}
        <div className="space-y-4">
          <input
            value={expense.merchant}
            onChange={(e) =>
              setEditingExpense({ ...expense, merchant: e.target.value })
            }
            className="w-full p-3 bg-muted rounded-xl outline-none"
            placeholder="Comercio"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={expense.amount}
              onChange={(e) =>
                setEditingExpense({
                  ...expense,
                  amount: parseFloat(e.target.value) || 0,
                })
              }
              className="p-3 bg-muted rounded-xl outline-none font-bold"
            />
            <input
              value={expense.date}
              onChange={(e) =>
                setEditingExpense({ ...expense, date: e.target.value })
              }
              className="p-3 bg-muted rounded-xl outline-none"
            />
          </div>
          <button
            onClick={onUpdate}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Save /> Actualizar Gasto
          </button>
        </div>
      </div>
    </div>
  );
}
