import {
  DashboardStats,
  RequestStatus,
  SupportRequest,
  SupportRequestInput,
} from "@/types/support-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5073/api";

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se o backend está em execução.");
  }

  if (!response.ok) {
    let message = "Não foi possível concluir a operação.";

    try {
      const error = (await response.json()) as { title?: string; detail?: string };
      message = error.detail ?? error.title ?? message;
    } catch {
      // Mantém a mensagem amigável quando a API não retorna JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const supportFlowApi = {
  getRequests(search = "", status: RequestStatus | "" = "") {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    const query = params.size ? `?${params.toString()}` : "";
    return apiRequest<SupportRequest[]>(`/requests${query}`);
  },

  getStats() {
    return apiRequest<DashboardStats>("/dashboard");
  },

  createRequest(input: SupportRequestInput) {
    return apiRequest<SupportRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateRequest(id: number, input: SupportRequestInput) {
    return apiRequest<SupportRequest>(`/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  deleteRequest(id: number) {
    return apiRequest<void>(`/requests/${id}`, { method: "DELETE" });
  },
};
