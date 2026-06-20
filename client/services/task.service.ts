import axiosInstance from '@/lib/axios';
import { API_ROUTES } from '@/constants/routes';
import type { Task, TaskFilters, TaskFormData, TasksResponse, Status } from '@/types/task';

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
    const response = await axiosInstance.get<TasksResponse>(API_ROUTES.TASKS.BASE, {
      params: filters,
    });
    return response.data;
  },

  async getTask(id: number): Promise<{ task: Task }> {
    const response = await axiosInstance.get<{ task: Task }>(`${API_ROUTES.TASKS.BASE}/${id}`);
    return response.data;
  },

  async createTask(data: TaskFormData): Promise<{ message: string; task: Task }> {
    const response = await axiosInstance.post<{ message: string; task: Task }>(
      API_ROUTES.TASKS.BASE,
      data
    );
    return response.data;
  },

  async updateTask(
    id: number,
    data: Partial<TaskFormData>
  ): Promise<{ message: string; task: Task }> {
    const response = await axiosInstance.put<{ message: string; task: Task }>(
      `${API_ROUTES.TASKS.BASE}/${id}`,
      data
    );
    return response.data;
  },

  async deleteTask(id: number): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(
      `${API_ROUTES.TASKS.BASE}/${id}`
    );
    return response.data;
  },

  async getStatuses(): Promise<{ statuses: Status[] }> {
    const response = await axiosInstance.get<{ statuses: Status[] }>(API_ROUTES.TASKS.STATUSES);
    return response.data;
  },
};
