"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckIcon, ClockIcon, InboxIcon } from "@/components/Icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FiltersBar } from "@/components/FiltersBar";
import { Header } from "@/components/Header";
import { RequestFormModal } from "@/components/RequestFormModal";
import { RequestList } from "@/components/RequestList";
import { StatCard } from "@/components/StatCard";
import { supportFlowApi } from "@/services/api";
import {
  DashboardStats,
  RequestStatus,
  SupportRequest,
  SupportRequestInput,
} from "@/types/support-request";

export default function Home() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequestStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<SupportRequest | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<SupportRequest | null>(null);
  const [notice, setNotice] = useState("");

  const loadRequests = useCallback(async (currentSearch: string, currentStatus: RequestStatus | "") => {
    setLoading(true);
    setError("");
    try {
      setRequests(await supportFlowApi.getRequests(currentSearch, currentStatus));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setStats(await supportFlowApi.getStats());
    } catch {
      setStats(undefined);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => loadRequests(search, status), 250);
    return () => window.clearTimeout(timer);
  }, [loadRequests, search, status]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function openCreate() {
    setEditingRequest(null);
    setFormOpen(true);
  }

  function openEdit(request: SupportRequest) {
    setEditingRequest(request);
    setFormOpen(true);
  }

  async function handleSave(input: SupportRequestInput) {
    if (editingRequest) {
      await supportFlowApi.updateRequest(editingRequest.id, input);
      setNotice("Solicitação atualizada com sucesso.");
    } else {
      await supportFlowApi.createRequest(input);
      setNotice("Solicitação criada com sucesso.");
    }

    setFormOpen(false);
    setEditingRequest(null);
    await Promise.all([loadRequests(search, status), loadStats()]);
  }

  async function handleDelete() {
    if (!deletingRequest) return;
    await supportFlowApi.deleteRequest(deletingRequest.id);
    setDeletingRequest(null);
    setNotice("Solicitação excluída com sucesso.");
    await Promise.all([loadRequests(search, status), loadStats()]);
  }

  return (
    <div className="min-h-screen">
      <Header onCreate={openCreate} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Visão geral</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Solicitações de atendimento</h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">Acompanhe, organize e resolva as solicitações da sua equipe.</p>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-3" aria-label="Resumo das solicitações">
          <StatCard label="Solicitações abertas" value={stats?.open} icon={<InboxIcon className="size-6" />} iconClassName="bg-blue-50 text-blue-600" />
          <StatCard label="Em andamento" value={stats?.inProgress} icon={<ClockIcon className="size-6" />} iconClassName="bg-amber-50 text-amber-600" />
          <StatCard label="Concluídas" value={stats?.completed} icon={<CheckIcon className="size-6" />} iconClassName="bg-emerald-50 text-emerald-600" />
        </section>

        <section className="mt-9" aria-labelledby="request-list-title">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="request-list-title" className="text-lg font-bold text-slate-900">Todas as solicitações</h2>
              <p className="mt-1 text-sm text-slate-500">{loading ? "Atualizando lista..." : `${requests.length} ${requests.length === 1 ? "resultado" : "resultados"}`}</p>
            </div>
            <div className="w-full lg:max-w-xl"><FiltersBar search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} /></div>
          </div>

          {error ? (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white px-6 py-10 text-center shadow-sm" role="alert">
              <p className="font-semibold text-slate-800">Não foi possível carregar os dados</p>
              <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">{error}</p>
              <button type="button" onClick={() => loadRequests(search, status)} className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Tentar novamente</button>
            </div>
          ) : (
            <RequestList requests={requests} loading={loading} onEdit={openEdit} onDelete={setDeletingRequest} />
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-7xl border-t border-slate-200/70 px-4 py-6 text-center text-xs text-slate-400 sm:px-6 lg:px-8">SupportFlow · Atendimento simples, do início ao fim.</footer>

      {formOpen && <RequestFormModal request={editingRequest} onClose={() => { setFormOpen(false); setEditingRequest(null); }} onSubmit={handleSave} />}
      {deletingRequest && <ConfirmDialog request={deletingRequest} onClose={() => setDeletingRequest(null)} onConfirm={handleDelete} />}

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl" role="status">{notice}</div>
      )}
    </div>
  );
}
