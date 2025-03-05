import React from 'react';

export interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant: 'blue' | 'green' | 'purple' | 'amber';
  headerContent?: React.ReactNode;
  onClick?: () => void;
}

const cardStyles = {
  blue: 'border-blue-200',
  green: 'border-green-200',
  purple: 'border-purple-200',
  amber: 'border-amber-200'
} as const;

const headerStyles = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  amber: 'bg-amber-50 border-amber-200'
} as const;

const iconStyles = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  amber: 'text-amber-600'
} as const;

export const Card: React.FC<CardProps> = ({ title, icon, children, variant, headerContent, onClick }) => (
  <div 
    className={`bg-white rounded shadow-sm border ${cardStyles[variant]} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className={`border-b px-3 py-2 ${headerStyles[variant]} relative`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${iconStyles[variant]}`}>
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center">
          {headerContent}
        </div>
      </div>
    </div>
    <div className="p-3">
      {children}
    </div>
  </div>
);
