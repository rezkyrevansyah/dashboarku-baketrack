'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownOption {
  value: string;
  label: string;
  price: number;
  icon: string;
  stock?: number;
}

interface ClayDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ClayDropdown = memo(function ClayDropdown({ options, value, onChange, placeholder = 'Select...', required }: ClayDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Hidden native select for form validation */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="absolute opacity-0 pointer-events-none"
        tabIndex={-1}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        {value && !options.find(o => o.value === value) && (
           <option value={value}>{value}</option>
        )}
      </select>

      {/* Custom Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="clay-input w-full flex items-center justify-between cursor-pointer hover:border-pink-300 transition-all"
      >
        <span className={value ? 'text-bakery-text font-bold' : 'text-bakery-muted/50 font-semibold'}>
          {selectedOption ? (
            <span className="flex items-center gap-3">
              {selectedOption.icon && <span className="text-2xl">{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-bakery-pink" />
        </motion.div>
      </button>

      {/* Dropdown Menu - Simplified for Performance */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border-2 border-pink-100 overflow-hidden z-50 max-h-64 overflow-y-auto"
          >
            {/* Placeholder Option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className="w-full px-5 py-3 text-left hover:bg-pink-50 transition-colors flex items-center justify-between"
            >
              <span className="text-bakery-muted/50 font-semibold text-sm">{placeholder}</span>
              {!value && <Check size={18} className="text-bakery-pink" />}
            </button>

            {/* Product Options - No individual motion components */}
            {options.map((option) => {
              const isOOS = option.stock !== undefined && option.stock <= 0;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  disabled={isOOS}
                  className={`w-full px-5 py-4 text-left flex items-center gap-4 transition-colors border-b last:border-0 border-gray-50
                      ${selectedOption?.value === option.value ? 'bg-pink-50/50' : 'hover:bg-gray-50'}
                      ${isOOS ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                  `}
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isOOS ? 'bg-gray-200 grayscale' : 'bg-white shadow-sm border border-pink-100'}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                         <span className={`font-bold truncate ${selectedOption?.value === option.value ? 'text-bakery-pink' : 'text-bakery-text'} ${isOOS ? '!text-gray-400' : ''}`}>
                            {option.label}
                         </span>
                         {isOOS && (
                            <span className="text-[10px] font-black text-white bg-red-400 px-2 py-0.5 rounded-full uppercase ml-2">
                               HABIS
                            </span>
                         )}
                      </div>
                      <span className="text-xs font-bold text-bakery-muted opacity-60">Rp {option.price.toLocaleString()}</span>
                    </div>
                    {selectedOption?.value === option.value && !isOOS && (
                      <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
