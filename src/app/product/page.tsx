'use client';

import { useState, useMemo } from 'react';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayButton } from '@/components/ui/ClayButton';
import { Edit2, Trash2, Plus, Box, Search, X, Tag, Hash, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { manageProduct } from '@/services/api';
import { SyncButton } from '@/components/ui/SyncButton';

export default function ProductPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image: '🧁'
  });

  const products = data?.products || [];

  // Filtered products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handle Modal Open
  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '', image: '🧁' });
    }
    setIsModalOpen(true);
  };

  // Handle CRUD: Create/Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const action = editingProduct ? 'update' : 'create';
    const id = editingProduct ? editingProduct.id : Date.now(); // Simple ID for new products
    
    const success = await manageProduct(action, {
      id: Number(id),
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image
    });

    if (success) {
      await refreshData();
      setIsModalOpen(false);
    } else {
      alert('Gagal menyimpan produk ke Google Sheets.');
    }
    setIsSubmitting(false);
  };

  // Handle CRUD: Delete Confirmation
  const confirmDelete = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      setIsSubmitting(true);
      const success = await manageProduct('delete', { id: productToDelete.id });
      
      if (success) {
        await refreshData();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        alert('Gagal menghapus produk.');
      }
      setIsSubmitting(false);
    }
  };

  if (dataLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-bakery-muted font-black uppercase tracking-widest text-sm">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black text-bakery-text tracking-tight mb-2">Manajemen Produk</h1>
          <p className="text-bakery-muted font-bold text-sm tracking-wide opacity-70 uppercase">
             Kelola daftar roti & kue harian kamu
          </p>
        </div>

        <div className="flex items-center gap-4">
           <SyncButton variant="compact" />
           
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clay-input !pl-12 !py-3 w-full md:w-64 bg-white/60 focus:bg-white !rounded-2xl transition-all shadow-sm"
              />
           </div>
           
           <ClayButton onClick={() => openModal()} className="!rounded-2xl !px-6 flex items-center gap-2 h-12 shadow-lg">
              <Plus size={20} strokeWidth={3} />
              <span className="font-bold hidden sm:inline">Tambah</span>
           </ClayButton>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
        {filteredProducts.map((product) => (
          <ClayCard key={product.id} className="group relative flex items-center gap-6 p-6 !rounded-[32px] hover:scale-[1.02] transition-all duration-300 shadow-clay-card bg-white border border-pink-50/50">
            <div className="w-24 h-24 bg-gradient-to-br from-white to-pink-50 rounded-[28px] flex items-center justify-center text-4xl shadow-inner border border-white/80 shrink-0 transform group-hover:-rotate-3 transition-transform">
               {product.image.startsWith('http') ? (
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-[24px]" />
               ) : (
                 product.image
               )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-2xl text-bakery-text truncate mb-1">{product.name}</h3>
              <div className="flex items-center gap-4 text-sm font-bold opacity-60 mb-4">
                 <span className="bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                    {product.sold.toLocaleString()} Terjual
                 </span>
              </div>
              
              <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-xs font-black text-bakery-muted/50 uppercase tracking-widest mb-1">Harga</span>
                    <span className="text-xl font-black text-bakery-pink">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-bakery-muted/50 uppercase tracking-widest mb-1">Stok</span>
                    <span className="text-sm font-bold flex items-center gap-1 text-bakery-text">
                       <Box size={14} className="text-orange-400" /> {product.stock} pcs
                    </span>
                 </div>
              </div>
            </div>

            <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
               <button 
                onClick={() => openModal(product)}
                disabled={isSubmitting}
                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm hover:bg-blue-500 hover:text-white transition-all"
               >
                  <Edit2 size={16} />
               </button>
               <button 
                onClick={() => confirmDelete(product)}
                disabled={isSubmitting}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all"
               >
                  <Trash2 size={16} />
               </button>
            </div>
          </ClayCard>
        ))}

        {!dataLoading && filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="text-6xl mb-4">🥐</div>
             <p className="text-bakery-muted font-bold">Produk tidak ditemukan...</p>
          </div>
        )}
      </div>

      {/* CRUD Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/5 animate-in fade-in duration-300">
          <ClayCard className="w-full max-w-md !rounded-[40px] !bg-white p-10 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-bakery-text">{editingProduct ? 'Edit Produk' : 'Produk Baru'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
                   <X size={20} />
                </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} className="text-pink-400" /> Nama Produk
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Contoh: Croissant Coklat"
                    className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                      <Hash size={14} className="text-blue-400" /> Harga
                    </label>
                    <input 
                      type="number"
                      required
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="8000"
                      className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                      <Box size={14} className="text-orange-400" /> Stok
                    </label>
                    <input 
                      type="number"
                      required
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      placeholder="50"
                      className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} className="text-purple-400" /> Icon Produk
                  </label>
                  <div className="mb-2">
                    <input 
                      type="text"
                      required
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="Emoji atau URL"
                      className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white mb-3"
                    />
                  </div>
                  <div className="flex gap-3 p-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    {['🧁', '🍩', '🥐', '🍞', '🍰'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({...formData, image: emoji})}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${formData.image === emoji ? 'bg-white shadow-clay-floating scale-110 border-2 border-pink-100' : 'hover:bg-white/50 opacity-40 hover:opacity-100'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <ClayButton type="submit" disabled={isSubmitting} className="w-full !rounded-2xl h-14 text-lg font-black shadow-xl">
                     {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : (editingProduct ? 'SIMPAN PERUBAHAN' : 'TAMBAH PRODUK')}
                  </ClayButton>
                </div>
             </form>

             <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-pink-100/30 rounded-full blur-3xl pointer-events-none"></div>
          </ClayCard>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-black/10 animate-in fade-in zoom-in-95 duration-200">
          <ClayCard className="w-full max-w-sm !rounded-[40px] !bg-white p-10 shadow-2xl text-center relative overflow-hidden">
             <div className="w-20 h-20 bg-red-50 rounded-[30px] flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner border border-red-100/50 animate-bounce">
                ⚠️
             </div>
             
             <h2 className="text-3xl font-black text-bakery-text mb-2">Hapus Produk?</h2>
             <p className="text-bakery-muted font-bold text-sm mb-8">
                Apakah kamu yakin ingin menghapus <span className="text-red-500 italic">"{productToDelete?.name}"</span>? Produk yang dihapus tidak bisa dikembalikan.
             </p>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="h-14 rounded-2xl bg-gray-50 text-bakery-muted font-black hover:bg-gray-100 transition-all border-b-4 border-gray-200"
                >
                   BATAL
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="h-14 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200 border-b-4 border-red-700 flex items-center justify-center"
                >
                   {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'YA, HAPUS'}
                </button>
             </div>

             <div className="absolute -left-10 -top-10 w-32 h-32 bg-red-50/50 rounded-full blur-3xl pointer-events-none"></div>
          </ClayCard>
        </div>
      )}
    </div>
  );
}
