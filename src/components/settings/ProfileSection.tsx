import { User } from "lucide-react";
import { Card } from "../ui/Card";

interface ProfileSectionProps {
  userName?: string;
  userEmail?: string;
}

export function ProfileSection({ userName, userEmail }: ProfileSectionProps) {
  return (
    <Card className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <User className="text-primary" size={22} />
        Perfil Personal
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">
            Nombre Público
          </label>
          <input
            type="text"
            defaultValue={userName || "Usuario Demo"}
            className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            defaultValue={userEmail || "demo@ejemplo.com"}
            className="w-full h-12 px-4 rounded-xl border border-border bg-muted/30 text-muted-foreground font-medium text-sm cursor-not-allowed"
            disabled
          />
        </div>
      </div>
    </Card>
  );
}
