import { Search, Calendar as CalendarIcon, Filter } from "lucide-react";

interface ExpenseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ExpenseFilters({
  searchTerm,
  onSearchChange,
}: ExpenseFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="relative flex-1 min-w-[300px]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por comercio o categoría..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted text-sm">
          <CalendarIcon size={18} />
          Este Mes
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted text-sm">
          <Filter size={18} />
          Filtros
        </button>
      </div>
    </div>
  );
}
