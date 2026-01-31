'use client';

import { RotateCw } from 'lucide-react';
import { NumericInput } from '@/components/ui/NumericInput';
import { usePreferences } from '@/context/PreferencesContext';

export function CurrencySettingsCard() {
  const { t, exchangeRate, setExchangeRate } = usePreferences();

  return (
    <div className="clay-card-static h-full p-4 sm:p-6 md:p-8 flex flex-col relative overflow-hidden bg-white group hover:border-blue-200 transition-colors">
      {/* Decor */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
          <RotateCw size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-bakery-text leading-none">{t('settings.rate_settings') || 'Currency'}</h3>
          <p className="text-xs font-bold text-bakery-muted uppercase tracking-wider mt-1 opacity-60">USD Conversion</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        <div className="space-y-2">
          <label className="text-xs font-black text-bakery-muted uppercase tracking-widest pl-1">Base Rate (1 USD)</label>
          
          <div className="relative group/input">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-50 rounded-l-2xl flex items-center justify-center border-r border-gray-100 text-gray-400 font-black text-sm z-10 transition-colors group-focus-within/input:text-blue-500 group-focus-within/input:bg-blue-50/50">
              IDR
            </div>
            <NumericInput 
              value={exchangeRate.toString()}
              onValueChange={(val) => setExchangeRate(val)}
              className="clay-input w-full !pl-20 !h-16 !text-2xl !font-black !bg-white !shadow-inner focus:!bg-white focus:!ring-4 focus:!ring-blue-500/10 transition-all text-bakery-text"
              placeholder="15000"
            />
          </div>
        </div>

        <p className="text-sm font-medium text-bakery-muted leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
          <span className="text-blue-500 font-bold">Note:</span> {t('settings.rate_description') || 'Changing this value will strictly affect all USD calculations in your reports immediately.'}
        </p>
      </div>

      {/* Footer / Status */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-bakery-muted opacity-50">Last Updated</span>
        <span className="text-xs font-bold text-bakery-text bg-gray-100 px-2 py-1 rounded-md">Just Now</span>
      </div>
    </div>
  );
}
