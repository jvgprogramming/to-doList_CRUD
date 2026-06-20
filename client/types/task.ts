export interface Task {
  task_id: number;
  user_id: number;
  title: string;
  description: string | null;
  status_id: number;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface Status {
  status_id: number;
  status: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status_id: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface TaskFilters {
  search?: string;
  status_id?: number | string;
  page?: number;
  per_page?: number;
}
