import { useState, useCallback } from 'react';
import { submitTransaction, deleteTransaction, manageProduct, Transaction } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  date: string;
  product: string;
  qty: number | '';
  price: number;
}

interface UseTransactionHandlersProps {
  refreshData: () => Promise<void>;
}

export function useTransactionHandlers({ refreshData }: UseTransactionHandlersProps) {
  const { user } = useAuth(); // Get current logged-in user
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    product: '',
    qty: '',
    price: 0
  });

  const resetForm = useCallback(() => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: '',
      qty: '',
      price: 0
    });
    setEditingId(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent, productOptions?: { value: string; stock?: number; sold?: number; id?: number }[]) => {
    e.preventDefault();
    if (!formData.product) return;
    
    setLoading(true);
    
    const finalQty = formData.qty === '' ? 1 : formData.qty;
    const finalTotal = finalQty * formData.price;
    
    const transactionData: Transaction = {
      ...formData, 
      qty: finalQty,
      total: finalTotal,
      id: editingId || undefined,
      addedBy: user?.name || user?.email || 'Unknown' // Attach User Audit Trail
    };

    const success = await submitTransaction(transactionData, !!editingId);
    
    if (success) {
      // --- LOGIC TAMBAHAN: UPDATE STOCK & SOLD (Hanya untuk Transaksi Baru) ---
      if (!editingId && productOptions) {
        const productInfo = productOptions.find(p => p.value === formData.product);
        
        // Ensure we have ID and stock/sold data before updating
        if (productInfo && productInfo.id !== undefined && productInfo.stock !== undefined && productInfo.sold !== undefined) {
          const newStock = Math.max(0, productInfo.stock - finalQty); // Prevent negative
          const newSold = productInfo.sold + finalQty;

          // Update Product Backend
          await manageProduct('update', {
            id: productInfo.id,
            stock: newStock,
            sold: newSold
          });
        }
      }
      
      await refreshData();
      resetForm();
    } else {
      alert('Gagal menyimpan ke Google Sheets. Silakan coba lagi.');
    }
    setLoading(false);
  }, [formData, user, editingId, refreshData, resetForm]);

  const handleEdit = useCallback((t: Transaction) => {
    let dateStr = '';
    try {
      const d = new Date(t.date);
      dateStr = d.toISOString().split('T')[0];
    } catch (e) {
      dateStr = ''; 
    }

    setFormData({
      date: dateStr,
      product: t.product.trim(), 
      qty: t.qty,
      price: t.price
    });
    setEditingId(t.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const confirmDelete = useCallback((t: Transaction) => {
    setTransactionToDelete(t);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!transactionToDelete?.id) return;
    setLoading(true);
    const success = await deleteTransaction(transactionToDelete.id);
    if (success) {
      await refreshData();
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    } else {
      alert('Gagal menghapus transaksi.');
    }
    setLoading(false);
  }, [transactionToDelete, refreshData]);

  const handleProductChange = useCallback((productValue: string, productOptions: { value: string; price: number }[]) => {
    const selected = productOptions.find(p => p.value === productValue);
    setFormData(prev => ({
      ...prev,
      product: productValue,
      price: selected ? Number(selected.price) : prev.price
    }));
  }, []);

  return {
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
    total: (formData.qty === '' ? 0 : formData.qty) * formData.price
  };
}
