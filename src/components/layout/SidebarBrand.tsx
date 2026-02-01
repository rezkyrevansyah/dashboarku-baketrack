'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import Image from 'next/image';

interface SidebarBrandProps {
  isCollapsed: boolean;
  isMobile: boolean;
  subtitle: string;
}

export function SidebarBrand({ isCollapsed, isMobile, subtitle }: SidebarBrandProps) {
  const isTextHidden = isCollapsed && !isMobile;
  
  return (
    <div className={clsx("flex items-center gap-4 mb-12 mt-4 px-2", isTextHidden ? "justify-center" : "")}>
      <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center p-1 shadow-lg transform -rotate-6">
        <Image src="/logo.png" alt="BakeTrack" width={40} height={40} className="w-full h-full object-contain" />
      </div>
      {!isTextHidden && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="whitespace-nowrap"
        >
          <h1 className="font-extrabold text-2xl leading-none drop-shadow-sm">BakeTrack</h1>
          <p className="text-sm text-pink-100 font-medium opacity-90">{subtitle}</p>
        </motion.div>
      )}
    </div>
  );
}
