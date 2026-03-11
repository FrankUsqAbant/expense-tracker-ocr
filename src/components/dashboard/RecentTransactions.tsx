import { Receipt } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/Card";

interface Expense {
  amount: number;
  merchant: string;
  category: string;
  date: string;
}

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transacciones Recientes</h2>
        <Link
          href="/expenses"
          className="text-primary font-semibold hover:underline text-sm"
        >
          Ver todas
        </Link>
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="p-6 space-y-4">
          {expenses.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Receipt className="mx-auto opacity-20 mb-3" size={48} />
              <p>No hay transacciones aún registradas.</p>
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
      </Card>
    </div>
  );
}
