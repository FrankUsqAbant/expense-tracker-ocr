import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { User, Shield, Bell, Trash2, Save, DollarSign } from "lucide-react";

/**
 * SettingsPage: Pantalla de configuración del usuario y la aplicación.
 * Permite gestionar el perfil simulado y limpiar los datos de la demostración.
 */
export default function SettingsPage() {
  const { user } = useAuth();
  const [budget, setBudget] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar el presupuesto guardado al iniciar
  useEffect(() => {
    const savedBudget = localStorage.getItem("gastos-budget");
    if (savedBudget) {
      setBudget(parseFloat(savedBudget));
    }
  }, []);

  /**
   * Guarda la configuración en localStorage.
   */
  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem("gastos-budget", budget.toString());

    // Simulación de guardado con pequeño retraso para feedback visual
    setTimeout(() => {
      setIsSaving(false);
      alert("Configuración guardada correctamente");
    }, 500);
  };

  /**
   * Función para eliminar todos los datos locales y reiniciar la demo.
   */
  const handleClearData = () => {
    if (
      confirm(
        "¿Estás seguro? Esta acción borrará permanentemente todos tus gastos locales y reiniciará la aplicación.",
      )
    ) {
      localStorage.removeItem("gastos-data");
      localStorage.removeItem("gastos-budget");
      window.location.reload();
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto pb-20">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Configuración
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Personaliza tu experiencia y gestiona tus datos maestros.
        </p>
      </header>

      <div className="space-y-6">
        {/* SECCIÓN 1: Perfil de Usuario */}
        <section className="glass p-8 rounded-3xl space-y-6">
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
                defaultValue={user?.name || "Usuario Demo"}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                defaultValue={user?.email || "demo@ejemplo.com"}
                className="w-full h-12 px-4 rounded-xl border border-border bg-muted/30 text-muted-foreground font-medium text-sm cursor-not-allowed"
                disabled
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: Presupuesto y Finanzas */}
        <section className="glass p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="text-emerald-500" size={22} />
            Presupuesto Mensual
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-1">
                Límite de Gasto Mensual ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold text-lg transition-all"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground italic ml-1">
                Este valor se usará para calcular tus ahorros y mostrar alertas
                en los reportes.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: Preferencias de Sistema */}
        <section className="glass p-8 rounded-3xl space-y-6">
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
        </section>

        {/* SECCIÓN 4: Seguridad y Peligro */}
        <section className="glass p-8 rounded-3xl border border-destructive/10 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-destructive">
            <Shield size={22} />
            Zona de Seguridad
          </h2>
          <div className="p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
            <button
              onClick={handleClearData}
              className="flex items-center gap-3 text-destructive font-extrabold text-sm hover:underline tracking-tight"
            >
              <Trash2 size={20} />
              Reiniciar base de datos local
            </button>
            <p className="text-[10px] text-destructive/60 mt-2 font-medium">
              Esta acción no se puede deshacer. Se borrarán todos los registros
              de gastos actuales.
            </p>
          </div>
        </section>

        {/* Botón de Guardado Final */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-extrabold shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              "Guardando..."
            ) : (
              <>
                <Save size={22} /> Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
