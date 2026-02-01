'use client';

import { useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useTransactionHandlers } from '@/hooks/useTransactionHandlers';
import { TransactionForm } from '@/components/input/TransactionForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GlobalToolbar } from '@/components/ui/GlobalToolbar';

export default function InputPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
  const { t } = usePreferences();

  // Get products from global state
  const productOptions = useMemo(() => {
    if (!data?.products) return [];
    return data.products.map(p => ({
      value: p.name,
      label: p.name,
      price: p.price,
      icon: p.image,
      stock: p.stock,
      sold: p.sold,
      id: p.id
    }));
  }, [data]);

  // Transaction CRUD handlers
  const {
    loading,
    formData,
    setFormData,
    editingId,
    resetForm,
    handleSubmit,
    handleProductChange,
    total
  } = useTransactionHandlers({ refreshData });

  const onProductChange = useCallback((val: string) => {
    handleProductChange(val, productOptions);
  }, [handleProductChange, productOptions]);
  
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    // We pass the full productOptions here so the handler can access IDs and Stock
    await handleSubmit(e, productOptions);
  }, [handleSubmit, productOptions]);

  if (dataLoading && !data) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* --- HEADER (MATCHING PRODUCT PAGE STRUCTURE) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-4 md:pt-6">
        <div>
          <h1 className="text-4xl font-black text-bakery-text tracking-tight mb-2">
            {t('input.title')}
          </h1>
          <p className="text-bakery-muted font-bold text-sm tracking-wide opacity-70 uppercase">
             {editingId ? t('input.mode_edit') : t('input.mode_new')}
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-4">
           {/* Mobile: Full width buttons, Desktop: Auto */}
           <div className="flex justify-start md:justify-center">
              <GlobalToolbar />
           </div>

           {editingId && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={resetForm}
                className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2.5 rounded-2xl font-bold hover:bg-red-200 transition-colors h-12 shadow-sm"
              >
                  <X size={18} /> {t('common.cancel')}
              </button>
            </div>
           )}
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 gap-8 px-4">
        
        {/* Transaction Form Wrapper */}
        <div className="w-full">
           <TransactionForm 
              formData={formData}
              setFormData={setFormData}
              handleSubmit={onSubmit}
              loading={loading}
              editingId={editingId}
              resetForm={resetForm}
              productOptions={productOptions}
              handleProductChange={onProductChange}
              total={total}
            />
        </div>

      </div>
    </div>
  );
}
