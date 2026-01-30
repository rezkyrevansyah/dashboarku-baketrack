'use client';

import { useState } from 'react';
import { RotateCw, Loader2 } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { ClayButton } from '@/components/ui/ClayButton';

interface SyncButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function SyncButton({ className = '', variant = 'full' }: SyncButtonProps) {
  const { refreshData } = useDashboard();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await refreshData();
    // Artificial delay to show animation if sync is too fast
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSyncing(false);
  };

  if (variant === 'compact') {
    return (
      <button 
        onClick={handleSync}
        disabled={isSyncing}
        className={`w-10 h-10 rounded-xl bg-white text-blue-500 flex items-center justify-center shadow-clay-floating border-2 border-white hover:scale-110 active:scale-95 transition-all ${className}`}
        title="Sync Data"
      >
        <RotateCw size={18} className={isSyncing ? 'animate-spin' : ''} />
      </button>
    );
  }

  return (
    <ClayButton 
      onClick={handleSync}
      disabled={isSyncing}
      className={`!rounded-2xl !px-6 flex items-center gap-2 h-12 shadow-lg min-w-[140px] justify-center ${className}`}
    >
      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RotateCw size={18} />}
      <span className="font-bold">{isSyncing ? 'SYNCING...' : 'SYNC NOW'}</span>
    </ClayButton>
  );
}
