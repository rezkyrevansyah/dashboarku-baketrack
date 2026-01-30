'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchFullData, FullDashboardData, Transaction, Product, Profile } from '@/services/api';

interface DashboardContextType {
  data: FullDashboardData | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  updateLocalData: (newData: Partial<FullDashboardData>) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FullDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    const result = await fetchFullData();
    if (result) {
      setData(result);
    }
    setLoading(false);
  }, []);

  const updateLocalData = useCallback((newData: Partial<FullDashboardData>) => {
    setData(prev => prev ? { ...prev, ...newData } : null);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <DashboardContext.Provider value={{ data, loading, refreshData, updateLocalData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
