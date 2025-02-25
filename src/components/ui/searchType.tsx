import React, { useRef, useState, useEffect } from 'react';

interface SearchTypeOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface SearchTypeProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchTypeOption[];
  className?: string;
}

export function SearchType({ value, onChange, options, className = '' }: SearchTypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

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
        className="h-[46px] w-[46px] flex items-center justify-center rounded-lg border-2 border-gray-200 bg-blue-50 text-sm shadow-sm
          hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        title="Select search type"
      >
        {selectedOption?.icon}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-50
                ${option.value === value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
            >
              <div className="w-4 h-4 flex-shrink-0">
                {option.icon}
              </div>
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
