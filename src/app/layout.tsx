import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { AuthProvider } from "@/context/auth-context";

/**
 * Fuente principal de la aplicación: Inter de Google Fonts.
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Metadatos para SEO y configuración de la pestaña del navegador.
 */
export const metadata: Metadata = {
  title: "GastosApp - OCR Expense Tracker",
  description:
    "Gestiona tus gastos con facilidad usando inteligencia artificial y escaneo OCR.",
};

/**
 * RootLayout: El componente raíz que envuelve toda la aplicación.
 * Provee el contexto de autenticación y la estructura base del diseño (Sidebar + Main).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Proveedor de autenticación global */}
        <AuthProvider>
          {/* Wrapper que gestiona la visibilidad del Sidebar según la ruta */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
