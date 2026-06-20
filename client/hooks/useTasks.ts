'use client';

import { useState, useCallback, useRef } from 'react';
import { taskService } from '@/services/task.service';
import type { Task, TaskFilters, TaskFormData, Status, Pagination } from '@/types/task';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({});
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchTasks = useCallback(async (overrideFilters?: TaskFilters) => {
    setIsLoading(true);
    try {
      const mergedFilters = overrideFilters ?? filtersRef.current;
      const response = await taskService.getTasks(mergedFilters);
      setTasks(response.tasks);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStatuses = useCallback(async () => {
    try {
      const response = await taskService.getStatuses();
      setStatuses(response.statuses);
    } catch {
      // Silently fail for statuses
    }
  }, []);

  const createTask = useCallback(
    async (data: TaskFormData) => {
      try {
        const response = await taskService.createTask(data);
        toast.success(response.message);
        await fetchTasks();
        return response.task;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          Object.values(error.response?.data?.errors || {}).flat()?.[0] ||
          'Failed to create task';
        toast.error(message);
        throw error;
      }
    },
    [fetchTasks]
  );

  const updateTask = useCallback(
    async (id: number, data: Partial<TaskFormData>) => {
      try {
        const response = await taskService.updateTask(id, data);
        toast.success(response.message);
        await fetchTasks();
        return response.task;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to update task';
        toast.error(message);
        throw error;
      }
    },
    [fetchTasks]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        const response = await taskService.deleteTask(id);
        toast.success(response.message);
        await fetchTasks();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete task');
        throw error;
      }
    },
    [fetchTasks]
  );

  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    tasks,
    statuses,
    pagination,
    isLoading,
    filters,
    fetchTasks,
    fetchStatuses,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
  };
}
