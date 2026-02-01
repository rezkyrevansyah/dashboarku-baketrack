'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import { FiDatabase, FiGlobe, FiCheckCircle, FiCopy, FiArrowRight, FiArrowLeft, FiServer, FiLock, FiInfo } from 'react-icons/fi';
import { getApiUrl } from '@/services/api';

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLanguage, language } = usePreferences();
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

  // Translations
  const t = {
    ID: {
      selectLang: "Pilih Bahasa",
      chooseLang: "Pilih bahasa preferensi Anda",
      createDb: "Buat Database",
      needSheet: "Anda memerlukan Google Sheet sendiri untuk menyimpan data.",
      officialTempl: "Template Resmi",
      weHavePrep: "Kami telah menyediakan master sheet lengkap dengan kolom dan script yang dibutuhkan. Klik di bawah untuk menyalin ke Google Drive Anda.",
      copyTempl: "Salin Template Database",
      afterCopy: "Setelah menyalin, biarkan tab terbuka! Anda perlu men-deploy script di langkah berikutnya.",
      connectApi: "Hubungkan API",
      deployScript: "Deploy script dan tempel URL di sini.",
      howTo: "Cara mendapatkan URL?",
      step1: "1. Di Google Sheet, buka **Extensions > Apps Script**.",
      step2: "2. Klik tombol biru **Deploy** (kanan atas) > **New Deployment**.",
      step3: "3. Pilih tipe: **Web App** (ikon gerigi).",
      step4: "4. Set **Who has access** ke: **Anyone** (Siapa saja).",
      step5: "5. Klik **Deploy** dan salin **Web App URL**.",
      labelUrl: "URL Web App Apps Script",
      placeholderUrl: "https://script.google.com/macros/s/...",
      urlHint: "Pastikan URL berakhiran /exec",
      testConn: "Tes Koneksi",
      testing: "Menguji...",
      allSet: "Selesai!",
      dashConnected: "Dashboard Anda kini terhubung ke database pribadi.",
      defCreds: "Akun Default",
      email: "Email",
      pass: "Password",
      changeLater: "Anda bisa mengubah ini di sheet 'Profile' nanti.",
      btnLogin: "Masuk ke Login",
      btnNext: "Lanjut",
      btnBack: "Kembali",
      btnFinish: "Selesai",
      btnSave: "Menyimpan...",
      errUrl: "Format URL salah. Harus berakhiran /exec",
      errConn: "Gagal terhubung. Cek URL atau Deployment.",
      successConn: "Koneksi Berhasil!",
      enterValid: "Masukkan URL yang valid",
      copyEmail: "Email disalin!",
      copyPass: "Password disalin!",
      googleWarnTitle: "Peringatan Keamanan Google",
      googleWarnText: "Jika muncul peringatan 'Google hasn't verified this app' atau 'Back to safety' saat otorisasi, klik **Advanced** -> **Go to ... (unsafe)**. Ini aman karena script ini adalah milik Anda sendiri."
    },
    EN: {
      selectLang: "Select Language",
      chooseLang: "Choose your preferred language",
      createDb: "Create Your Database",
      needSheet: "You need your own Google Sheet to store data.",
      officialTempl: "Official Template",
      weHavePrep: "We have prepared a master sheet with all necessary columns and scripts. Click below to make a copy to your Google Drive.",
      copyTempl: "Copy Database Template",
      afterCopy: "After copying, keep the tab open! You will need to deploy the script in the next step.",
      connectApi: "Connect API",
      deployScript: "Deploy the script and paste the URL here.",
      howTo: "How to get the URL?",
      step1: "1. In your Google Sheet, go to **Extensions > Apps Script**.",
      step2: "2. Click the blue **Deploy** button (top right) > **New Deployment**.",
      step3: "3. Select type: **Web App** (gear icon).",
      step4: "4. Set **Who has access** to: **Anyone**.",
      step5: "5. Click **Deploy** and copy the **Web App URL**.",
      labelUrl: "Apps Script Web App URL",
      placeholderUrl: "https://script.google.com/macros/s/...",
      urlHint: "Make sure the URL ends with /exec",
      testConn: "Test Connection",
      testing: "Testing...",
      allSet: "All Set!",
      dashConnected: "Your dashboard is now connected to your private database.",
      defCreds: "Default Credentials",
      email: "Email",
      pass: "Password",
      changeLater: "You can change these in the 'Profile' sheet later.",
      btnLogin: "Go to Login",
      btnNext: "Next",
      btnBack: "Back",
      btnFinish: "Finish Setup",
      btnSave: "Saving...",
      errUrl: "Invalid URL format. Must end with /exec",
      errConn: "Connection failed. Check URL or Deployment.",
      successConn: "Connection Successful!",
      enterValid: "Please enter a valid URL",
      copyEmail: "Email copied!",
      copyPass: "Password copied!",
      googleWarnTitle: "Google Security Warning",
      googleWarnText: "If you see 'Google hasn't verified this app' or 'Back to safety' during authorization, click **Advanced** -> **Go to ... (unsafe)**. This is safe as the script belongs to you."
    }
  };

  const currentT = t[language as keyof typeof t] || t.EN;

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

  const copyRefLink = () => {
    navigator.clipboard.writeText('https://docs.google.com/spreadsheets/d/1fUzvyAYXWr56PWEVIGTRN21-lhsfcYAWmIaGHcWmwgA/copy');
    showNotification('Template link copied!');
  };
  
  const copyAdminEmail = () => {
    navigator.clipboard.writeText('admin@admin.com');
    showNotification(currentT.copyEmail);
  };

  const copyAdminPass = () => {
      navigator.clipboard.writeText('admin');
      showNotification(currentT.copyPass);
  };

  const renderStep1_Language = () => (
    // ... existing ...
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{currentT.selectLang}</h2>
        <p className="text-gray-500">{currentT.chooseLang}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setLanguage('ID')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
            language === 'ID' 
              ? 'border-pink-500 bg-pink-50/50 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <span className="font-semibold text-gray-700 text-lg">ID - Indonesia</span>
        </button>

        <button
          onClick={() => setLanguage('EN')}
          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
            language === 'EN' 
              ? 'border-pink-500 bg-pink-50/50 shadow-lg scale-105' 
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <span className="font-semibold text-gray-700 text-lg">ENG - English</span>
        </button>
      </div>
    </div>
  );

  const renderStep2_Database = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{currentT.createDb}</h2>
        <p className="text-gray-500">{currentT.needSheet}</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <FiDatabase size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{currentT.officialTempl}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {currentT.weHavePrep}
            </p>
          </div>
        </div>

        <a 
          href="https://docs.google.com/spreadsheets/d/1fUzvyAYXWr56PWEVIGTRN21-lhsfcYAWmIaGHcWmwgA/copy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <FiCopy />
          {currentT.copyTempl}
        </a>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-700">
        <FiInfo className="shrink-0 mt-0.5" />
        <p>{currentT.afterCopy}</p>
      </div>
    </div>
  );

  const renderStep3_Connect = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
       <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{currentT.connectApi}</h2>
        <p className="text-gray-500">{currentT.deployScript}</p>
      </div>

      <div className="space-y-4">
        {/* Google Warning Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-left">
           <div className="text-yellow-600 shrink-0 mt-1">
             <FiInfo size={20} />
           </div>
           <div>
             <h4 className="font-bold text-yellow-800 text-sm mb-1">{currentT.googleWarnTitle}</h4>
             <p className="text-xs text-yellow-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: currentT.googleWarnText.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
           </div>
        </div>

        {/* Accordion Guide */}
        <details className="group bg-white border border-gray-200 rounded-lg open:ring-2 open:ring-pink-100">
          <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-800">
             <span>{currentT.howTo}</span>
             <span className="transition group-open:rotate-180">▼</span>
          </summary>
          <div className="p-4 pt-0 text-sm text-gray-600 space-y-2 border-t mt-2 pt-4">
            <p dangerouslySetInnerHTML={{ __html: currentT.step1.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: currentT.step2.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: currentT.step3.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: currentT.step4.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
            <p dangerouslySetInnerHTML={{ __html: currentT.step5.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>') }} />
          </div>
        </details>

        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                {currentT.labelUrl}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiServer />
                </div>
                <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => {
                        setApiUrl(e.target.value);
                        setTestStatus('idle'); // Reset test status on change
                    }}
                    placeholder={currentT.placeholderUrl}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white focus:ring-2 outline-none transition-all text-gray-800 placeholder-gray-400 ${
                        testStatus === 'error' ? 'border-red-500 focus:ring-red-200' : 
                        testStatus === 'success' ? 'border-green-500 focus:ring-green-200' : 
                        'border-gray-300 focus:ring-pink-500'
                    }`}
                />
            </div>
            
            {/* Validation / Test Message */}
            <div className="flex items-center justify-between min-h-[24px]">
                <p className="text-xs text-gray-400">{currentT.urlHint}</p>
                {testStatus === 'error' && <span className="text-xs text-red-500 font-medium">{testMessage}</span>}
                {testStatus === 'success' && <span className="text-xs text-green-500 font-medium">{testMessage}</span>}
            </div>

            {/* Test Button */}
            <button
                onClick={handleTestConnection}
                disabled={!apiUrl || testStatus === 'testing'}
                className="text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 disabled:opacity-50"
            >
                {testStatus === 'testing' ? currentT.testing : currentT.testConn}
            </button>
        </div>
      </div>
    </div>
  );

  const renderStep4_Finish = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{currentT.allSet}</h2>
        <p className="text-gray-600 text-lg max-w-md">
          {currentT.dashConnected}
        </p>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white text-gray-800 p-6 rounded-2xl shadow-xl max-w-sm mx-auto transform transition hover:scale-105 duration-300 border border-pink-100">
        <div className="flex items-center gap-2 mb-4 justify-center text-pink-600">
             <FiLock className="w-5 h-5" />
             <span className="font-bold tracking-wider text-sm uppercase">{currentT.defCreds}</span>
        </div>
        
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm flex items-center justify-between group hover:border-pink-300 transition-colors">
                <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">{currentT.email}</p>
                    <p className="font-mono text-lg font-medium text-gray-800">admin@admin.com</p>
                </div>
                <button 
                  onClick={copyAdminEmail} 
                  className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all" 
                  title="Copy Email"
                >
                    <FiCopy size={18} />
                </button>
            </div>

            <div className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm flex items-center justify-between group hover:border-pink-300 transition-colors">
                <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">{currentT.pass}</p>
                    <p className="font-mono text-lg font-medium text-gray-800">admin</p>
                </div>
                <button 
                  onClick={copyAdminPass} 
                  className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all" 
                  title="Copy Password"
                >
                    <FiCopy size={18} />
                </button>
            </div>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 italic">
          {currentT.changeLater}
        </p>
      </div>

      <button
        onClick={() => router.push('/login')}
        className="w-full max-w-sm bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 mx-auto"
      >
        {currentT.btnLogin} <FiArrowRight />
      </button>
    </div>
  );

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
                {step === 1 && renderStep1_Language()}
                {step === 2 && renderStep2_Database()}
                {step === 3 && renderStep3_Connect()}
                {step === 4 && renderStep4_Finish()}
            </div>

            {/* Footer Navigation (Steps 1-3) */}
            {step < 4 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    {step === 3 ? (
                        <button
                            onClick={handleSaveAndFinish}
                            disabled={!apiUrl || loading}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all transform ${
                                !apiUrl ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-700 hover:scale-105 shadow-lg'
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
