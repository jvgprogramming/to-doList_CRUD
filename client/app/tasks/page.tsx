'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskTable } from '@/components/tasks/TaskTable';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    tasks,
    statuses,
    isLoading: tasksLoading,
    filters,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
    fetchTasks,
    fetchStatuses,
  } = useTasks();
  const router = useRouter();
  const hasInitialized = useRef(false);

  // Initial data fetch
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchStatuses();
      fetchTasks();
    }
  }, [authLoading, isAuthenticated, fetchTasks, fetchStatuses]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Debounced search/filter
  useEffect(() => {
    if (!hasInitialized.current) return;
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search, filters.status_id, fetchTasks]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize your tasks
          </p>
        </div>

        <TaskTable
          tasks={tasks}
          statuses={statuses}
          isLoading={tasksLoading}
          searchQuery={filters.search || ''}
          statusFilter={filters.status_id ? String(filters.status_id) : 'all'}
          onSearchChange={(value) => updateFilters({ search: value, page: 1 })}
          onStatusFilterChange={(value) =>
            updateFilters({
              status_id: value === 'all' ? undefined : Number(value),
              page: 1,
            })
          }
          onTaskCreated={createTask}
          onTaskUpdated={updateTask}
          onTaskDeleted={deleteTask}
        />
      </div>
    </DashboardLayout>
  );
}
