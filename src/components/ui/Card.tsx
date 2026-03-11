import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass p-6 rounded-3xl shadow-lg border border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
