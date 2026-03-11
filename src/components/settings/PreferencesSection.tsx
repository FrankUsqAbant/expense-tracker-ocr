import { Bell } from "lucide-react";
import { Card } from "../ui/Card";

export function PreferencesSection() {
  return (
    <Card className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Bell className="text-accent" size={22} />
        Alertas y Notificaciones
      </h2>
      <div className="divide-y divide-border">
        <div className="flex items-center justify-between py-4 group">
          <div>
            <p className="font-bold text-sm">Alertas de Presupuesto</p>
            <p className="text-xs text-muted-foreground italic">
              Recibe un aviso visual al alcanzar el 80% de tus límites.
            </p>
          </div>
          <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
          </div>
        </div>
        <div className="flex items-center justify-between py-4 group">
          <div>
            <p className="font-bold text-sm">Sincronización Cloudinary</p>
            <p className="text-xs text-muted-foreground italic">
              Permitir el guardado automático de imágenes en la nube.
            </p>
          </div>
          <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
          </div>
        </div>
      </div>
    </Card>
  );
}
