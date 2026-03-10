"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * HomePage: Página de entrada principal (/).
 * Su función principal es actuar como un "router inteligente" que redirige al usuario
 * según su estado de autenticación (Login o Dashboard).
 */
export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario no está autenticado, lo enviamos al login.
    // Si ya inició sesión, lo llevamos directamente al panel de control.
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Esta página no renderiza contenido visual, solo gestiona la redirección.
  return null;
}
