"use client";

import { FormEvent, useEffect, useState } from "react";
import { SupportRequest, SupportRequestInput } from "@/types/support-request";
import { CloseIcon } from "./Icons";

interface RequestFormModalProps {
  request: SupportRequest | null;
  onClose: () => void;
  onSubmit: (input: SupportRequestInput) => Promise<void>;
}

const emptyForm: SupportRequestInput = {
  title: "",
  description: "",
  status: "Open",
  priority: "Medium",
};

export function RequestFormModal({ request, onClose, onSubmit }: RequestFormModalProps) {
  const [form, setForm] = useState<SupportRequestInput>(request ? {
    title: request.title,
    description: request.description,
    status: request.status,
    priority: request.priority,
  } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose, saving]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível salvar a solicitação.");
      setSaving(false);
    }
  }

  const fieldClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="max-h-[95vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="request-form-title">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 id="request-form-title" className="text-lg font-bold text-slate-900">{request ? "Editar solicitação" : "Nova solicitação"}</h2>
            <p className="mt-1 text-sm text-slate-500">{request ? "Atualize os dados do atendimento." : "Preencha os dados para abrir um atendimento."}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Fechar" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50">
            <CloseIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
          <label className="block text-sm font-semibold text-slate-700">
            Título
            <input autoFocus required maxLength={120} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: Erro ao acessar o sistema" className={fieldClass} />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Descrição
            <textarea required maxLength={1000} rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descreva o que aconteceu e o resultado esperado..." className={`${fieldClass} resize-none`} />
            <span className="mt-1 block text-right text-xs font-normal text-slate-400">{form.description.length}/1000</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as SupportRequestInput["status"] })} className={fieldClass}>
                <option value="Open">Aberta</option>
                <option value="InProgress">Em andamento</option>
                <option value="Completed">Concluída</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Prioridade
              <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as SupportRequestInput["priority"] })} className={fieldClass}>
                <option value="Low">Baixa</option>
                <option value="Medium">Média</option>
                <option value="High">Alta</option>
              </select>
            </label>
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={saving} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={saving || !form.title.trim() || !form.description.trim()} className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Salvando..." : request ? "Salvar alterações" : "Criar solicitação"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
