'use client';

import { useEffect, useRef } from 'react';
import { ListTodo, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tasks, isLoading: tasksLoading, fetchTasks, fetchStatuses } = useTasks();
  const router = useRouter();
  const hasInitialized = useRef(false);

  // Initial data fetch
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchStatuses();
      fetchTasks({ per_page: 50 }); // Fetch more for dashboard stats
    }
  }, [authLoading, isAuthenticated, fetchTasks, fetchStatuses]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status?.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status?.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status?.status === 'Completed').length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-950',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  {tasksLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Profile & Recent Tasks */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {user?.full_name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{user?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="pt-2 text-sm text-muted-foreground">
                Member since{' '}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })
                  : 'N/A'}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentTasks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <ListTodo className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No tasks yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div
                      key={task.task_id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(task.created_at)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          task.status?.status === 'Pending'
                            ? 'pending'
                            : task.status?.status === 'In Progress'
                            ? 'in_progress'
                            : 'completed'
                        }
                      >
                        {task.status?.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
