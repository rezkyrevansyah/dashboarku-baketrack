import { useState, useMemo } from 'react';

interface UseTableProps<T> {
  data: T[];
  itemsPerPage?: number;
  initialSort?: { key: keyof T; direction: 'asc' | 'desc' };
  filterFn?: (item: T, query: string) => boolean;
}

export function useTable<T>({ 
  data, 
  itemsPerPage = 20, 
  initialSort, 
  filterFn 
}: UseTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(
    initialSort || null
  );

  // Filter Data
  const filteredData = useMemo(() => {
    let processed = data;

    if (searchQuery && filterFn) {
      processed = processed.filter(item => filterFn(item, searchQuery));
    }

    if (sortConfig) {
      processed = [...processed].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processed;
  }, [data, searchQuery, sortConfig, filterFn]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  return {
    data: paginatedData,
    totalItems: filteredData.length,
    totalPages,
    currentPage,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
  };
}
