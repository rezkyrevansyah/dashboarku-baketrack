import { ClayCard } from '@/components/ui/ClayCard';

type TopProduct = {
  name: string;
  sold: number;
  icon: string;
};

export function TopProductsCard({ products }: { products: TopProduct[] }) {
  return (
    <ClayCard className="!bg-white p-6 h-48 flex flex-col border border-pink-50 rounded-2xl">
         <h3 className="font-black text-sm mb-4 text-bakery-text flex items-center gap-2 uppercase tracking-wide">
           🏆 Produk Terlaris
         </h3>
         <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {products.length > 0 ? products.map((p, i) => (
               <div key={i} className="flex items-center gap-3 group hover:bg-pink-50 p-1.5 rounded-lg transition-colors">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-pink-50 flex items-center justify-center text-lg border border-pink-100/50">
                     {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-black text-bakery-text truncate">{p.name}</p>
                     <p className="text-[10px] font-bold text-bakery-muted opacity-80">{p.sold} terjual</p>
                  </div>
                  <div className={`w-1.5 h-1.5 shrink-0 rounded-full bg-pink-400`}></div>
               </div>
             )) : (
               <div className="h-full flex items-center justify-center">
                 <p className="text-center text-bakery-muted font-bold text-xs opacity-50">Belum ada data</p>
               </div>
             )}
         </div>
    </ClayCard>
  );
}
