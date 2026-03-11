import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2 text-lg">{description}</p>
        )}
      </div>
      {children}
    </header>
  );
}
