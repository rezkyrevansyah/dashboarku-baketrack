'use client';

import { Camera, Mail, ShieldCheck } from 'lucide-react';
import { ClayButton } from '@/components/ui/ClayButton';
import { Profile } from '@/services/api';
import { usePreferences } from '@/context/PreferencesContext';

interface ProfileCardProps {
  profile: Profile;
  onEditClick: () => void;
}

export function ProfileCard({ profile, onEditClick }: ProfileCardProps) {
  const { t } = usePreferences();
  const displayPhoto = profile.photourl || '👩‍🍳';

  return (
    <div className="clay-card-static p-4 sm:p-6 md:p-8 relative overflow-hidden group bg-white">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/50 rounded-full blur-3xl -mr-32 -mt-20 pointer-events-none opacity-60"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Photo */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-gray-50 to-white border-[6px] border-white shadow-xl flex items-center justify-center text-6xl overflow-hidden ring-1 ring-black/5">
            {displayPhoto.startsWith('http') ? (
              <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              displayPhoto
            )}
          </div>
          <button 
            onClick={onEditClick}
            className="absolute -bottom-2 -right-2 w-11 h-11 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all transform hover:scale-110 active:scale-90"
          >
            <Camera size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div>
            <h2 className="text-3xl font-black text-bakery-text tracking-tight leading-tight">{profile.name}</h2>
            <p className="text-bakery-muted font-medium flex items-center justify-center md:justify-start gap-2 text-sm mt-1">
              <Mail size={14} /> {profile.email}
            </p>
          </div>
          
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-black uppercase tracking-wider border border-green-100 flex items-center gap-1.5">
              <ShieldCheck size={12} /> {t('settings.status_verified')}
            </span>
            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-black uppercase tracking-wider border border-purple-100 flex items-center gap-1.5">
              Admin
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="md:self-center">
          <ClayButton onClick={onEditClick} className="!rounded-2xl !px-6 !py-3 !text-sm !font-black !h-auto shadow-md">
            {t('settings.edit_profile')}
          </ClayButton>
        </div>
      </div>
    </div>
  );
}
