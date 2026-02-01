'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { usePreferences } from '@/context/PreferencesContext';
import { updateProfile } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { SecurityCard } from '@/components/settings/SecurityCard';
import { CurrencySettingsCard } from '@/components/settings/CurrencySettingsCard';

import { EditProfileModal } from '@/components/settings/EditProfileModal';

export default function SettingsPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
  const { user } = useAuth();
  const { t } = usePreferences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile local state for the modal
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photourl: ''
  });

  // Sync modal form with global data when it opens
  useEffect(() => {
    if (data?.profile && isModalOpen) {
      setFormData({
        name: data.profile.name,
        email: data.profile.email,
        photourl: data.profile.photourl
      });
    }
  }, [data, isModalOpen]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await updateProfile(formData);
    if (success) {
      await refreshData();
      setIsModalOpen(false);
    } else {
      alert(t('settings.error_update'));
    }
    setIsSubmitting(false);
  };

  if (dataLoading && !data) {
    return <LoadingSpinner message={t('settings.loading')} />;
  }

  const profile = user || { name: 'Guest', email: 'guest@bakery.com', photourl: '🧁' };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header - Same structure as ProductHeader */}
      <SettingsHeader />

      {/* Content Grid - Simple single-level structure */}
      <div className="grid grid-cols-1 gap-8 px-4">
        {/* Profile Card - Full Width */}
        <ProfileCard profile={profile} onEditClick={() => setIsModalOpen(true)} />

        {/* Security + Currency - 2 Column on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SecurityCard />
          <CurrencySettingsCard />
        </div>

        {/* Database Connection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    🔌 {t('settings.database') || 'Database Connection'}
                </h3>
             </div>
             
             <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Google Apps Script</p>
                        <p className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-md">
                            {localStorage.getItem('baketrack_api_url') 
                                ? 'Connected: ...' + localStorage.getItem('baketrack_api_url')?.slice(-20) 
                                : 'Not Configured'}
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => window.location.href = '/setup?step=3'}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                >
                    Update Connection
                </button>
             </div>
        </div>
      </div>

      {/* Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateProfile}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
