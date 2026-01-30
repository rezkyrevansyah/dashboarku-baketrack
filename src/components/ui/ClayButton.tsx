'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, MotionProps } from 'framer-motion';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function ClayButton({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: ClayButtonProps) {
  
  const baseClass = variant === 'primary' 
    ? 'clay-btn-primary px-6 py-2.5 shadow-lg' 
    : variant === 'secondary'
    ? 'bg-white text-gray-600 shadow-md border border-gray-100 rounded-xl px-5 py-2 font-bold hover:bg-gray-50'
    : 'bg-red-100 text-red-500 rounded-xl px-4 py-2 font-bold hover:bg-red-200';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={twMerge(baseClass, className)}
      {...props as any} // Cast to any to avoid strict MotionProps type conflict with standard button
    >
      {children}
    </motion.button>
  );
}
