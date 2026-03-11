import { Shield, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";

interface SecuritySectionProps {
  onClearData: () => void;
}

export function SecuritySection({ onClearData }: SecuritySectionProps) {
  return (
    <Card className="border-destructive/10 space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-destructive">
        <Shield size={22} />
        Zona de Seguridad
      </h2>
      <div className="p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
        <button
          onClick={onClearData}
          className="flex items-center gap-3 text-destructive font-extrabold text-sm hover:underline tracking-tight"
        >
          <Trash2 size={20} />
          Reiniciar base de datos local
        </button>
        <p className="text-[10px] text-destructive/60 mt-2 font-medium">
          Esta acción no se puede deshacer. Se borrarán todos los registros de
          gastos actuales.
        </p>
      </div>
    </Card>
  );
}
