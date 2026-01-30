import { ClayCard } from '@/components/ui/ClayCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

type WeeklyData = {
  day: string;
  omzet: number;
  laba: number;
};

export function WeeklyChart({ data }: { data: WeeklyData[] }) {
  return (
    <ClayCard className="!bg-white p-8 rounded-2xl border border-gray-100">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="font-black text-2xl text-bakery-text">Grafik Mingguan</h3>
              <p className="text-bakery-muted font-bold text-sm mt-1">Tren penjualan 7 hari terakhir</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
               <span className="flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-lg text-pink-500">
                 <div className="w-2 h-2 rounded-full bg-pink-500"></div> Omzet
               </span>
               <span className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg text-purple-500">
                 <div className="w-2 h-2 rounded-full bg-purple-500"></div> Laba
               </span>
            </div>
         </div>
         <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <XAxis 
                   dataKey="day" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: '#8B7A8B', fontSize: 12, fontWeight: 700}}
                   dy={10}
                 />
                 <Tooltip 
                   cursor={{fill: 'rgba(255, 183, 213, 0.08)'}}
                   contentStyle={{
                     borderRadius: '12px',
                     border: '1px solid #f0f0f0',
                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                     padding: '12px',
                     backgroundColor: '#ffffff',
                     fontFamily: 'inherit'
                   }}
                 />
                 <Bar dataKey="omzet" fill="#FFB7D5" radius={[4, 4, 0, 0]} barSize={20} />
                 <Bar dataKey="laba" fill="#C98BFF" radius={[4, 4, 0, 0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
         </div>
    </ClayCard>
  );
}
