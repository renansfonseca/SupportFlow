import { RequestStatus } from "@/types/support-request";
import { ChevronIcon, SearchIcon } from "./Icons";

interface FiltersBarProps {
  search: string;
  status: RequestStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: RequestStatus | "") => void;
}

export function FiltersBar({ search, status, onSearchChange, onStatusChange }: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative block flex-1">
        <span className="sr-only">Buscar pelo título</span>
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar pelo título..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
      </label>

      <label className="relative block sm:w-52">
        <span className="sr-only">Filtrar por status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as RequestStatus | "")}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        >
          <option value="">Todos os status</option>
          <option value="Open">Aberta</option>
          <option value="InProgress">Em andamento</option>
          <option value="Completed">Concluída</option>
        </select>
        <ChevronIcon className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
      </label>
    </div>
  );
}
