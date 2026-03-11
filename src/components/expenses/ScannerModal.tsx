import { X, Receipt } from "lucide-react";
import { OCRScanner } from "@/components/ocr-scanner";

interface ScannerModalProps {
  onClose: () => void;
  onScanComplete: (data: {
    amount: number;
    date: string;
    merchant: string;
    category: string;
    imageUrl?: string;
    items?: Array<{ description: string; quantity: number; price: number }>;
  }) => void;
}

export function ScannerModal({ onClose, onScanComplete }: ScannerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto">
        <div className="p-6 border-b flex justify-between items-center bg-muted/30">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Receipt className="text-primary" /> Nuevo Escaneo
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="p-8">
          <OCRScanner onScanComplete={onScanComplete} />
        </div>
      </div>
    </div>
  );
}
