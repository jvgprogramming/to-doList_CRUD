'use client';

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative flex min-h-screen overflow-hidden">
      {/* Background glows - ambient neon lighting */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 15% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 500px 400px at 85% 15%, rgba(168, 85, 247, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 70% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 300px 300px at 20% 70%, rgba(34, 197, 94, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 90% 60%, rgba(250, 204, 21, 0.04) 0%, transparent 70%)
          `,
        }}
      />

      {/* Animated gradient orbs */}
      <div
        className="pointer-events-none fixed -top-40 -left-40 h-80 w-80 rounded-full opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          transform: `translate(${(mousePos.x - 50) * 0.02}px, ${(mousePos.y - 50) * 0.02}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div
        className="pointer-events-none fixed -bottom-40 -right-40 h-80 w-80 rounded-full opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          transform: `translate(${(mousePos.x - 50) * -0.02}px, ${(mousePos.y - 50) * -0.02}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content - offset by sidebar width on desktop */}
      <div className="relative z-10 flex flex-1 flex-col lg:ml-64">
        {/* Floating Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 pt-4 animate-fade-in">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 pb-4">
          <div className="flex items-center justify-between rounded-2xl glass px-5 py-3">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/20">Status</span>
              <span className="flex items-center gap-1.5 text-xs text-green-400/70">
                <span className="glow-dot glow-dot-green bg-green-400" />
                All systems normal
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
