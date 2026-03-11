"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { BudgetSection } from "@/components/settings/BudgetSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { SecuritySection } from "@/components/settings/SecuritySection";

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
      <PageHeader
        title="Configuración"
        description="Personaliza tu experiencia y gestiona tus datos maestros."
      />

      <div className="space-y-6">
        <ProfileSection userName={user?.name} userEmail={user?.email} />

        <BudgetSection budget={budget} onBudgetChange={setBudget} />

        <PreferencesSection />

        <SecuritySection onClearData={handleClearData} />

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
