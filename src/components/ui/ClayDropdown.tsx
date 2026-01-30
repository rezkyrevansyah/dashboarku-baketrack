'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface ClayDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function ClayDropdown({ options, value, onChange, placeholder = 'Select...', required }: ClayDropdownProps) {
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

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
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
        {/* Fallback option if value is set but not in options (e.g. legacy data) */}
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
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-bakery-pink" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-pink-100 overflow-hidden z-50"
          >
            <div className="max-h-64 overflow-y-auto">
              {/* Placeholder Option */}
              <button
                type="button"
                onClick={() => handleSelect('')}
                className="w-full px-5 py-3 text-left hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all flex items-center justify-between group"
              >
                <span className="text-bakery-muted/50 font-semibold text-sm">{placeholder}</span>
                {!value && <Check size={18} className="text-bakery-pink" />}
              </button>

              {/* Product Options */}
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all flex items-center justify-between gap-3 group border-t border-pink-50"
                >
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {option.icon}
                      </span>
                    )}
                    <span className="text-bakery-text font-bold group-hover:text-bakery-pink transition-colors">
                      {option.label}
                    </span>
                  </div>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-bakery-pink rounded-full flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
