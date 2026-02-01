'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface SidebarNavProps {
  menuItems: Array<{ name: string; icon: LucideIcon; path: string }>;
  pathname: string;
  isCollapsed: boolean;
  isMobile: boolean;
  onLinkClick: () => void;
}

export function SidebarNav({ menuItems, pathname, isCollapsed, isMobile, onLinkClick }: SidebarNavProps) {
  const showText = !isCollapsed || isMobile;

  return (
    <nav className="flex-1 space-y-5">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link key={item.path} href={item.path} className="block group" onClick={onLinkClick}>
            <div
              className={clsx(
                "clay-nav-item relative flex items-center gap-4 px-4 py-3.5 transition-all duration-300",
                isActive ? "active" : "",
                (!showText) ? "justify-center px-0 mx-2" : ""
              )}
            >
              <div className={clsx(
                "p-2.5 rounded-xl transition-colors flex-shrink-0",
                isActive ? "bg-pink-400 text-white shadow-inner" : "bg-white/10 text-pink-50"
              )}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              
              {showText && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-lg tracking-wide whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}

              {isActive && showText && (
                <motion.div 
                  layoutId="activeDot"
                  className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" 
                  initial={false}
                />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
