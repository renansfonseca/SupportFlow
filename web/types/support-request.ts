export type RequestStatus = "Open" | "InProgress" | "Completed";
export type RequestPriority = "Low" | "Medium" | "High";

export interface SupportRequest {
  id: number;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  createdAt: string;
}

export interface SupportRequestInput {
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
}

export interface DashboardStats {
  open: number;
  inProgress: number;
  completed: number;
}
