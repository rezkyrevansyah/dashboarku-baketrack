'use client';

import { Database, Globe, Link as LinkIcon, X, Copy as IconCopy } from 'lucide-react';
import { motion } from 'framer-motion';
import { SyncButton } from '@/components/ui/SyncButton';
import { getApiUrl } from '@/services/api';

export function IntegrationCard() {
  const currentUrl = getApiUrl();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    const icon = document.getElementById('copy-btn-icon-new');
    if (icon) {
      icon.style.color = '#22c55e';
      setTimeout(() => icon.style.color = '', 500);
    }
  };

  return (
    <div className="clay-card-static p-4 sm:p-6 md:p-8 relative overflow-hidden bg-white h-full flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-50/40 rounded-full blur-[120px] -mr-80 -mt-80 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col xl:flex-row gap-8 xl:items-start flex-1">
        
        {/* Content Side */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm border-2 border-purple-100 shrink-0">
              <Database size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-bakery-text tracking-tight mb-2">Integration</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                Connected
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50/60 rounded-[20px] border border-gray-200/60 w-full">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <Globe size={12} /> Google Script URL
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center shadow-sm min-w-0 overflow-hidden">
                <code className="text-xs text-gray-500 font-mono truncate select-all block w-full">{currentUrl}</code>
              </div>
              <button
                onClick={handleCopyUrl}
                className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:border-purple-200 hover:shadow-md transition-all active:scale-95 shrink-0"
              >
                <IconCopy size={16} id="copy-btn-icon-new" className="transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions Side (Buttons) */}
        <div className="w-full xl:w-72 grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-col gap-3 shrink-0">
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://docs.google.com/spreadsheets/d/1fUzvyAYXWr56PWEVIGTRN21-lhsfcYAWmIaGHcWmwgA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-green-500 text-white rounded-xl font-black text-sm shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
          >
            <LinkIcon size={18} strokeWidth={2.5} />
            Open Sheet
          </motion.a>
          
          <SyncButton className="w-full !h-auto !py-3 !rounded-xl !text-sm !font-black !shadow-md !bg-white !text-bakery-text border border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-3" />
          
          <button className="col-span-1 sm:col-span-2 xl:w-full px-4 py-3 bg-red-50 text-red-500 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center gap-2 shadow-sm">
            <X size={14} strokeWidth={3} />
            Disconnect
          </button>
        </div>

      </div>
    </div>
  );
}
