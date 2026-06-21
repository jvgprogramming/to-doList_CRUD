'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-4 z-30 mx-4 lg:mx-6">
      <div className="flex h-14 items-center gap-4 rounded-2xl glass px-4 shadow-glass">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white/40 hover:text-white/80 hover:bg-white/5"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="glass-input pl-9 h-9 text-sm"
              readOnly
            />
          </div>
        </div>

        <div className="flex-1 md:flex-none" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white/40 hover:text-white/80 hover:bg-white/5"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
          </Button>

          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white/90">{user?.full_name || 'User'}</p>
              <p className="text-[11px] text-white/40">{user?.email || ''}</p>
            </div>
            <Avatar className="h-8 w-8 ring-2 ring-white/10">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
