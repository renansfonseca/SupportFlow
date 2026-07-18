import { RequestPriority, RequestStatus, SupportRequest } from "@/types/support-request";
import { EditIcon, InboxIcon, TrashIcon } from "./Icons";

interface RequestListProps {
  requests: SupportRequest[];
  loading: boolean;
  onEdit: (request: SupportRequest) => void;
  onDelete: (request: SupportRequest) => void;
}

const statusStyles: Record<RequestStatus, string> = {
  Open: "bg-blue-50 text-blue-700 ring-blue-600/10",
  InProgress: "bg-amber-50 text-amber-700 ring-amber-600/10",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
};

const statusLabels: Record<RequestStatus, string> = {
  Open: "Aberta",
  InProgress: "Em andamento",
  Completed: "Concluída",
};

const priorityStyles: Record<RequestPriority, string> = {
  Low: "text-slate-600",
  Medium: "text-orange-600",
  High: "text-rose-600",
};

const priorityLabels: Record<RequestPriority, string> = {
  Low: "Baixa",
  Medium: "Média",
  High: "Alta",
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function Priority({ priority }: { priority: RequestPriority }) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-semibold ${priorityStyles[priority]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {priorityLabels[priority]}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function Actions({ request, onEdit, onDelete }: Omit<RequestListProps, "requests" | "loading"> & { request: SupportRequest }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(request)}
        aria-label={`Editar ${request.title}`}
        title="Editar"
        className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        <EditIcon className="size-4.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(request)}
        aria-label={`Excluir ${request.title}`}
        title="Excluir"
        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
      >
        <TrashIcon className="size-4.5" />
      </button>
    </div>
  );
}

function LoadingRows() {
  return (
    <>
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className="grid grid-cols-[80px_1fr_130px_100px_110px_72px] items-center gap-4 border-t border-slate-100 px-5 py-5 lg:px-6">
          {["w-10", "w-3/4", "w-24", "w-16", "w-20", "w-14"].map((width, index) => (
            <div key={index} className={`h-4 animate-pulse rounded bg-slate-100 ${width}`} />
          ))}
        </div>
      ))}
    </>
  );
}

export function RequestList({ requests, loading, onEdit, onDelete }: RequestListProps) {
  if (loading) {
    return (
      <>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm md:block">
          <div className="grid grid-cols-[80px_1fr_130px_100px_110px_72px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:px-6">
            <span>ID</span><span>Solicitação</span><span>Status</span><span>Prioridade</span><span>Criada em</span><span />
          </div>
          <LoadingRows />
        </div>
        <div className="space-y-3 md:hidden">
          {[1, 2, 3].map((card) => (
            <div key={card} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-100" />
              <div className="mt-5 h-7 w-24 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <InboxIcon className="size-7" />
        </div>
        <h3 className="mt-4 font-semibold text-slate-800">Nenhuma solicitação encontrada</h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Tente ajustar a busca ou o filtro para encontrar o que procura.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm md:block">
        <div className="grid grid-cols-[80px_1fr_130px_100px_110px_72px] gap-4 bg-slate-50/70 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:px-6">
          <span>ID</span><span>Solicitação</span><span>Status</span><span>Prioridade</span><span>Criada em</span><span />
        </div>
        {requests.map((request) => (
          <div key={request.id} className="grid grid-cols-[80px_1fr_130px_100px_110px_72px] items-center gap-4 border-t border-slate-100 px-5 py-4 transition hover:bg-slate-50/60 lg:px-6">
            <span className="text-sm font-medium text-slate-400">#{String(request.id).padStart(3, "0")}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{request.title}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{request.description}</p>
            </div>
            <StatusBadge status={request.status} />
            <Priority priority={request.priority} />
            <time className="text-sm text-slate-500" dateTime={request.createdAt}>{formatDate(request.createdAt)}</time>
            <Actions request={request} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        {requests.map((request) => (
          <article key={request.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-semibold text-slate-400">#{String(request.id).padStart(3, "0")}</span>
              <Actions request={request} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <h3 className="mt-1 font-semibold text-slate-800">{request.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{request.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
              <StatusBadge status={request.status} />
              <Priority priority={request.priority} />
              <time className="ml-auto text-xs text-slate-400" dateTime={request.createdAt}>{formatDate(request.createdAt)}</time>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
