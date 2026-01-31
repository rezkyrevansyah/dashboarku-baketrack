'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useTable } from '@/hooks/useTable';
import { useTransactionHandlers } from '@/hooks/useTransactionHandlers';
import { SyncButton } from '@/components/ui/SyncButton';
import { TransactionForm } from '@/components/input/TransactionForm';
import { TransactionHistoryTable } from '@/components/input/TransactionHistoryTable';
import { DeleteTransactionModal } from '@/components/input/DeleteTransactionModal';
import { LanguageCurrencySwitcher } from '@/components/ui/LanguageCurrencySwitcher';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
      icon: p.image
    }));
  }, [data]);

  // Transaction CRUD handlers
  const {
    loading,
    formData,
    setFormData,
    editingId,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    transactionToDelete,
    resetForm,
    handleSubmit,
    handleEdit,
    confirmDelete,
    handleDelete,
    handleProductChange,
    total
  } = useTransactionHandlers({ refreshData });

  // Table Logic
  const { 
    data: tableData,
    totalPages,
    currentPage,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    goToPage,
    itemsPerPage, 
    setItemsPerPage,
    totalItems
  } = useTable({
    data: data?.transactions || [],
    itemsPerPage: 5, 
    initialSort: { key: 'date', direction: 'desc' },
    filterFn: (item, query) => item.product.toLowerCase().includes(query.toLowerCase())
  });

  if (dataLoading && !data) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 px-4">
        {/* Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-[24px] sm:rounded-[32px] flex items-center justify-center text-2xl sm:text-4xl shadow-clay-floating border-4 border-white transform hover:rotate-6 transition-transform flex-shrink-0">
          <img src="/icons/input-penjualan.png" alt="Input" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left flex-1 w-full md:w-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-bakery-text tracking-tighter leading-none mb-2 sm:mb-3">{t('input.title')}</h1>
          <p className="text-bakery-muted font-extrabold text-sm sm:text-lg opacity-80 uppercase tracking-widest">
            {editingId ? t('input.mode_edit') : t('input.mode_new')}
          </p>
        </div>
        
        {/* Actions */}
        <div className="w-full md:w-auto flex flex-wrap justify-center items-center gap-3">
           {editingId && (
            <button onClick={resetForm} className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors h-12">
                <X size={18} /> {t('common.cancel')}
            </button>
           )}
           <LanguageCurrencySwitcher />
           <SyncButton variant="compact" />
        </div>
      </div>

      <TransactionForm 
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        loading={loading}
        editingId={editingId}
        resetForm={resetForm}
        productOptions={productOptions}
        handleProductChange={(val) => handleProductChange(val, productOptions)}
        total={total}
      />

      <TransactionHistoryTable 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tableData={tableData}
        sortConfig={sortConfig}
        handleSort={handleSort}
        productOptions={productOptions}
        handleEdit={handleEdit}
        confirmDelete={confirmDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
      />

      <DeleteTransactionModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        transaction={transactionToDelete}
      />
    </div>
  );
}
