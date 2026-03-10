"use client";

import { useState, useRef } from "react";
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Save,
  Receipt,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Componente OCRScanner: Gestiona el flujo completo de captura, subida y análisis de recibos.
 * Utiliza Cloudinary para almacenamiento y OpenAI Vision para extracción de datos.
 */

interface OCRScannerProps {
  onScanComplete: (data: {
    amount: number;
    date: string;
    merchant: string;
    category: string;
    imageUrl?: string;
    items?: Array<{ description: string; quantity: number; price: number }>;
  }) => void;
}

export function OCRScanner({ onScanComplete }: OCRScannerProps) {
  // --- Estados de flujo y UI ---
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "scanning" | "confirm">("upload");

  // --- Estado de datos extraídos (editable por el usuario) ---
  const [extractedData, setExtractedData] = useState({
    amount: 0,
    date: "",
    merchant: "",
    category: "Otros",
    raw_text: "",
    imageUrl: "",
    items: [] as Array<{
      description: string;
      quantity: number;
      price: number;
    }>,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Maneja la selección del archivo y dispara el preview y proceso.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      setStep("scanning");
      await processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Proceso centralizado:
   * 1. Sube a Cloudinary para persistencia.
   * 2. Envía URL a OpenAI para OCR.
   * 3. Muestra resultados al usuario.
   */
  const processImage = async (base64Image: string) => {
    setIsScanning(true);
    setError(null);
    setProgress(20);

    // Por defecto usamos la imagen base64 local para el OCR
    let imageSourceToUse = base64Image;
    let finalCloudinaryUrl = "";

    try {
      // 1. Paso: Intentar guardar imagen en la nube (Cloudinary)
      setProgress(30);
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageSourceToUse = url; // Si funciona, usamos la URL de la nube para el OCR
          finalCloudinaryUrl = url;
        } else {
          console.warn(
            "Cloudinary no configurado o falló. Usando modo local para OCR.",
          );
        }
      } catch {
        console.warn(
          "Fallo de red al subir a Cloudinary. Usando fallback local.",
        );
      }

      // 2. Paso: Procesar contenido con OpenAI Vision (GPT-4o Mini)
      setProgress(60);
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSourceToUse }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al conectar con OpenAI");
      }

      const result = await response.json();
      setProgress(100);

      // Sincronizamos datos con el estado de confirmación
      setExtractedData({
        amount: result.amount || 0,
        date: result.date || new Date().toLocaleDateString(),
        merchant: result.merchant || "Comercio Desconocido",
        category: result.category || "Otros",
        raw_text: result.raw_text || "",
        imageUrl: finalCloudinaryUrl, // Solo se guarda si Cloudinary funcionó
        items: result.items || [],
      });

      setStep("confirm");
      setIsScanning(false);
    } catch (err: any) {
      console.error("OCR Error:", err);
      setError(err.message || "No se pudo procesar la imagen.");
      setIsScanning(false);
      setProgress(0);
    }
  };

  const handleConfirm = () => {
    onScanComplete(extractedData);
  };

  return (
    <div className="space-y-6">
      {/* SECCIÓN DE CARGA Y ANÁLISIS */}
      {step === "upload" || step === "scanning" ? (
        <div
          className={cn(
            "relative border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[300px]",
            preview
              ? "border-primary/50 bg-primary/5"
              : "hover:border-primary/30 hover:bg-muted/50",
          )}
        >
          {preview ? (
            <div className="relative w-full max-w-sm aspect-video md:aspect-[3/4] max-h-[300px] rounded-xl overflow-hidden shadow-2xl bg-black/5 flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />

              {/* Overlay de Carga con IA */}
              {isScanning && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                  <BrainCircuit
                    size={48}
                    className="text-primary animate-pulse mb-4"
                  />
                  <p className="font-bold text-lg text-primary">
                    IA Analizando...
                  </p>
                  <div className="w-full bg-muted h-2 rounded-full mt-4 max-w-[200px] overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    Usando GPT-4o Mini
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Mensaje inicial cuando no hay foto
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Camera size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold tracking-tight">
                  Escáner Inteligente
                </p>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                  Sube una foto clara de tu ticket
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              >
                Seleccionar Ticket
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        // SECCIÓN DE CONFIRMACIÓN DETALLADA (Doble Columna)
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
          {/* Banner de Éxito */}
          <div className="bg-emerald-500/5 p-4 rounded-2xl flex items-center gap-3 border border-emerald-500/10">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-sm font-bold text-emerald-700">
              ¡Recibo procesado con éxito! Verifica los datos extraídos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- Columna Izquierda: Información Cruda y Desglose --- */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                <FileText size={16} />
                Texto Detectado por IA
              </h3>
              <div className="bg-muted/30 border border-border rounded-2xl p-6 font-mono text-xs leading-relaxed overflow-auto max-h-[350px] shadow-inner whitespace-pre-wrap">
                {extractedData.raw_text || "Extrayendo contenido detallado..."}
              </div>

              {/* Lista detallada de productos/items extraídos */}
              {extractedData.items.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    Artículos Detectados
                  </h4>
                  <div className="border border-border rounded-xl overflow-hidden bg-card/50">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-3 py-1.5 font-bold">Item</th>
                          <th className="px-3 py-1.5 font-bold text-center">
                            Cant
                          </th>
                          <th className="px-3 py-1.5 font-bold text-right">
                            Precio
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {extractedData.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-1.5">{item.description}</td>
                            <td className="px-3 py-1.5 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-1.5 text-right font-bold">
                              ${item.price.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* --- Columna Derecha: Formulario de Registro --- */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                <Receipt size={16} />
                Confirmar Gasto Principal
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Monto Total
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      value={extractedData.amount}
                      onChange={(e) =>
                        setExtractedData({
                          ...extractedData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full h-12 pl-8 pr-4 rounded-xl border border-border bg-background font-bold text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Descripción / Comercio
                  </label>
                  <input
                    type="text"
                    value={extractedData.merchant}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        merchant: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Categoría
                  </label>
                  <select
                    value={extractedData.category}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        category: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                  >
                    <option>Alimentación</option>
                    <option>Transporte</option>
                    <option>Entretenimiento</option>
                    <option>Servicios</option>
                    <option>Salud</option>
                    <option>Otros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    Fecha del Recibo
                  </label>
                  <input
                    type="text"
                    value={extractedData.date}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData,
                        date: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setStep("upload");
                    setPreview(null);
                  }}
                  className="flex-1 h-12 rounded-xl border border-border font-bold hover:bg-muted transition-all"
                >
                  Repetir Foto
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[2] h-12 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Guardar Gasto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANEJO DE ERRORES */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
