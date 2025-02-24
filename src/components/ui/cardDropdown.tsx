import React, { useRef, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface CardDropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CardDropdownProps {
  options: CardDropdownOption[];
  onSelect: (value: string) => void;
  className?: string;
}

export function CardDropdown({ options, onSelect, className = '' }: CardDropdownProps) {
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
        title="Card actions"
      >
        <MapPin size={14} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white py-1 shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm whitespace-nowrap hover:bg-gray-50 text-gray-700"
            >
              <div className="w-4 h-4 flex-shrink-0">
                {option.icon || <MapPin size={14} className="text-gray-500" />}
              </div>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
