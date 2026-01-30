'use client';

import { useState, useMemo } from 'react';
import { submitTransaction, deleteTransaction, Transaction } from '@/services/api';
import { X } from 'lucide-react';
import { useTable } from '@/hooks/useTable';
import { useDashboard } from '@/context/DashboardContext';
import { SyncButton } from '@/components/ui/SyncButton';
import { TransactionForm } from '@/components/input/TransactionForm';
import { TransactionHistoryTable } from '@/components/input/TransactionHistoryTable';
import { DeleteTransactionModal } from '@/components/input/DeleteTransactionModal';

export default function InputPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    date: string;
    product: string;
    qty: number | '';
    price: number;
  }>({
    date: new Date().toISOString().split('T')[0],
    product: '',
    qty: '',
    price: 0
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState<Transaction | null>(null);

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

  // Table Logic
  const { 
    data: tableData,
    totalPages,
    currentPage,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    goToPage
  } = useTable({
    data: data?.transactions || [],
    itemsPerPage: 20, 
    initialSort: { key: 'date', direction: 'desc' },
    filterFn: (item, query) => item.product.toLowerCase().includes(query.toLowerCase())
  });

  const handleProductChange = (productValue: string) => {
    const selected = productOptions.find(p => p.value === productValue);
    setFormData(prev => ({
      ...prev,
      product: productValue,
      price: selected ? Number(selected.price) : prev.price
    }));
  };

  const total = (formData.qty === '' ? 0 : formData.qty) * formData.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product) return;
    
    setLoading(true);
    
    // Default to 1 if empty
    const finalQty = formData.qty === '' ? 1 : formData.qty;
    const finalTotal = finalQty * formData.price;
    
    const transactionData: Transaction = {
      ...formData, 
      qty: finalQty,
      total: finalTotal,
      id: editingId || undefined // Send ID if editing
    };

    const success = await submitTransaction(transactionData, !!editingId);
    
    if (success) {
      await refreshData();
      resetForm();
    } else {
      alert('Gagal menyimpan ke Google Sheets. Silakan coba lagi.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: '',
      qty: '',
      price: 0
    });
    setEditingId(null);
  };

  const handleEdit = (t: Transaction) => {
    let dateStr = '';
    try {
        const d = new Date(t.date);
        dateStr = d.toISOString().split('T')[0];
    } catch (e) {
        dateStr = ''; 
    }

    const productName = t.product.trim();

    setFormData({
      date: dateStr,
      product: productName, 
      qty: t.qty,
      price: t.price
    });
    setEditingId(t.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (t: Transaction) => {
    setMsgToDelete(t);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!msgToDelete?.id) return;
    setLoading(true);
    const success = await deleteTransaction(msgToDelete.id);
    if (success) {
      await refreshData();
      setIsDeleteModalOpen(false);
      setMsgToDelete(null);
    } else {
      alert('Gagal menghapus transaksi.');
    }
    setLoading(false);
  };

  if (dataLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-bakery-muted font-black uppercase tracking-widest text-sm">Loading Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 px-4">
        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-4xl shadow-clay-floating border-4 border-white transform hover:rotate-6 transition-transform">
          ✏️
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black text-bakery-text tracking-tighter leading-none mb-3">Input Penjualan</h1>
          <p className="text-bakery-muted font-extrabold text-lg opacity-80 uppercase tracking-widest">
            {editingId ? 'Mode Edit Transaksi' : 'Catat Transaksi Baru'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {editingId && (
            <button onClick={resetForm} className="flex items-center gap-2 bg-red-100 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors h-12">
                <X size={18} /> Batal
            </button>
           )}
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
        handleProductChange={handleProductChange}
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
      />

      <DeleteTransactionModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        transaction={msgToDelete}
      />
    </div>
  );
}
