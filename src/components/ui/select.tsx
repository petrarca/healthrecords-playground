import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

type SelectSize = 'default' | 'sm';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'size'> {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  size?: SelectSize;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, value, onChange, label, size = 'default', ...props }, ref) => {
    const sizeClasses = {
      default: 'h-9',
      sm: 'h-7 text-xs'
    };

    return (
      <div className="flex flex-col gap-0.5">
        {label && (
          <label className="text-xs text-gray-500">
            {label}
          </label>
        )}
        <select
          className={`flex ${sizeClasses[size]} rounded-md border border-input bg-background px-2 py-0.5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
