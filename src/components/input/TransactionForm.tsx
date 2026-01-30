import { ClayCard } from '@/components/ui/ClayCard';
import { ClayButton } from '@/components/ui/ClayButton';
import { ClayDropdown } from '@/components/ui/ClayDropdown';
import { Calendar, Package, Hash, Tag, Plus, Loader2, Save, X } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

type FormData = {
  date: string;
  product: string;
  qty: number | '';
  price: number;
};

type TransactionFormProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  editingId: string | null;
  resetForm: () => void;
  productOptions: { value: string; label: string; price: number; icon: string }[];
  handleProductChange: (val: string) => void;
  total: number;
};

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
  return (
    <ClayCard className={`p-10 !rounded-[48px] shadow-2xl relative overflow-hidden transition-colors duration-500 ${editingId ? 'bg-orange-50 border-orange-200' : '!bg-white border-b-8 border-pink-100/30'}`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-100/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Calendar size={16} className="text-pink-400" />
                Tanggal Transaksi
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors pointer-events-none">
                  <Calendar size={22} strokeWidth={2.5} />
                </div>
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="clay-input w-full !pl-16 !py-5 !bg-white !shadow-sm !border-2 !border-gray-50 focus:!border-pink-200"
                />
              </div>
            </div>

            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Package size={16} className="text-purple-400" />
                Daftar Produk
              </label>
              
              {editingId ? (
                <div className="w-full px-6 py-5 bg-purple-50 rounded-2xl border-2 border-purple-100 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                      {productOptions.find(p => p.value === formData.product)?.icon || '📦'}
                   </div>
                   <div>
                      <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">Sedang Mengedit</p>
                      <p className="text-lg font-black text-bakery-text">{formData.product}</p>
                   </div>
                </div>
              ) : (
                <div className="relative group">
                  <ClayDropdown
                    options={productOptions}
                    value={formData.product}
                    onChange={handleProductChange}
                    placeholder="Cari & Pilih Produk..."
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Hash size={16} className="text-orange-400" />
                Jumlah Pesanan
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-300 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                  <Hash size={22} strokeWidth={2.5} />
                </div>
                <input 
                  type="number"
                  min="1"
                  required
                  value={formData.qty}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') {
                        setFormData({...formData, qty: ''});
                    } else {
                        setFormData({...formData, qty: parseInt(val) || 0});
                    }
                  }}
                  className="clay-input w-full !pl-16 !py-5 !bg-white !shadow-sm !border-2 !border-gray-50 focus:!border-orange-200"
                  placeholder="Contoh: 5"
                />
              </div>
            </div>

            <div className="space-y-7">
              <label className="clay-label !text-sm !mb-0 flex items-center gap-2 px-1">
                <Tag size={16} className="text-blue-400" />
                Harga per Satuan
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none">
                  <Tag size={22} strokeWidth={2.5} />
                </div>
                <div className="clay-input w-full !pl-16 !py-5 !bg-gray-50/50 font-black text-bakery-text/40 flex items-center justify-between border-dashed border-2">
                   <span>IDR</span>
                   <span className="text-bakery-text">{formatCurrency(formData.price).replace('Rp', '').trim()}</span>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white via-pink-50/20 to-pink-50/40 p-8 rounded-[40px] border-4 border-white shadow-inner">
              <div className="flex items-center gap-6 pl-2">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl border-2 border-pink-100/50 shrink-0">
                    💰
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-bakery-muted font-black uppercase tracking-[0.25em] mb-1 opacity-60">Total Bayar</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-bakery-pink truncate">
                      {formatCurrency(total)}
                    </h2>
                  </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <ClayButton 
                  type="submit" 
                  disabled={loading || !formData.product}
                  className={`w-full sm:w-auto h-16 px-10 text-lg flex items-center justify-center gap-3 !rounded-[22px] shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all font-black ${editingId ? '!bg-orange-500 hover:!bg-orange-600' : ''}`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : editingId ? (
                    <Save size={28} strokeWidth={3} />
                  ) : (
                    <Plus size={28} strokeWidth={3} />
                  )}
                  {loading ? (editingId ? 'UPDATING...' : 'MENYIMPAN...') : (editingId ? 'UPDATE' : 'SIMPAN')}
                </ClayButton>
              </div>
            </div>
          </div>
        </form>
      </ClayCard>
  );
}
