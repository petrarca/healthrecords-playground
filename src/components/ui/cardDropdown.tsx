import React, { useRef, useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

interface CardDropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface CardDropdownProps {
  options: CardDropdownOption[];
  onSelect: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

export function CardDropdown({ options, onSelect, className = '', icon }: CardDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 w-7 flex items-center justify-center rounded border border-gray-300 bg-white text-sm shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
        title="More options"
      >
        {icon || <MoreVertical size={14} className="text-gray-500" />}
      </button>

      {isOpen && (
        <div className="fixed transform -translate-x-full mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white py-1 shadow-lg z-[100]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                if (!option.disabled) {
                  onSelect(option.value);
                  setIsOpen(false);
                }
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${option.className || ''}`}
              disabled={option.disabled}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
