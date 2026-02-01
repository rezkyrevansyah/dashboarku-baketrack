'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Receipt, Package, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferences } from '@/context/PreferencesContext';
import { useAuth } from '@/context/AuthContext';
import { SidebarBrand } from './SidebarBrand';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = usePreferences();
  const { logout } = useAuth();

  const menuItems = [
    { name: t('sidebar.report'), icon: BarChart3, path: '/report' },
    { name: t('sidebar.input'), icon: Receipt, path: '/input' },
    { name: t('sidebar.product'), icon: Package, path: '/product' },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLinkClick = () => { if (isMobile && onClose) onClose(); };

  return (
    <>
      <motion.div 
        animate={{ width: isCollapsed ? 100 : 288 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block shrink-0"
      />

      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden" />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={isMobile ? { x: isOpen ? 0 : '-100%', width: 288 } : { x: 0, width: isCollapsed ? 100 : 288 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="clay-sidebar fixed left-0 top-0 h-screen text-white p-4 flex flex-col z-[100] overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="md:hidden absolute right-4 top-4 p-2 text-white/80 hover:text-white">
          <X size={24} />
        </button>

        <button onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-0 top-10 bg-white/20 hover:bg-white/30 p-1.5 rounded-l-xl backdrop-blur-md z-[100] border-l border-white/30 active:scale-90"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <SidebarBrand isCollapsed={isCollapsed} isMobile={isMobile} subtitle={t('dashboard.subtitle')} />
        
        <SidebarNav menuItems={menuItems} pathname={pathname} 
          isCollapsed={isCollapsed} isMobile={isMobile} onLinkClick={handleLinkClick} />

        <SidebarFooter pathname={pathname} isCollapsed={isCollapsed} isMobile={isMobile}
          settingsText={t('sidebar.settings')} logoutText={t('sidebar.logout')}
          onLinkClick={handleLinkClick} onLogout={() => { if (onClose && isMobile) onClose(); logout(); }} />
      </motion.aside>
    </>
  );
}
