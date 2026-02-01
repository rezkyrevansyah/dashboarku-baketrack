'use client';

import { useAuth, AuthProvider } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Allow access to login and setup pages without auth
      if (!isLoggedIn && pathname !== '/login' && pathname !== '/setup') {
        router.push('/login');
      } 
      // Redirect logged-in users away from login page, but ALLOW setup page for re-configuration
      else if (isLoggedIn && pathname === '/login') {
        router.push('/');
      } else {
        setIsReady(true);
      }
    }
  }, [isLoggedIn, loading, pathname, router]);

  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // If on login or setup page, render children without Sidebar (Full Screen)
  if (pathname === '/login' || pathname === '/setup') {
      return <>{children}</>;
  }

  // Otherwise render with Sidebar (Dashboard Layout)
  return (
    <div className="flex w-full min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-0 transition-all duration-300">
            <div className="md:hidden mb-6 flex items-center justify-between">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-white rounded-xl shadow-sm border border-pink-100 text-pink-500 hover:bg-pink-50 transition-colors active:scale-95"
              >
                <Menu size={24} strokeWidth={2.5} />
              </button>
              <span className="font-bold text-bakery-muted text-sm uppercase tracking-widest mr-2">BakeTrack</span>
            </div>
            {children}
        </main>
    </div>
  );
}

import { usePreferences, PreferencesProvider } from '@/context/PreferencesContext';
import { DashboardProvider } from '@/context/DashboardContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <PreferencesProvider>
                <DashboardProvider>
                    <ClientLayoutContent>{children}</ClientLayoutContent>
                </DashboardProvider>
            </PreferencesProvider>
        </AuthProvider>
    );
}
