import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 ${className}`}>
      <p className="text-xs font-bold text-bakery-muted">
         Halaman {currentPage} dari {totalPages}
      </p>
      <div className="flex items-center gap-2">
         <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-transparent hover:border-pink-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:shadow-none transition-all active:scale-95"
            title="Sebelumnya"
         >
            <ChevronLeft size={20} strokeWidth={2.5} />
         </button>
         <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-transparent hover:border-pink-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:shadow-none transition-all active:scale-95"
            title="Selanjutnya"
         >
            <ChevronRight size={20} strokeWidth={2.5} />
         </button>
      </div>
    </div>
  );
}
