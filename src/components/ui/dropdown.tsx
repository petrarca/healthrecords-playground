import React, { useRef, useState, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  className?: string;
}

export function Dropdown({ value, onChange, options, className = '' }: DropdownProps) {
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
        className="h-9 w-10 flex items-center justify-center rounded-md border border-input bg-white text-sm shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {selectedOption?.icon}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-gray-50
                ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
