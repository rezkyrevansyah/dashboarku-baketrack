import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ClayCard({ children, className, ...props }: ClayCardProps) {
  return (
    <div 
      className={twMerge("clay-card p-6", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
