"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Wallet, Mail, Lock, ArrowRight } from "lucide-react";

/**
 * LoginPage: Pantalla de inicio de sesión y registro.
 * En esta versión de demostración, la autenticación es simulada y se guarda en localStorage.
 */
export default function LoginPage() {
  // Manejamos si el usuario está intentando iniciar sesión o registrarse
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuth();

  /**
   * Procesa el envío del formulario.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Contenedor central con efecto cristal (glassmorphism) */}
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-3xl animate-in fade-in zoom-in duration-500 shadow-2xl">
        {/* Cabecera del Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 mb-4 animate-bounce">
            <Wallet size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isLogin ? "¡Hola de nuevo!" : "Únete a GastosApp"}
          </h1>
          <p className="text-muted-foreground font-medium">
            {isLogin
              ? "Ingresa tus datos para acceder a tu panel"
              : "La forma más rápida de escanear y organizar tus tickets"}
          </p>
        </div>

        {/* Formulario de Acceso */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                className="flex h-12 w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all font-semibold"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="flex h-12 w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all font-semibold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                className="flex h-12 w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all"
                disabled // Deshabilitado para la demo interactiva
              />
            </div>
          </div>

          {/* Botón de envío con efecto hover premium */}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl text-sm font-extrabold transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 w-full shadow-lg shadow-primary/25 active:scale-95 group"
          >
            {isLogin ? "Iniciar Sesión" : "Crear mi Cuenta"}
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        {/* Footer del Formulario */}
        <div className="text-center space-y-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "¿Eres nuevo aquí?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-extrabold hover:underline"
            >
              {isLogin ? "Regístrate gratis" : "Entra a tu cuenta"}
            </button>
          </p>

          {/* Aviso de Modo Demo */}
          <div className="text-[10px] text-muted-foreground/60 flex flex-col gap-1 italic">
            <p>Modo de Demostración Activo:</p>
            <p className="font-bold text-primary/70 uppercase tracking-tighter">
              Aceptamos cualquier credencial localmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
