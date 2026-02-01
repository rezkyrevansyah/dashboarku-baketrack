'use client';

import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

interface SetupHeaderProps {
  step: number;
  handlePrev: () => void;
  btnBackText: string;
}

export function SetupHeader({ step, handlePrev, btnBackText }: SetupHeaderProps) {
  return (
    <>
      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 w-full">
        <div 
          className="h-full bg-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {step > 1 && step < 4 && (
        <button 
          onClick={handlePrev} 
          className="relative mt-8 ml-8 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 self-start md:absolute md:top-8 md:left-8 md:mt-0 md:ml-0"
        >
          <FiArrowLeft /> {btnBackText}
        </button>
      )}
    </>
  );
}
