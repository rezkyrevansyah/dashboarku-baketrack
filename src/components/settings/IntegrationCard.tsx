'use client';

import { Database, Globe, Link as LinkIcon, X, Copy as IconCopy } from 'lucide-react';
import { motion } from 'framer-motion';
import { SyncButton } from '@/components/ui/SyncButton';
import { GOOGLE_SCRIPT_URL } from '@/services/api';

export function IntegrationCard() {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(GOOGLE_SCRIPT_URL);
    const icon = document.getElementById('copy-btn-icon-new');
    if (icon) {
      icon.style.color = '#22c55e';
      setTimeout(() => icon.style.color = '', 500);
    }
  };

  return (
    <div className="clay-card-static p-4 sm:p-6 md:p-12 relative overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-50/40 rounded-full blur-[120px] -mr-80 -mt-80 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col xl:flex-row gap-10 xl:items-start">
        
        {/* Content Side */}
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[28px] bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm border-2 border-purple-100 shrink-0">
              <Database size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-bakery-text tracking-tight mb-2">Database Integration</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                Connected
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50/60 rounded-[24px] border border-gray-200/60 max-w-3xl">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
              <Globe size={12} /> Google Script URL
            </label>
            <div className="flex gap-3">
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 flex items-center shadow-sm min-w-0">
                <code className="text-xs text-gray-500 font-mono truncate select-all block w-full">{GOOGLE_SCRIPT_URL}</code>
              </div>
              <button
                onClick={handleCopyUrl}
                className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:border-purple-200 hover:shadow-md transition-all active:scale-95 shrink-0"
              >
                <IconCopy size={20} id="copy-btn-icon-new" className="transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions Side */}
        <div className="w-full xl:w-60 flex flex-col sm:flex-row xl:flex-col gap-4 shrink-0">
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://docs.google.com/spreadsheets/d/1fUzvyAYXWr56PWEVIGTRN21-lhsfcYAWmIaGHcWmwgA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-green-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-green-200 hover:bg-green-600 transition-all hover:-translate-y-1"
          >
            <LinkIcon size={20} strokeWidth={2.5} />
            Open Sheet
          </motion.a>
          
          <SyncButton className="w-full !h-auto !py-4 !rounded-2xl !text-sm !font-black !shadow-lg !bg-white !text-bakery-text border border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-3" />
          
          <button className="w-full px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
            <X size={16} strokeWidth={3} />
            Disconnect
          </button>
        </div>

      </div>
    </div>
  );
}
