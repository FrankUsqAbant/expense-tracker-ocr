"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

/**
 * LayoutWrapper: Componente envolvente que gestiona la disposición global.
 * Se encarga de alternar entre un diseño de pantalla completa (Login)
 * y un diseño con Sidebar (Dashboard, Gastos, etc.), ajustando el padding según corresponda.
 */
export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Solo renderizamos el Sidebar si NO estamos en login */}
      {!isLoginPage && <Sidebar />}

      {/* El contenido principal 'main' ajusta su margen izquierdo si el sidebar está presente */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          !isLoginPage ? "pl-64" : "pl-0",
        )}
      >
        {children}
      </main>
    </div>
  );
}
