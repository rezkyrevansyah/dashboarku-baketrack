import { useMemo } from 'react';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayButton } from '@/components/ui/ClayButton';
import { ClayDropdown } from '@/components/ui/ClayDropdown';
import { Calendar, Package, Hash, Tag, Plus, Loader2, Save, AlertCircle } from 'lucide-react';
// import { formatCurrency } from '@/utils/format';
import { usePreferences } from '@/context/PreferencesContext';
import { NumericInput } from '@/components/ui/NumericInput';

import { TransactionFormProps } from './types';

export function TransactionForm({
  formData,
  setFormData,
  handleSubmit,
  loading,
  editingId,
  resetForm,
  productOptions,
  handleProductChange,
  total
}: TransactionFormProps) {
  const { t, formatPrice, currency } = usePreferences();

  // Calculate generic stock status
  const stockStatus = useMemo(() => {
    const product = productOptions.find(p => p.value === formData.product);
    if (!product) return null;
    
    // For editing, we technically "own" the qty we are editing, so we could subtract it conceptually, 
    // but for simplicity we just check against current global stock + current formData.qty if we wanted to be precise.
    // Here we will just use the simple check: stock vs input qty.
    
    // NOTE: Logic improvement could be to allow editing same amount even if stock is 0 (because we hold the stock), 
    // but for now strict check: input qty must be <= product.stock.
    const isInsufficient = typeof formData.qty === 'number' && formData.qty > product.stock;
    
    return {
      current: product.stock,
      isInsufficient
    };
  }, [formData.product, formData.qty, productOptions]);

  const isSubmitDisabled = loading || !formData.product || !!stockStatus?.isInsufficient;

  return (
    <div className={`clay-card-static p-4 sm:p-6 md:p-10 !rounded-[32px] sm:!rounded-[48px] shadow-2xl relative overflow-hidden transition-colors duration-500 ${editingId ? 'bg-orange-50 border-orange-200' : '!bg-white border-b-8 border-pink-100/30'}`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-100/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Calendar size={16} className="text-pink-400" />
                {t('form.date')}
              </label>
              <div className="relative group">
                <div className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors pointer-events-none scale-90 sm:scale-100">
                  <Calendar size={22} strokeWidth={2.5} />
                </div>
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="clay-input w-full !pl-10 sm:!pl-12 md:!pl-16 !py-3 sm:!py-5 !text-sm sm:!text-base !bg-white !shadow-sm !border-2 !border-gray-50 focus:!border-pink-200"
                />
              </div>
            </div>

            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Package size={16} className="text-purple-400" />
                {t('form.product_list')}
              </label>
              
              {editingId ? (
                <div className="w-full px-6 py-5 bg-purple-50 rounded-2xl border-2 border-purple-100 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                      {productOptions.find(p => p.value === formData.product)?.icon || '📦'}
                   </div>
                   <div>
                      <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">{t('form.editing')}</p>
                      <p className="text-lg font-black text-bakery-text">{formData.product}</p>
                   </div>
                </div>
              ) : (
                <div className="relative group space-y-2">
                  <ClayDropdown
                    options={productOptions}
                    value={formData.product}
                    onChange={handleProductChange}
                    placeholder={t('form.select_placeholder')}
                    required
                  />
                  {stockStatus && (
                     <div className="flex items-center justify-end px-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stockStatus.current === 0 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                           Stock: {stockStatus.current} pcs
                        </span>
                     </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Hash size={16} className="text-orange-400" />
                {t('form.quantity')}
              </label>
              <div className="relative group space-y-2">
                <div className="relative">
                    <div className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-orange-300 group-focus-within:text-orange-500 transition-colors pointer-events-none scale-90 sm:scale-100">
                      <Hash size={22} strokeWidth={2.5} />
                    </div>
                    <NumericInput 
                      required
                      value={formData.qty}
                      onValueChange={(val) => setFormData({...formData, qty: val === 0 ? '' : val})}
                      className={`clay-input w-full !pl-10 sm:!pl-12 md:!pl-16 !py-3 sm:!py-5 !text-sm sm:!text-base !bg-white !shadow-sm !border-2 focus:!border-orange-200 ${stockStatus?.isInsufficient ? '!border-red-200 !text-red-500' : '!border-gray-50'}`}
                      placeholder={t('form.qty_placeholder')}
                    />
                </div>
                {stockStatus?.isInsufficient && (
                  <div className="flex items-center gap-2 text-red-500 px-2 animate-in slide-in-from-top-1">
                     <AlertCircle size={14} />
                     <span className="text-xs font-bold">Stok tidak mencukupi (Max: {stockStatus.current})</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Tag size={16} className="text-blue-400" />
                {t('form.price_unit')}
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none scale-90 sm:scale-100">
                  <Tag size={22} strokeWidth={2.5} />
                </div>
                <div className="clay-input w-full !pl-10 sm:!pl-12 md:!pl-16 !py-3 sm:!py-5 !text-sm sm:!text-base !bg-gray-50/50 font-black text-bakery-text/40 flex items-center justify-between border-dashed border-2">
                   <span>{currency}</span> 
                   <span className="text-bakery-text">{formatPrice(formData.price)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[2px] bg-gradient-to-r from-transparent via-pink-100 to-transparent my-12">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center shadow-sm border-2 border-white">
                🧁
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white via-pink-50/20 to-pink-50/40 p-4 sm:p-8 rounded-[40px] border-4 border-white shadow-inner">
              <div className="flex items-center gap-6 pl-2">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl border-2 border-pink-100/50 shrink-0">
                    <img src="/icons/total-bayar.png" alt="Total" className="w-10 h-10 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-4xl sm:text-5xl font-black text-bakery-pink truncate">
                      {formatPrice(total)}
                    </h2>
                  </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <ClayButton 
                  type="submit" 
                  disabled={isSubmitDisabled}
                  className={`w-full sm:w-auto h-16 px-10 text-lg flex items-center justify-center gap-3 !rounded-[22px] shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all font-black ${editingId ? '!bg-orange-500 hover:!bg-orange-600' : ''} ${isSubmitDisabled ? 'opacity-50 grayscale cursor-not-allowed !transform-none !shadow-none' : ''}`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : editingId ? (
                    <Save size={28} strokeWidth={3} />
                  ) : (
                    <Plus size={28} strokeWidth={3} />
                  )}
                  {loading ? (editingId ? t('form.updating') : t('form.saving')) : (editingId ? t('form.update') : t('common.save').toUpperCase())}
                </ClayButton>
              </div>
            </div>
          </div>
        </form>
    </div>
  );
}
