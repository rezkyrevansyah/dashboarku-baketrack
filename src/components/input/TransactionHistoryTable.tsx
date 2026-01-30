import { ClayCard } from '@/components/ui/ClayCard';
import { Pagination } from '@/components/ui/Pagination';
import { Search, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '@/services/api';
import { formatDate, formatCurrency } from '@/utils/format';

type TransactionHistoryTableProps = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  tableData: Transaction[];
  sortConfig: { key: keyof Transaction; direction: 'asc' | 'desc' } | null;
  handleSort: (key: keyof Transaction) => void;
  productOptions: { value: string; icon: string }[];
  handleEdit: (t: Transaction) => void;
  confirmDelete: (t: Transaction) => void;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
};

export function TransactionHistoryTable({
  searchQuery,
  setSearchQuery,
  tableData,
  sortConfig,
  handleSort,
  productOptions,
  handleEdit,
  confirmDelete,
  currentPage,
  totalPages,
  goToPage
}: TransactionHistoryTableProps) {
  return (
    <div className="mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
           <h3 className="text-2xl font-black text-bakery-text flex items-center gap-2">
             🕒 Riwayat Transaksi
           </h3>
           <div className="relative group w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clay-input !pl-11 !py-3 w-full !text-sm !bg-white focus:!border-pink-300"
              />
           </div>
        </div>
        
        <ClayCard className="!bg-white !rounded-[32px] overflow-hidden shadow-clay-card p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-pink-50/50 text-bakery-muted uppercase text-xs font-black tracking-widest">
                <tr>
                   <th 
                    className="px-6 py-5 cursor-pointer hover:bg-pink-100/50 transition-colors select-none"
                    onClick={() => handleSort('date')}
                   >
                     <div className="flex items-center gap-2">
                       Tanggal
                       {sortConfig?.key === 'date' && (
                         sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                       )}
                     </div>
                   </th>
                   <th className="px-6 py-5">Produk</th>
                   <th className="px-6 py-5 text-right">Qty</th>
                   <th 
                    className="px-6 py-5 text-right cursor-pointer hover:bg-pink-100/50 transition-colors select-none"
                    onClick={() => handleSort('total')}
                   >
                     <div className="flex items-center justify-end gap-2">
                       Total
                       {sortConfig?.key === 'total' && (
                         sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                       )}
                     </div>
                   </th>
                   <th className="px-6 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                 {tableData.map((t, idx) => (
                    <tr key={t.id || idx} className="hover:bg-pink-50/10 transition-colors group">
                       <td className="px-6 py-4 font-bold text-bakery-text">
                         {formatDate(t.date)}
                       </td>
                       <td className="px-6 py-4 font-bold text-bakery-text flex items-center gap-3">
                         <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm border border-gray-100">
                           {productOptions.find(p => p.value === t.product)?.icon || '📦'}
                         </span>
                         {t.product}
                       </td>
                       <td className="px-6 py-4 font-bold text-bakery-text text-right">
                         {t.qty}
                       </td>
                       <td className="px-6 py-4 font-bold text-bakery-pink text-right">
                         {formatCurrency(t.total)}
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2 transition-opacity">
                             <button 
                               onClick={() => handleEdit(t)} 
                               className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
                               title="Edit"
                             >
                                <Edit2 size={16} />
                             </button>
                             <button 
                                onClick={() => confirmDelete(t)}
                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                                title="Hapus"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {tableData.length === 0 && (
                    <tr>
                       <td colSpan={5} className="py-12 text-center text-bakery-muted font-bold opacity-50">
                          {searchQuery ? 'Tidak ada transaksi ditemukan' : 'Belum ada transaksi'}
                       </td>
                    </tr>
                 )}
              </tbody>
            </table>
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </ClayCard>
      </div>
  );
}
