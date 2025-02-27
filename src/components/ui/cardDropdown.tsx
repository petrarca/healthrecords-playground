import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

interface CardDropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface CardDropdownProps {
  readonly options: readonly CardDropdownOption[];
  readonly onSelect: (value: string) => void;
  readonly className?: string;
  readonly icon?: React.ReactNode;
  readonly disabled?: boolean;
}

export function CardDropdown({ options, onSelect, className = '', icon, disabled = false }: CardDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className={`relative ${className}`}>
        <Popover.Trigger asChild disabled={disabled}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`h-7 w-7 flex items-center justify-center rounded border border-gray-300 bg-white text-sm shadow-sm
              hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="More options"
          >
            {icon ?? <MoreVertical size={14} className="text-gray-500" />}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="min-w-[200px] rounded-md border border-gray-200 bg-white py-1 shadow-lg z-[100]"
            sideOffset={5}
            align="end"
            collisionPadding={10}
            avoidCollisions
          >
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
                  ${option.className ?? ''}`}
                disabled={option.disabled}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>
  );
}
