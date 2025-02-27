import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  background?: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  background = 'bg-gray-100',
  textColor = 'text-gray-700',
  borderColor = 'border-gray-200',
  className = '' 
}) => {
  return (
    <span 
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${background} ${textColor} ${borderColor} ${className}`}
    >
      {children}
    </span>
  );
};
