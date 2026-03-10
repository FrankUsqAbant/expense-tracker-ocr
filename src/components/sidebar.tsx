"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  LogOut,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

/**
 * Elementos de navegación principal de la barra lateral.
 */
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Receipt, label: "Mis Gastos", href: "/expenses" },
  { icon: PieChart, label: "Reportes", href: "/reports" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

/**
 * Sidebar: Componente de navegación lateral.
 * Se oculta automáticamente en la página de login.
 * Gestiona el cierre de sesión y la visualización de rutas activas.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  // No mostramos el sidebar si el usuario está en la pantalla de login.
  if (pathname === "/login") return null;

  return (
    <div className="flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0">
      {/* Logo y Nombre de la App */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
          <Wallet size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">GastosApp</span>
      </div>

      {/* Navegación de Menú */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group hover:bg-muted font-medium",
              pathname === item.href
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground",
            )}
          >
            <item.icon
              size={20}
              className={cn(
                "transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "group-hover:text-primary",
              )}
            />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Sección Inferior: Cerrar Sesión */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all font-semibold"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
