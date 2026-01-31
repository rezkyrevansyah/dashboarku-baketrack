'use client';

import { useMemo } from 'react';
import { ClayButton } from '@/components/ui/ClayButton';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { SyncButton } from '@/components/ui/SyncButton';
import { useTable } from '@/hooks/useTable';
import { SummaryCards } from '@/components/report/SummaryCards';
import { TopProductsCard } from '@/components/report/TopProductsCard';
import { WeeklyChart } from '@/components/report/WeeklyChart';
import { ReportTable } from '@/components/report/ReportTable';
import { usePreferences } from '@/context/PreferencesContext';
import { LanguageCurrencySwitcher } from '@/components/ui/LanguageCurrencySwitcher';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ReportPage() {
  const { data, loading } = useDashboard();
  const { t, formatPrice, exchangeRate } = usePreferences();
  const transactions = data?.transactions || [];

  // 1. Calculate Summary Stats
  const stats = useMemo(() => {
    const totalOmzet = transactions.reduce((sum, t) => sum + Number(t.total), 0);
    const totalLaba = totalOmzet * 0.45; // Assuming 45% margin
    const totalTx = transactions.length;
    const aov = totalTx > 0 ? totalOmzet / totalTx : 0;

    return {
      omzet: formatPrice(totalOmzet),
      laba: formatPrice(totalLaba),
      aov: formatPrice(aov),
      totalTx,
      rawOmzet: totalOmzet
    };
  }, [transactions, formatPrice, exchangeRate]);

  // 2. Calculate Top Products
  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string, sold: number, icon: string }> = {};
    const defaultIcons: Record<string, string> = { 'Cupcake': '🧁', 'Donat': '🍩', 'Croissant': '🥐', 'Roti': '🍞', 'Cake': '🍰' };

    transactions.forEach(t => {
      const pName = t.product.trim();
      if (!counts[pName]) {
        const productInfo = data?.products.find(p => p.name === pName);
        counts[pName] = { 
          name: pName, 
          sold: 0, 
          icon: productInfo?.image || Object.entries(defaultIcons).find(([k]) => pName.includes(k))?.[1] || '🥯'
        };
      }
      counts[pName].sold += Number(t.qty);
    });

    return Object.values(counts)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 3);
  }, [transactions, data, exchangeRate]);

  // 3. Weekly Data Aggregation
  const weeklyData = useMemo(() => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const result = days.map(day => ({ day, omzet: 0, laba: 0 }));

    transactions.forEach(t => {
      try {
        const date = new Date(t.date);
        if (!isNaN(date.getTime())) {
             const dayIdx = date.getDay();
             const omzet = Number(t.total);
             result[dayIdx].omzet += omzet;
             result[dayIdx].laba += omzet * 0.45;
        }
      } catch (e) {}
    });

    return [...result.slice(1), result[0]];
  }, [transactions, exchangeRate]);

  // 4. Data Table Logic
  const { 
    data: tableData,
    totalPages,
    currentPage,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    goToPage,
    itemsPerPage, 
    setItemsPerPage,
    totalItems
  } = useTable({
    data: transactions || [],
    itemsPerPage: 5, 
    initialSort: { key: 'date', direction: 'desc' },
    filterFn: (item, query) => item.product.toLowerCase().includes(query.toLowerCase())
  });

  // 5. CSV Export Logic
  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Produk', 'Qty', 'Harga', 'Total'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.product}"`, // Escape quotes
      t.qty,
      t.price,
      t.total
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 pt-4 md:pt-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-bakery-text tracking-tight mb-1 sm:mb-2">{t('report.title')}</h1>
          <p className="text-bakery-muted font-bold text-xs sm:text-sm tracking-wide opacity-70 uppercase">
             {t('report.subtitle')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
           {/* Status Bar */}
           <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 p-2 bg-white/95 rounded-2xl border border-white/50 shadow-sm w-full md:w-auto">
              <div className="hidden lg:flex flex-col px-3">
                 <span className="text-[9px] font-black text-bakery-muted uppercase tracking-widest opacity-50">{t('period')}</span>
                 <span className="text-xs font-black text-bakery-text">
                    {new Date().toLocaleDateString(t('language') === 'Bahasa' ? 'id-ID' : 'en-US', { month: 'short', year: 'numeric' })}
                 </span>
              </div>
              <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 border border-green-100 text-green-600">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">{t('live')}</span>
              </div>
              
              <LanguageCurrencySwitcher />
              <SyncButton variant="compact" className="!w-9 !h-9 !rounded-lg !border-none !bg-white !shadow-sm text-bakery-text/70 hover:!text-bakery-pink hover:!bg-pink-50" />
           </div>

           {/* Primary Action */}
           <Link href="/input" className="w-full md:w-auto">
              <ClayButton className="w-full md:w-auto h-12 px-6 flex items-center justify-center gap-2.5 text-sm font-black !rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg hover:shadow-pink-200 hover:-translate-y-0.5 transition-all">
                <Plus size={20} strokeWidth={3} />
                {t('report.input_sales')}
              </ClayButton>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCards stats={stats} />
          <TopProductsCard products={topProducts} />
      </div>

      <WeeklyChart data={weeklyData} />

      <ReportTable 
        totalTx={stats.totalTx}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleExportCSV={handleExportCSV}
        tableData={tableData}
        sortConfig={sortConfig}
        handleSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
