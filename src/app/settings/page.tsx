'use client';

import { useState, useEffect } from 'react';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayButton } from '@/components/ui/ClayButton';
import { CheckCircle2, RotateCw, User, Mail, Link as LinkIcon, X, Camera, ShieldCheck, Database, Loader2, Copy as IconCopy } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { updateProfile, GOOGLE_SCRIPT_URL } from '@/services/api';
import { SyncButton } from '@/components/ui/SyncButton';

export default function SettingsPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
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
    
    // Ensure we send whatever keys the API expects, normalized
    const success = await updateProfile(formData);
    
    if (success) {
      await refreshData();
      setIsModalOpen(false);
    } else {
      alert('Gagal memperbarui profil di Google Sheets.');
    }
    setIsSubmitting(false);
  };

  if (dataLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto" />
          <p className="text-bakery-muted font-black uppercase tracking-widest text-sm">Loading Settings...</p>
        </div>
      </div>
    );
  }

  const profile = data?.profile || { name: 'Admin Bakery', email: 'admin@baketrack.com', photourl: '👩‍🍳' };
  const displayPhoto = profile.photourl || '👩‍🍳';

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="px-4">
        <h1 className="text-4xl font-black text-bakery-text tracking-tight mb-2">Pengaturan Dashboard</h1>
        <p className="text-bakery-muted font-bold text-sm tracking-wide opacity-70 uppercase">
           Kelola profil dan koneksi database kamu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center gap-2 ml-2 mb-4">
              <User size={18} className="text-bakery-pink" />
              <h2 className="text-xl font-black text-bakery-text">Profil Pengguna</h2>
           </div>
           
           <ClayCard className="p-10 !rounded-[40px] bg-white shadow-clay-card border border-pink-50/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-white to-pink-50 border-4 border-white shadow-clay-floating flex items-center justify-center text-5xl transform group-hover:rotate-3 transition-transform overflow-hidden">
                       {displayPhoto.startsWith('http') ? (
                         <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         displayPhoto
                       )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border-2 border-pink-50 flex items-center justify-center text-pink-400">
                       <Camera size={18} />
                    </div>
                 </div>

                 <div className="flex-1 text-center md:text-left space-y-6">
                    <div>
                       <h3 className="text-3xl font-black text-bakery-text mb-1">{profile.name}</h3>
                       <p className="text-bakery-muted font-bold flex items-center justify-center md:justify-start gap-2">
                          <Mail size={16} className="text-pink-300" />
                          {profile.email}
                       </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                       <ClayButton onClick={() => setIsModalOpen(true)} className="!rounded-2xl !px-8 h-12 shadow-md">
                          Edit Profil
                       </ClayButton>
                    </div>
                 </div>
              </div>
           </ClayCard>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 ml-2 mb-4">
              <ShieldCheck size={18} className="text-green-500" />
              <h2 className="text-xl font-black text-bakery-text">Keamanan</h2>
           </div>
           
           <ClayCard className="p-6 !rounded-[32px] bg-gradient-to-br from-white to-green-50/30 border border-green-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-bakery-muted opacity-60 uppercase tracking-widest">Status Akun</p>
                    <p className="text-sm font-black text-green-600">Terverifikasi</p>
                 </div>
              </div>
              <p className="text-xs font-bold text-bakery-muted leading-relaxed">
                 Akun kamu telah terhubung secara aman dengan enkripsi Google.
              </p>
           </ClayCard>
        </div>
      </div>

      {/* Spreadsheet Integration Section - REDESIGNED */}
      <div className="space-y-6 px-4">
         <div className="flex items-center gap-2 ml-2">
            <Database size={18} className="text-blue-500" />
            <h2 className="text-xl font-black text-bakery-text">Integrasi Database</h2>
         </div>

         <ClayCard className="p-8 !rounded-[48px] bg-white shadow-clay-card border border-blue-50/50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center justify-between">
               
               {/* Status & Info */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-[32px] bg-gradient-to-br from-blue-50 to-white flex items-center justify-center text-blue-500 shadow-clay-floating border-4 border-white">
                     <Database size={36} strokeWidth={1.5} className="sm:w-[42px] sm:h-[42px]" />
                  </div>
                  
                  <div className="space-y-3 min-w-0 w-full">
                     <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl sm:text-3xl font-black text-bakery-text tracking-tight">Google Sheets</h3>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-600 px-3 py-1 rounded-full border border-green-200 shadow-sm animate-in fade-in zoom-in">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                           Connected
                        </span>
                     </div>
                     
                     <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between gap-3 group hover:bg-blue-50 transition-colors w-full sm:w-fit max-w-full">
                        <code className="text-xs font-bold text-blue-600 font-mono truncate max-w-[200px] sm:max-w-xs select-all">
                           {GOOGLE_SCRIPT_URL}
                        </code>
                        <button 
                           onClick={() => {
                              navigator.clipboard.writeText(GOOGLE_SCRIPT_URL);
                              // Ideally show toast, but valid for now
                              const btn = document.getElementById('copy-icon');
                              if(btn) {
                                 btn.classList.add('text-green-500', 'scale-110');
                                 setTimeout(() => btn.classList.remove('text-green-500', 'scale-110'), 1000);
                              }
                           }}
                           className="w-8 h-8 rounded-xl bg-white text-blue-400 hover:text-green-500 hover:bg-green-50 flex items-center justify-center transition-all shadow-sm active:scale-95"
                           title="Copy URL"
                        >
                           <IconCopy size={16} id="copy-icon" className="transition-transform duration-300" />
                        </button>
                     </div>
                  </div>
               </div>

               {/* Action Buttons - VERTICAL STACK */}
               <div className="w-full lg:w-56 flex flex-col gap-3 shrink-0">
                  <SyncButton className="w-full h-12 !rounded-2xl text-sm font-black shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2" />
                  
                  <a 
                   href="https://docs.google.com/spreadsheets/d/1fUzvyAYXWr56PWEVIGTRN21-lhsfcYAWmIaGHcWmwgA"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 text-sm whitespace-nowrap active:scale-95 px-4"
                  >
                     <LinkIcon size={18} strokeWidth={3} />
                     <span>OPEN SHEET</span>
                  </a>
                  
                  <ClayButton variant="danger" className="w-full h-12 !rounded-2xl opacity-80 hover:opacity-100 text-sm font-black whitespace-nowrap shadow-none hover:shadow-md border-2 border-transparent hover:border-red-200 flex items-center justify-center gap-2 px-4">
                     <X size={18} strokeWidth={3} />
                     <span>DISCONNECT</span>
                  </ClayButton>
               </div>

            </div>
         </ClayCard>
      </div>

      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/5 animate-in fade-in duration-300">
          <ClayCard className="w-full max-w-md !rounded-[40px] !bg-white p-10 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-bakery-text">Edit Profil</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                   <X size={20} />
                </button>
             </div>

             <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2 px-1">
                    <User size={14} className="text-pink-400" /> Nama Lengkap
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Mail size={14} className="text-blue-400" /> Alamat Email
                  </label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2 px-1">
                    <LinkIcon size={14} className="text-purple-400" /> Foto Profil (Emoji atau URL)
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.photourl}
                    onChange={e => setFormData({...formData, photourl: e.target.value})}
                    placeholder="Emoji 👋 atau https://..."
                    className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                  />
                </div>

                <div className="pt-4">
                  <ClayButton type="submit" disabled={isSubmitting} className="w-full !rounded-[24px] h-16 text-lg font-black shadow-xl">
                     {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'SIMPAN PERUBAHAN'}
                  </ClayButton>
                </div>
             </form>
             
             <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-pink-100/30 rounded-full blur-3xl pointer-events-none"></div>
          </ClayCard>
        </div>
      )}
    </div>
  );
}
