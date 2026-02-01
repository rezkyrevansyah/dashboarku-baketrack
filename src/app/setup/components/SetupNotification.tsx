'use client';

import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

interface SetupNotificationProps {
  message: string;
}

export function SetupNotification({ message }: SetupNotificationProps) {
  if (!message) return null;

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
      <FiCheckCircle className="text-green-400" />
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
}
