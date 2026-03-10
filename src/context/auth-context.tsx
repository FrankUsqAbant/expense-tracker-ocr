"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Estructura de los datos del usuario autenticado.
 */
interface User {
  email: string;
  name: string;
}

/**
 * Definición del tipo de contexto para la gestión de autenticación.
 */
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Creamos el contexto con un valor inicial indefinido.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider: Proveedor de contexto que maneja el estado global de la sesión.
 * Utiliza localStorage para que la sesión sea persistente entre recargas del navegador.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Efecto inicial: Busca si hay una sesión guardada al cargar la app.
  useEffect(() => {
    const savedUser = localStorage.getItem("gastos-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * Inicia sesión simulada guardando el email del usuario.
   */
  const login = (email: string) => {
    const newUser = { email, name: email.split("@")[0] };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("gastos-user", JSON.stringify(newUser));
    router.push("/dashboard");
  };

  /**
   * Cierra la sesión y limpia el almacenamiento local.
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("gastos-user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acceder fácilmente a la autenticación desde cualquier componente.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
