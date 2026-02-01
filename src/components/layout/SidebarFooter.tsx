'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarFooterProps {
  pathname: string;
  isCollapsed: boolean;
  isMobile: boolean;
  settingsText: string;
  logoutText: string;
  onLinkClick: () => void;
  onLogout: () => void;
}

export function SidebarFooter({ 
  pathname, 
  isCollapsed, 
  isMobile, 
  settingsText, 
  logoutText, 
  onLinkClick, 
  onLogout 
}: SidebarFooterProps) {
  const showText = !isCollapsed || isMobile;

  return (
    <div className="mt-auto mb-4 space-y-2">
      <Link href="/settings" onClick={onLinkClick} className="block group">
        <div className={clsx(
          "clay-nav-item flex items-center gap-4 px-4 py-3", 
          pathname === '/settings' ? 'active' : '',
          showText ? "" : "justify-center px-0 mx-2"
        )}>
          <div className={clsx(
            "p-2.5 rounded-xl flex-shrink-0",
            pathname === '/settings' ? "bg-pink-400 text-white" : "bg-white/10 text-pink-50"
          )}>
            <Settings size={22} />
          </div>
          {showText && <span className="font-bold text-lg">{settingsText}</span>}
        </div>
      </Link>

      <button onClick={onLogout} className="w-full block group text-left">
        <div className={clsx(
          "clay-nav-item flex items-center gap-4 px-4 py-3 transition-colors hover:bg-red-50/10",
          showText ? "" : "justify-center px-0 mx-2"
        )}>
          <div className="p-2.5 rounded-xl flex-shrink-0 bg-red-100/20 text-red-100 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <LogOut size={22} />
          </div>
          {showText && <span className="font-bold text-lg text-red-100 group-hover:text-red-200 transition-colors">{logoutText}</span>}
        </div>
      </button>
    </div>
  );
}
