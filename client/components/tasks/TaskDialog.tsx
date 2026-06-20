'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Status, Task } from '@/types/task';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(5000, 'Description is too long').optional().or(z.literal('')),
  status_id: z.string().min(1, 'Status is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; status_id: number }) => Promise<any>;
  statuses: Status[];
  mode: 'create' | 'edit';
  task?: Task;
}

export function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  statuses,
  mode,
  task,
}: TaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status_id: '',
    },
  });

  const selectedStatusId = watch('status_id');

  // Reset form when dialog opens/closes or task changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && task) {
        reset({
          title: task.title,
          description: task.description || '',
          status_id: String(task.status_id),
        });
      } else {
        reset({
          title: '',
          description: '',
          status_id: statuses[0] ? String(statuses[0].status_id) : '',
        });
      }
    }
  }, [open, mode, task, reset, statuses]);

  const onFormSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: data.title,
        description: data.description || '',
        status_id: Number(data.status_id),
      });
      onOpenChange(false);
    } catch {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Task' : 'Edit Task'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new task to track your progress.'
              : 'Update the task details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional)"
              className={errors.description ? 'border-destructive' : ''}
              {...register('description')}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status_id">Status</Label>
            <Select
              value={selectedStatusId}
              onValueChange={(value) => setValue('status_id', value, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.status_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.status_id} value={String(status.status_id)}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status_id && (
              <p className="text-sm text-destructive">{errors.status_id.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Saving...'}
                </>
              ) : mode === 'create' ? (
                'Create Task'
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
