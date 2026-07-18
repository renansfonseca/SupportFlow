"use client";

import { useEffect, useState } from "react";
import { SupportRequest } from "@/types/support-request";
import { AlertIcon, CloseIcon } from "./Icons";

interface ConfirmDialogProps {
  request: SupportRequest;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmDialog({ request, onClose, onConfirm }: ConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && !deleting && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [deleting, onClose]);

  async function handleConfirm() {
    setError("");
    setDeleting(true);
    try {
      await onConfirm();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Não foi possível excluir a solicitação.");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !deleting && onClose()}>
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><AlertIcon className="size-6" /></div>
          <button type="button" onClick={onClose} disabled={deleting} aria-label="Fechar" className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><CloseIcon className="size-5" /></button>
        </div>
        <h2 id="confirm-title" className="mt-4 text-lg font-bold text-slate-900">Excluir solicitação?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">A solicitação <strong className="font-semibold text-slate-700">“{request.title}”</strong> será removida permanentemente. Esta ação não pode ser desfeita.</p>
        {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={deleting} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
          <button type="button" onClick={handleConfirm} disabled={deleting} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">{deleting ? "Excluindo..." : "Sim, excluir"}</button>
        </div>
      </section>
    </div>
  );
}
