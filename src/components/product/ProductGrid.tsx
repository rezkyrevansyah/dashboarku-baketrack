'use client';

import { Edit2, Trash2, Box } from 'lucide-react';
import { Product } from '@/services/api';
import { usePreferences } from '@/context/PreferencesContext';

interface ProductGridProps {
  products: Product[];
  isSubmitting: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductGrid({ products, isSubmitting, onEdit, onDelete }: ProductGridProps) {
  const { t, formatPrice } = usePreferences();

  if (products.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
         <div className="text-6xl mb-4">🥐</div>
         <p className="text-bakery-muted font-bold">{t('product.no_products_found')}</p>
      </div>
    );
  }

  return (
    <>
      {products.map((product) => {
        const isOOS = product.stock <= 0;
        return (
        <div 
          key={product.id} 
          className={`clay-card-static group relative flex items-center gap-6 p-6 !rounded-[32px] hover:scale-[1.02] transition-all duration-300 border 
            ${isOOS 
              ? 'bg-gray-50/50 border-gray-200 opacity-80 hover:opacity-100 grayscale-[0.8] hover:grayscale-0' 
              : 'bg-white border-pink-50/50'}`}
        >
          <div className={`w-24 h-24 rounded-[28px] flex items-center justify-center text-4xl shadow-inner border border-white/80 shrink-0 transform group-hover:-rotate-3 transition-transform ${isOOS ? 'bg-gray-100' : 'bg-gradient-to-br from-white to-pink-50'}`}>
             {product.image.startsWith('http') ? (
               <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-[24px]" />
             ) : (
               product.image
             )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-black text-2xl truncate mb-1 ${isOOS ? 'text-gray-500 line-through decoration-2 decoration-red-400' : 'text-bakery-text'}`}>{product.name}</h3>
            <div className="flex items-center gap-4 text-sm font-bold opacity-60 mb-4">
               {isOOS ? (
                 <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold animate-pulse">
                   STOK HABIS
                 </span>
               ) : (
                 <span className="bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                    {product.sold.toLocaleString()} {t('product.sold_label')}
                 </span>
               )}
            </div>
            
            <div className="flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-xs font-black text-bakery-muted/50 uppercase tracking-widest mb-1">{t('product.price_label')}</span>
                  <span className={`text-xl font-black ${isOOS ? 'text-gray-400' : 'text-bakery-pink'}`}>{formatPrice(Number(product.price))}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-bakery-muted/50 uppercase tracking-widest mb-1">{t('product.stock_label')}</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${isOOS ? 'text-red-400' : 'text-bakery-text'}`}>
                     <Box size={14} className={isOOS ? 'text-red-400' : 'text-orange-400'} /> {product.stock} pcs
                  </span>
               </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
             <button 
              onClick={() => onEdit(product)}
              disabled={isSubmitting}
              className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm hover:bg-blue-500 hover:text-white transition-all"
             >
                <Edit2 size={16} />
             </button>
             <button 
              onClick={() => onDelete(product)}
              disabled={isSubmitting}
              className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all"
             >
                <Trash2 size={16} />
             </button>
          </div>
        </div>
      );
    })}
    </>
  );
}
