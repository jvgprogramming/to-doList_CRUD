'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListTodo, LogOut, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: APP_ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: APP_ROUTES.TASKS, label: 'Tasks', icon: ListTodo },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-all duration-300',
          'glass border-r-[rgba(255,255,255,0.06)]',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="flex shrink-0 h-16 items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-6">
          <Link href={APP_ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">

            <span className="text-sm font-semibold tracking-tight text-white/90">TaskFlow</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white/40 hover:text-white/80 hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation - fills all available space */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="section-title px-3 pb-2">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/8 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout + Version - always pinned at the bottom */}
        <div className="shrink-0 border-t border-[rgba(255,255,255,0.06)] p-4">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 transition-all duration-200 hover:text-white/70 hover:bg-white/5"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Version */}
        <div className="shrink-0 px-6 pb-4">
          <p className="text-[10px] text-white/20 tracking-wider uppercase">v2.0.0 — Premium</p>
        </div>
      </aside>
    </>
  );
}
