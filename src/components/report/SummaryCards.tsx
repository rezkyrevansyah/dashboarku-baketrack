import { ClayCard } from '@/components/ui/ClayCard';
import { DollarSign, Sparkles, ShoppingBag } from 'lucide-react';

type SummaryStats = {
  omzet: string;
  laba: string;
  aov: string;
};

export function SummaryCards({ stats }: { stats: SummaryStats }) {
  return (
    <>
      {/* Card 1: Total Omzet - Pink Theme */}
      <ClayCard className="!bg-gradient-to-br !from-[#FF9A9E] !to-[#FECFEF] !border-none p-6 relative overflow-hidden group h-48 rounded-2xl">
         <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl opacity-60"></div>
         <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full blur-xl opacity-40"></div>
         
         <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-start justify-between">
               <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <DollarSign size={22} className="text-white drop-shadow-sm" strokeWidth={2.5} />
               </div>
               <div className="bg-white/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
                  <p className="text-white text-[10px] font-black tracking-wider uppercase drop-shadow-sm">Live Data</p>
               </div>
            </div>
            
            <div>
               <p className="text-white/90 font-bold text-xs tracking-wider uppercase mb-1 drop-shadow-sm">Total Omzet</p>
               <h2 className="text-3xl font-black text-white drop-shadow-md tracking-tight leading-tight">
                  {stats.omzet}
               </h2>
            </div>
         </div>
      </ClayCard>

      {/* Card 2: Laba/Profit - Purple Theme */}
      <ClayCard className="!bg-gradient-to-br !from-purple-400 !to-purple-500 !border-none p-6 relative overflow-hidden group h-48 rounded-2xl">
         <div className="absolute right-0 top-0 w-40 h-40 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-[100px] opacity-50"></div>
         <div className="absolute bottom-4 right-4 text-white/10">
            <Sparkles size={80} strokeWidth={1} />
         </div>

         <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-start justify-between">
               <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Sparkles size={22} className="text-white drop-shadow-sm" strokeWidth={2.5} />
               </div>
               <div className="bg-white/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
                  <p className="text-white text-[10px] font-black tracking-wider uppercase drop-shadow-sm">~45% Margin</p>
               </div>
            </div>
            
            <div>
               <p className="text-white/90 font-bold text-xs tracking-wider uppercase mb-1 drop-shadow-sm">Estimasi Laba</p>
               <h2 className="text-3xl font-black text-white drop-shadow-md tracking-tight leading-tight">
                  {stats.laba}
               </h2>
            </div>
         </div>
      </ClayCard>

      {/* Card 3: AOV - Orange Theme */}
      <ClayCard className="!bg-gradient-to-br !from-orange-400 !to-orange-500 !border-none p-6 relative overflow-hidden group h-48 rounded-2xl">
         <div className="absolute -right-12 -top-12 w-48 h-48 border-[20px] border-white/10 rounded-full"></div>
         <div className="absolute -right-8 -top-8 w-32 h-32 border-[10px] border-white/10 rounded-full"></div>

         <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-start justify-between">
               <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <ShoppingBag size={22} className="text-white drop-shadow-sm" strokeWidth={2.5} />
               </div>
               <div className="bg-white/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
                  <p className="text-white text-[10px] font-black tracking-wider uppercase drop-shadow-sm">Avg. Order</p>
               </div>
            </div>
            
            <div>
               <p className="text-white/90 font-bold text-xs tracking-wider uppercase mb-1 drop-shadow-sm">Rata-Rata Order</p>
               <h2 className="text-3xl font-black text-white drop-shadow-md tracking-tight leading-tight">
                  {stats.aov}
               </h2>
            </div>
         </div>
      </ClayCard>
    </>
  );
}
