import { ClayCard } from '@/components/ui/ClayCard';
import { Pagination } from '@/components/ui/Pagination';
import { Search, ChevronDown, ChevronUp, Download, ShoppingBag } from 'lucide-react';
import { Transaction } from '@/services/api';
import { formatDate, formatCurrency } from '@/utils/format';

type ReportTableProps = {
  totalTx: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleExportCSV: () => void;
  tableData: Transaction[];
  sortConfig: { key: keyof Transaction; direction: 'asc' | 'desc' } | null;
  handleSort: (key: keyof Transaction) => void;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
};

export function ReportTable({
  totalTx,
  searchQuery,
  setSearchQuery,
  handleExportCSV,
  tableData,
  sortConfig,
  handleSort,
  currentPage,
  totalPages,
  goToPage
}: ReportTableProps) {
  return (
    <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
            <div>
               <h3 className="text-2xl font-black text-bakery-text flex items-center gap-2">
                 📋 Detail Transaksi
                 <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{totalTx} total</span>
               </h3>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative group w-full md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Cari transaksi..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="clay-input !pl-11 !py-2.5 w-full !text-sm !bg-white focus:!border-pink-300 !shadow-sm"
                  />
               </div>
               <button 
                  onClick={handleExportCSV}
                  className="h-11 px-5 flex items-center gap-2 bg-white border-2 border-green-100 text-green-600 rounded-xl font-bold hover:bg-green-50 transition-all shadow-sm hover:translate-y-0 active:translate-y-0"
               >
                  <Download size={18} />
                  <span className="hidden sm:inline">Download Report</span>
               </button>
            </div>
         </div>

         <ClayCard className="!bg-white rounded-2xl overflow-hidden border border-gray-100 p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-pink-50/30 text-bakery-muted uppercase text-xs font-black tracking-widest">
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
                        <th className="px-6 py-5 text-right">Harga</th>
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
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                     {tableData.length > 0 ? tableData.map((t, i) => (
                        <tr key={i} className="hover:bg-pink-50/10 transition-colors">
                           <td className="px-6 py-4 font-bold text-bakery-text">
                              {formatDate(t.date)}
                           </td>
                           <td className="px-6 py-4 font-bold text-bakery-text">
                              {t.product}
                           </td>
                           <td className="px-6 py-4 font-bold text-bakery-text text-right text-gray-500">
                              {t.qty}
                           </td>
                           <td className="px-6 py-4 font-bold text-bakery-text text-right text-gray-500">
                              {formatCurrency(t.price)}
                           </td>
                           <td className="px-6 py-4 font-black text-bakery-pink text-right">
                              {formatCurrency(t.total)}
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={5} className="py-12 text-center">
                              <div className="flex flex-col items-center justify-center opacity-40">
                                 <ShoppingBag size={48} className="mb-4" />
                                 <p className="font-bold text-bakery-text">
                                    {searchQuery ? 'Tidak ada transaksi ditemukan' : 'Belum ada data'}
                                 </p>
                              </div>
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
