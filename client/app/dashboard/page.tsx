'use client';

import { useEffect, useRef } from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Calendar,
  ArrowUpRight,
  Activity,
  BarChart3,
  PieChart,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { cn, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tasks, isLoading: tasksLoading, fetchTasks, fetchStatuses } = useTasks();
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchStatuses();
      fetchTasks({ per_page: 50 });
    }
  }, [authLoading, isAuthenticated, fetchTasks, fetchStatuses]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/30" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status?.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status?.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status?.status === 'Completed').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      trend: '+12%',
      trendUp: true,
      glowClass: 'glow-border-indigo',
      iconBg: 'from-indigo-500/20 to-indigo-600/10',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      trend: '+8%',
      trendUp: true,
      glowClass: 'glow-border-cyan',
      iconBg: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      trend: '+24%',
      trendUp: true,
      glowClass: 'glow-border-green',
      iconBg: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: AlertCircle,
      trend: '-5%',
      trendUp: false,
      glowClass: 'glow-border-yellow',
      iconBg: 'from-yellow-500/20 to-yellow-600/10',
      iconColor: 'text-yellow-400',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl glass p-6 lg:p-8">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/8 blur-[60px]" />

          <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span className="text-xs font-medium text-green-400/80 tracking-wide uppercase">Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
                <span className="text-gradient-primary">{user?.full_name?.split(' ')[0] || 'User'}</span>
              </h1>
              <p className="text-sm text-white/40 max-w-xl">
                Here&apos;s your productivity overview. You&apos;re making great progress — keep the momentum going.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white/5 border border-white/10 px-2.5 sm:px-3.5 py-1.5 sm:py-2 min-w-0">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 shrink-0" />
                <span className="text-[11px] sm:text-xs text-white/60 truncate">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex -space-x-1.5 sm:-space-x-2 shrink-0">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 ring-1 ring-white/10"
                  />
                ))}
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-white/5 text-[8px] sm:text-[10px] font-medium text-white/40 ring-1 ring-white/10">
                  +3
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Tasks this week', value: totalTasks, color: 'text-indigo-400' },
              { label: 'Completion rate', value: `${completionRate}%`, color: 'text-green-400' },
              { label: 'Avg. completion', value: '2.4 days', color: 'text-cyan-400' },
              { label: 'Productivity', value: '+18%', color: 'text-purple-400' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3"
              >
                <p className="text-xs text-white/30">{stat.label}</p>
                <p className={cn('text-lg font-semibold mt-0.5', stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={cn(
                  'relative group rounded-2xl glass p-5 transition-all duration-300',
                  'hover:bg-white/[0.06] hover:border-white/[0.12]',
                  stat.glowClass
                )}
              >
                {/* Animated shimmer on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />

                <div className="relative flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-white/40 tracking-wide uppercase">
                      {stat.title}
                    </p>
                    {tasksLoading ? (
                      <Skeleton className="h-9 w-16 bg-white/5" />
                    ) : (
                      <p className="stat-value">{stat.value}</p>
                    )}
                  </div>
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br border border-white/5',
                      stat.iconBg
                    )}
                  >
                    <Icon className={cn('h-5 w-5', stat.iconColor)} />
                  </div>
                </div>

                <div className="relative mt-3 flex items-center gap-1.5">
                  {stat.trendUp ? (
                    <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-yellow-400" />
                  )}
                  <span
                    className={cn(
                      'text-xs font-medium',
                      stat.trendUp ? 'text-green-400' : 'text-yellow-400'
                    )}
                  >
                    {stat.trend}
                  </span>
                  <span className="text-xs text-white/30">vs last week</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Progress Card - large hero */}
          <div className="lg:col-span-2 rounded-2xl glass p-6 transition-all duration-300 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-white/90">Task Progress</h2>
                <p className="text-xs text-white/30 mt-0.5">Weekly overview of your tasks</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 border border-white/5">
                <Activity className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[11px] font-medium text-white/50">Live</span>
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="relative h-48 lg:h-56 rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 overflow-hidden">
              {/* Simulated bar chart */}
              <div className="absolute inset-0 flex items-end justify-around px-4 pb-6 gap-2">
                {[
                  { h: 40, color: 'from-indigo-500/40 to-indigo-500/20', label: 'Mon' },
                  { h: 65, color: 'from-indigo-500/50 to-indigo-500/25', label: 'Tue' },
                  { h: 45, color: 'from-indigo-500/40 to-indigo-500/20', label: 'Wed' },
                  { h: 80, color: 'from-indigo-500/60 to-indigo-500/30', label: 'Thu' },
                  { h: 55, color: 'from-indigo-500/45 to-indigo-500/20', label: 'Fri' },
                  { h: 70, color: 'from-cyan-500/50 to-cyan-500/25', label: 'Sat' },
                  { h: 35, color: 'from-cyan-500/40 to-cyan-500/20', label: 'Sun' },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div
                      className="w-full max-w-[32px] rounded-lg bg-gradient-to-t transition-all duration-500 hover:opacity-80"
                      style={{ height: `${bar.h}%` }}
                    >
                      <div className={cn('h-full w-full rounded-lg bg-gradient-to-t opacity-80', bar.color)} />
                    </div>
                    <span className="text-[10px] text-white/30">{bar.label}</span>
                  </div>
                ))}
              </div>

              {/* Grid lines */}
              {[25, 50, 75].map((line) => (
                <div
                  key={line}
                  className="absolute left-0 right-0 border-t border-white/[0.03]"
                  style={{ bottom: `${line}%` }}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-sm bg-indigo-500/60" />
                  <span className="text-xs text-white/40">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-sm bg-cyan-500/60" />
                  <span className="text-xs text-white/40">In Progress</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-white/30" />
                <span className="text-xs text-white/30">Last 7 days</span>
              </div>
            </div>
          </div>

          {/* Distribution Card */}
          <div className="rounded-2xl glass p-6 transition-all duration-300 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-white/90">Distribution</h2>
                <p className="text-xs text-white/30 mt-0.5">Task status breakdown</p>
              </div>
              <PieChart className="h-4 w-4 text-white/30" />
            </div>

            {/* Donut chart placeholder */}
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                {/* Completed segment */}
                {completedTasks > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(34,197,94,0.6)"
                    strokeWidth="8"
                    strokeDasharray={`${(completedTasks / Math.max(totalTasks, 1)) * 264} 264`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                )}
                {/* In Progress segment */}
                {inProgressTasks > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(6,182,212,0.6)"
                    strokeWidth="8"
                    strokeDasharray={`${(inProgressTasks / Math.max(totalTasks, 1)) * 264} 264`}
                    strokeDashoffset={`${-(completedTasks / Math.max(totalTasks, 1)) * 264}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                )}
                {/* Pending segment */}
                {pendingTasks > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(250,204,21,0.6)"
                    strokeWidth="8"
                    strokeDasharray={`${(pendingTasks / Math.max(totalTasks, 1)) * 264} 264`}
                    strokeDashoffset={`${-((completedTasks + inProgressTasks) / Math.max(totalTasks, 1)) * 264}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white/90">{totalTasks}</span>
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2.5">
              {[
                { label: 'Completed', count: completedTasks, color: 'bg-green-400', dot: 'glow-dot-green' },
                { label: 'In Progress', count: inProgressTasks, color: 'bg-cyan-400', dot: 'glow-dot-cyan' },
                { label: 'Pending', count: pendingTasks, color: 'bg-yellow-400', dot: 'glow-dot-yellow' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={cn('glow-dot', item.color, item.dot)} />
                    <span className="text-xs text-white/50">{item.label}</span>
                  </div>
                  <span className="text-xs font-medium text-white/70">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Profile & Recent Tasks */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="rounded-2xl glass p-6 transition-all duration-300 hover:bg-white/[0.05] glow-border-purple">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white/90">Profile</h2>
              <Users className="h-4 w-4 text-white/30" />
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 ring-2 ring-white/10">
                  <span className="text-2xl font-bold text-gradient-primary">
                    {user?.full_name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-[#0a0a0a] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              </div>

              <div>
                <p className="font-semibold text-white/90">{user?.full_name}</p>
                <p className="text-xs text-white/40 mt-0.5">{user?.email}</p>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 border border-white/5">
                <Zap className="h-3 w-3 text-yellow-400" />
                <span className="text-[11px] font-medium text-yellow-400/80">Pro Member</span>
              </div>

              <div className="w-full pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Member since</span>
                  <span className="text-white/60">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Completion rate</span>
                  <span className="text-green-400">{completionRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="lg:col-span-2 rounded-2xl glass p-6 transition-all duration-300 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-white/90">Recent Tasks</h2>
                <p className="text-xs text-white/30 mt-0.5">Your latest activity</p>
              </div>
              <Badge
                variant="outline"
                className="text-[11px] text-white/30 border-white/10 bg-transparent"
              >
                View all
              </Badge>
            </div>

            {tasksLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl bg-white/5" />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                  <ListTodo className="h-6 w-6 text-white/20" />
                </div>
                <p className="text-sm text-white/40">No tasks yet</p>
                <p className="text-xs text-white/20">Create your first task to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTasks.map((task, index) => (
                  <div
                    key={task.task_id}
                    className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-all duration-200 hover:bg-white/[0.04] hover:border-white/10"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 transition-colors duration-200',
                          task.status?.status === 'Completed'
                            ? 'bg-green-500/10 text-green-400'
                            : task.status?.status === 'In Progress'
                            ? 'bg-cyan-500/10 text-cyan-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        )}
                      >
                        {task.status?.status === 'Completed' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : task.status?.status === 'In Progress' ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                          {task.title}
                        </p>
                        <p className="text-[11px] text-white/30 mt-0.5">
                          {formatDate(task.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 ml-3">
                      <Badge
                        variant={
                          task.status?.status === 'Pending'
                            ? 'pending'
                            : task.status?.status === 'In Progress'
                            ? 'in_progress'
                            : 'completed'
                        }
                        className="text-[10px] px-2 py-0.5"
                      >
                        {task.status?.status}
                      </Badge>
                      <ArrowUpRight className="h-3.5 w-3.5 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Target, label: 'Tasks Goal', value: '45 / 50', progress: 90, color: 'text-indigo-400' },
            { icon: Zap, label: 'Streak', value: '12 days', progress: 60, color: 'text-yellow-400' },
            { icon: Activity, label: 'Productivity', value: '86%', progress: 86, color: 'text-green-400' },
            { icon: Clock, label: 'Avg Response', value: '1.2h', progress: 75, color: 'text-cyan-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl glass p-4 transition-all duration-300 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <stat.icon className={cn('h-3.5 w-3.5', stat.color)} />
                <span className="text-[11px] text-white/40">{stat.label}</span>
              </div>
              <p className="text-lg font-semibold text-white/90">{stat.value}</p>
              <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-white/20 to-white/40"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
