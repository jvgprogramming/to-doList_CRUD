'use client';

import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TaskDeleteDialog } from '@/components/tasks/TaskDeleteDialog';
import type { Task, Status } from '@/types/task';
import { formatDate } from '@/lib/utils';

interface TaskTableProps {
  tasks: Task[];
  statuses: Status[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onTaskCreated: (data: { title: string; description: string; status_id: number }) => Promise<any>;
  onTaskUpdated: (id: number, data: { title: string; description: string; status_id: number }) => Promise<any>;
  onTaskDeleted: (id: number) => Promise<void>;
}

export function TaskTable({
  tasks,
  statuses,
  isLoading,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
}: TaskTableProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const getBadgeVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'pending':
        return 'pending' as const;
      case 'in progress':
        return 'in_progress' as const;
      case 'completed':
        return 'completed' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.status_id} value={String(status.status_id)}>
                  {status.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No tasks found</p>
            <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)}>
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground hidden sm:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground hidden md:table-cell">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.task_id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{task.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">
                      {task.description || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getBadgeVariant(task.status?.status || '')}>
                        {task.status?.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {formatDate(task.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditTask(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTask(task)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <TaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={onTaskCreated}
        statuses={statuses}
        mode="create"
      />
      <TaskDialog
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        onSubmit={(data) => editTask ? onTaskUpdated(editTask.task_id, data) : Promise.resolve()}
        statuses={statuses}
        mode="edit"
        task={editTask || undefined}
      />
      <TaskDeleteDialog
        open={!!deleteTask}
        onOpenChange={(open) => !open && setDeleteTask(null)}
        onConfirm={() => deleteTask ? onTaskDeleted(deleteTask.task_id) : Promise.resolve()}
        taskTitle={deleteTask?.title || ''}
      />
    </div>
  );
}
