'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import { FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { setupTranslations } from './content';
import { Step1Language } from './components/Step1Language';
import { Step2Database } from './components/Step2Database';
import { Step3Connect } from './components/Step3Connect';
import { Step4Finish } from './components/Step4Finish';

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = usePreferences();
  const [step, setStep] = useState(1);
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (msg: string) => {
    setNotification(msg);
  };

  const currentT = setupTranslations[language as keyof typeof setupTranslations] || setupTranslations.EN;

  // Initialize from existing config if revisiting
  useEffect(() => {
    const existingUrl = localStorage.getItem('baketrack_api_url');
    if (existingUrl) {
      setApiUrl(existingUrl);
    }
    
    // Check url params for step
    const stepParam = searchParams.get('step');
    if (stepParam === '3') {
        setStep(3);
    }
  }, [searchParams]);

  // Validate URL pattern
  const isValidUrlPattern = (url: string) => {
    // Basic structural check for Google Apps Script Web App URL
    return /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec(\?.*)?$/.test(url);
  };
  
  const handleTestConnection = async () => {
    if (!apiUrl) return;
    
    // Clean input first
    const cleanUrl = apiUrl.trim();
    setApiUrl(cleanUrl);

    if (!isValidUrlPattern(cleanUrl)) {
        setTestStatus('error');
        setTestMessage(currentT.errUrl);
        return;
    }

    setTestStatus('testing');
    setTestMessage('');

    try {
        // Use our Proxy to test the connection (simulate a fetch)
        const proxyUrl = '/api/proxy';
        const target = `${cleanUrl}?action=getData`;
        const res = await fetch(`${proxyUrl}?url=${encodeURIComponent(target)}`);
        
        const data = await res.json().catch(() => null);

        if (!res.ok) {
             throw new Error(data?.error || `Network error (${res.status})`);
        }
        
        if (data.error) throw new Error(data.error);
        
        // Basic validation of response structure to ensure it's OUR script
        if (data.products || data.transactions) {
            setTestStatus('success');
            setTestMessage(currentT.successConn);
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (err: any) {
        console.error(err);
        setTestStatus('error');
        setTestMessage(currentT.errConn);
    }
  };

  const handleNext = () => {
    if (step === 3) {
      if (testStatus !== 'success' && !isValidUrlPattern(apiUrl)) {
         alert(currentT.enterValid);
         return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSaveAndFinish = () => {
    localStorage.setItem('baketrack_api_url', apiUrl.trim());
    // Force a small delay to show success before redirect
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleNext(); // Move to Step 4 (Finish)
    }, 1000);
  };
  
  const copyAdminEmail = () => {
    navigator.clipboard.writeText('admin@admin.com');
    showNotification(currentT.copyEmail);
  };

  const copyAdminPass = () => {
      navigator.clipboard.writeText('admin');
      showNotification(currentT.copyPass);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 w-full">
            <div 
                className="h-full bg-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
            />
        </div>

        <div className="p-8 md:p-12 relative min-h-[500px] flex flex-col">
            {/* Header / Back */}
            {step > 1 && step < 4 && (
                <button 
                  onClick={handlePrev} 
                  className="relative mb-6 md:absolute md:top-8 md:left-8 md:mb-0 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 self-start"
                >
                  <FiArrowLeft /> {currentT.btnBack}
                </button>
            )}

            <div className="flex-1 flex flex-col justify-center">
                {step === 1 && <Step1Language t={currentT} />}
                {step === 2 && <Step2Database t={currentT} />}
                {step === 3 && (
                  <Step3Connect 
                    t={currentT} 
                    apiUrl={apiUrl}
                    setApiUrl={setApiUrl}
                    testStatus={testStatus}
                    setTestStatus={setTestStatus}
                    testMessage={testMessage}
                    handleTestConnection={handleTestConnection}
                  />
                )}
                {step === 4 && (
                  <Step4Finish 
                    t={currentT}
                    copyAdminEmail={copyAdminEmail}
                    copyAdminPass={copyAdminPass}
                  />
                )}
            </div>

            {/* Footer Navigation (Steps 1-3) */}
            {step < 4 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    {step === 3 ? (
                        <button
                            onClick={handleSaveAndFinish}
                            disabled={!apiUrl || loading || testStatus !== 'success'} // Must test successfully
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all transform ${
                                !apiUrl || testStatus !== 'success' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-700 hover:scale-105 shadow-lg'
                            }`}
                        >
                            {loading ? currentT.btnSave : currentT.btnFinish} <FiCheckCircle />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all hover:translate-x-1"
                        >
                            {currentT.btnNext} <FiArrowRight />
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* Custom Toast Notification */}
        {notification && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                <FiCheckCircle className="text-green-400" />
                <span className="font-medium text-sm">{notification}</span>
            </div>
        )}
      </div>
    </div>
  );
}
