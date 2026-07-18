import { LogoIcon, PlusIcon } from "./Icons";

interface HeaderProps {
  onCreate: () => void;
}

export function Header({ onCreate }: HeaderProps) {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <LogoIcon className="size-7" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">SupportFlow</p>
            <p className="hidden text-xs text-slate-500 sm:block">Central de atendimento</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <PlusIcon className="size-5" />
          <span className="hidden sm:inline">Nova solicitação</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </div>
    </header>
  );
}
