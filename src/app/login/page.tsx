'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, AlertCircle, Globe } from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';

export default function LoginPage() {
  const { login } = useAuth();
  const { t, language, setLanguage } = usePreferences();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError(t('login.error_auth'));
        setIsLoading(false);
      }
      // If success, AuthContext handles redirect
    } catch (err) {
      setError(t('login.error_network'));
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ID' ? 'EN' : 'ID');
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center p-4 relative">
      {/* Language Switcher - Top Right */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLanguage}
        className="absolute top-6 right-6 flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:bg-white/80 transition-colors text-pink-600 font-bold z-20"
      >
        <Globe size={18} />
        <span>{language}</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="clay-card relative bg-white rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <div className="text-center mb-6">
                    {/* Logo: Displaying the new logo image */}
                    <div className="w-28 h-28 bg-white rounded-3xl mx-auto flex items-center justify-center p-2 shadow-[0_10px_30px_-10px_rgba(244,114,182,0.5)] transform -rotate-6 mb-6 ring-4 ring-pink-50">
                        <Image 
                            src="/logo.png" 
                            alt="BakeTrack Logo" 
                            width={100} 
                            height={100}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-1">{t('login.welcome')}</h1>
                    <p className="text-gray-500 text-sm mb-1">{t('login.subtitle')}</p>
                    <p className="text-pink-500 font-bold text-[10px] uppercase tracking-widest opacity-80">
                        by dashboardku.co bakery tools
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                                <User size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder={t('login.email_placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] outline-none"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input 
                                type="password" 
                                placeholder={t('login.password_placeholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] outline-none"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center gap-3 shadow-md"
                        >
                            <AlertCircle size={24} className="flex-shrink-0" />
                            <div>
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        </motion.div>
                    )}

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className={clsx(
                            "w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition-all",
                            isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-pink-300"
                        )}
                    >
                        {isLoading ? (
                            t('login.btn_loading')
                        ) : (
                            <>
                                {t('login.btn_login')} <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center space-y-6">
                    <p className="text-gray-400 text-sm hover:text-pink-500 cursor-pointer transition-colors">
                        {t('login.forgot_pass')}
                    </p>

                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">
                            {t('login.first_time')}
                        </p>
                        
                        <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-5 text-center border border-pink-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200/20 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-pink-300/30 transition-all"></div>
                            
                            <p className="text-sm text-gray-600 mb-4 font-medium relative z-10">
                                {t('login.setup_desc')}
                            </p>
                            
                            <a 
                                href="/setup" 
                                className="w-full inline-flex items-center justify-center gap-2 bg-white text-pink-600 font-bold py-3 rounded-xl shadow-sm border border-pink-200 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] relative z-10"
                            >
                                🚀 {t('login.btn_setup')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
