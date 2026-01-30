import { ClayCard } from '@/components/ui/ClayCard';
import { Loader2 } from 'lucide-react';
import { Transaction } from '@/services/api';
import { formatCurrency } from '@/utils/format';

type DeleteTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  transaction: Transaction | null;
};

export function DeleteTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  transaction
}: DeleteTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-black/10 animate-in fade-in zoom-in-95 duration-200">
      <ClayCard className="w-full max-w-sm !rounded-[40px] !bg-white p-10 shadow-2xl text-center relative overflow-hidden">
         <div className="w-20 h-20 bg-red-50 rounded-[30px] flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner border border-red-100/50 animate-bounce">
            ⚠️
         </div>
         
         <h2 className="text-2xl font-black text-bakery-text mb-2">Hapus Transaksi?</h2>
         <p className="text-bakery-muted font-bold text-sm mb-8">
            Yakin hapus transaksi <span className="text-red-500">{transaction?.product}</span> senilai <span className="text-bakery-pink">{transaction ? formatCurrency(transaction.total) : ''}</span>?
         </p>

         <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onClose}
              disabled={loading}
              className="h-12 rounded-2xl bg-gray-50 text-bakery-muted font-black hover:bg-gray-100 transition-all border-b-4 border-gray-200"
            >
               BATAL
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="h-12 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200 border-b-4 border-red-700 flex items-center justify-center"
            >
               {loading ? <Loader2 size={20} className="animate-spin" /> : 'YA, HAPUS'}
            </button>
         </div>
      </ClayCard>
    </div>
  );
}
