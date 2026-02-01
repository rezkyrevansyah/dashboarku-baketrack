'use client';

import React from 'react';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

interface SetupFooterProps {
  step: number;
  loading: boolean;
  apiUrl: string;
  testStatus: string;
  handleSaveAndFinish: () => void;
  handleNext: () => void;
  t: any;
}

export function SetupFooter({ 
  step, 
  loading, 
  apiUrl, 
  testStatus, 
  handleSaveAndFinish, 
  handleNext, 
  t 
}: SetupFooterProps) {
  if (step >= 4) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
      {step === 3 ? (
        <button
          onClick={handleSaveAndFinish}
          disabled={!apiUrl || loading || testStatus !== 'success'}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all transform ${
            !apiUrl || testStatus !== 'success' 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-pink-600 text-white hover:bg-pink-700 hover:scale-105 shadow-lg'
          }`}
        >
          {loading ? t.btnSave : t.btnFinish} <FiCheckCircle />
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all hover:translate-x-1"
        >
          {t.btnNext} <FiArrowRight />
        </button>
      )}
    </div>
  );
}
