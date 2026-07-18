import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value?: number;
  icon: ReactNode;
  iconClassName: string;
}

export function StatCard({ label, value, icon, iconClassName }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {value === undefined ? (
            <div className="mt-3 h-9 w-12 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          )}
        </div>
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>
          {icon}
        </div>
      </div>
    </article>
  );
}
