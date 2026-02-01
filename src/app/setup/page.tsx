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
import { SetupHeader } from './components/SetupHeader';
import { SetupFooter } from './components/SetupFooter';
import { SetupNotification } from './components/SetupNotification';

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

  const currentT = setupTranslations[language as keyof typeof setupTranslations] || setupTranslations.EN;

  useEffect(() => {
    const existingUrl = localStorage.getItem('baketrack_api_url');
    if (existingUrl) setApiUrl(existingUrl);
    
    const stepParam = searchParams.get('step');
    if (stepParam === '3') setStep(3);
  }, [searchParams]);

  const isValidUrlPattern = (url: string) => 
    /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec(\?.*)?$/.test(url);
  
  const handleTestConnection = async () => {
    if (!apiUrl) return;
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
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(`${cleanUrl}?action=getData`)}`);
        const data = await res.json().catch(() => null);

        if (!res.ok || data?.error || !(data.products || data.transactions)) {
             throw new Error(data?.error || 'Invalid response');
        }
        setTestStatus('success');
        setTestMessage(currentT.successConn);
    } catch (err: any) {
        setTestStatus('error');
        setTestMessage(currentT.errConn);
    }
  };

  const handleNext = () => {
    if (step === 3 && testStatus !== 'success' && !isValidUrlPattern(apiUrl)) {
      alert(currentT.enterValid);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleSaveAndFinish = () => {
    localStorage.setItem('baketrack_api_url', apiUrl.trim());
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleNext();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
        <SetupHeader step={step} handlePrev={() => setStep(s => s - 1)} btnBackText={currentT.btnBack} />

        <div className="p-8 md:p-12 relative min-h-[500px] flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
                {step === 1 && <Step1Language t={currentT} />}
                {step === 2 && <Step2Database t={currentT} />}
                {step === 3 && (
                  <Step3Connect 
                    t={currentT} apiUrl={apiUrl} setApiUrl={setApiUrl}
                    testStatus={testStatus} setTestStatus={setTestStatus}
                    testMessage={testMessage} handleTestConnection={handleTestConnection}
                  />
                )}
                {step === 4 && (
                  <Step4Finish 
                    t={currentT}
                    copyAdminEmail={() => { navigator.clipboard.writeText('admin@admin.com'); setNotification(currentT.copyEmail); }}
                    copyAdminPass={() => { navigator.clipboard.writeText('admin'); setNotification(currentT.copyPass); }}
                  />
                )}
            </div>

            <SetupFooter 
              step={step} loading={loading} apiUrl={apiUrl} 
              testStatus={testStatus} handleSaveAndFinish={handleSaveAndFinish}
              handleNext={handleNext} t={currentT} 
            />
        </div>
        <SetupNotification message={notification} />
      </div>
    </div>
  );
}

