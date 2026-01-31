'use client'; 
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { usePreferences } from '@/context/PreferencesContext';
import { updateProfile } from '@/services/api';
import { Loader2, Settings } from 'lucide-react';
import { LanguageCurrencySwitcher } from '@/components/ui/LanguageCurrencySwitcher';
import { SyncButton } from '@/components/ui/SyncButton';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { SecurityCard } from '@/components/settings/SecurityCard';
import { CurrencySettingsCard } from '@/components/settings/CurrencySettingsCard';
import { IntegrationCard } from '@/components/settings/IntegrationCard';
import { EditProfileModal } from '@/components/settings/EditProfileModal';

export default function SettingsPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
  const { user } = useAuth(); // Import useAuth
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto" />
          <p className="text-bakery-muted font-bold tracking-widest text-sm uppercase">{t('settings.loading')}</p>
        </div>
      </div>
    );
  }

  const profile = user || { name: 'Guest', email: 'guest@bakery.com', photourl: '🧁' };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24">
      
      {/* --- HEADER --- */}
      <div className="px-6 pt-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-bakery-text tracking-tighter mb-2 flex items-center gap-3 sm:gap-4 flex-wrap">
             <span className="p-2 sm:p-3 bg-white rounded-[16px] sm:rounded-[20px] text-pink-500 shadow-sm border border-pink-100 flex-shrink-0">
                <Settings size={20} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
             </span>
             {t('settings.title')}
          </h1>
          <p className="text-bakery-muted font-medium text-sm sm:text-lg pl-1 opacity-80">
             {t('settings.subtitle')}
          </p>
        </div>
        <div className="w-full md:w-auto flex justify-center md:justify-end items-center gap-3 flex-wrap">
           <SyncButton variant="compact" />
           <LanguageCurrencySwitcher />
        </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 items-stretch">
        
        {/* LEFT COLUMN (8 Cols) - Profile & Security */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <ProfileCard profile={profile} onEditClick={() => setIsModalOpen(true)} />
           <SecurityCard />
        </div>

        {/* RIGHT COLUMN (4 Cols) - Currency Settings */}
        <div className="lg:col-span-4 flex flex-col">
           <CurrencySettingsCard />
        </div>

      </div>

      {/* --- INTEGRATION SECTION (Full Width) --- */}
      <div className="px-6">
         <IntegrationCard />
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
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
