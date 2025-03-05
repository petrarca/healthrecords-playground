import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Select } from './select';
import { FieldMetaData, QuantityValue } from '../../types/medicalRecord';
import { metadataService } from '../../services/metadataService';

interface QuantityInputProps {
  fieldMetadata: FieldMetaData;
  value?: QuantityValue;
  onChange: (value: QuantityValue) => void;
  customUnits?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  fieldMetadata,
  value,
  onChange,
  customUnits,
  disabled = false,
  placeholder = '',
  className = ''
}) => {
  // Initialize with default unit from metadata if no value is provided
  const getInitialUnit = (): string => {
    if (value?.unit) {
      return value.unit;
    }
    
    if (fieldMetadata.type === 'quantity') {
      if (fieldMetadata.quantityUnits?.length) {
        const defaultUnit = fieldMetadata.quantityUnits.find(u => u.default) || fieldMetadata.quantityUnits[0];
        return defaultUnit.unit;
      } else if (fieldMetadata.defaultUnit) {
        return fieldMetadata.defaultUnit;
      }
    }
    
    return '';
  };

  const [internalValue, setInternalValue] = useState<string>(value?.value?.toString() ?? '');
  const [unit, setUnit] = useState<string>(getInitialUnit());
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Update internal state when props change
  useEffect(() => {
    if (value) {
      setInternalValue(value.value?.toString() ?? '');
      setUnit(value.unit);
    }
  }, [value, fieldMetadata]);

  // Handle value change
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stringValue = e.target.value;
    
    // For number fields, only allow valid numeric input patterns during typing
    if (fieldMetadata.quantityType === 'number') {
      // Allow digits, at most one decimal separator (. or ,), and a leading minus sign
      // This regex allows: empty string, minus sign, digits, and at most one decimal separator
      const isValidNumericInput = /^-?\d*[.,]?\d*$/.test(stringValue);
      
      if (!isValidNumericInput && stringValue !== '') {
        return; // Reject invalid input
      }
      
      // Update internal state without converting to number yet
      setInternalValue(stringValue);
      
      // Clear any previous error message
      setErrorMessage('');
      
      // For number fields, we'll defer the conversion to a number until blur
      // This allows typing decimal points without immediate validation
      return;
    }
    
    // For non-numeric fields, proceed as before
    setInternalValue(stringValue);
    
    // Clear any previous error message
    setErrorMessage('');
    
    // Only call onChange for non-numeric fields
    onChange(metadataService.createQuantityValue(stringValue, unit, fieldMetadata));
  };

  // Handle unit change
  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    
    // Clear any previous error message
    setErrorMessage('');
    
    // For number fields, we need to format the value according to precision
    if (fieldMetadata.quantityType === 'number') {
      // Replace comma with period for decimal separator
      const normalizedValue = internalValue.replace(',', '.');
      
      // Skip empty values or partial inputs
      if (normalizedValue === '' || normalizedValue === '.' || normalizedValue === '-' || normalizedValue === '-.') {
        // Just update the unit without changing the value
        onChange(metadataService.createQuantityValue(internalValue, newUnit, fieldMetadata));
        return;
      }
      
      // Try to parse as a number
      const numValue = parseFloat(normalizedValue);
      if (!isNaN(numValue)) {
        // Check if the number of decimal places exceeds the specified precision
        if (fieldMetadata.precision !== undefined) {
          const decimalParts = normalizedValue.split('.');
          if (decimalParts.length > 1 && decimalParts[1].length > fieldMetadata.precision) {
            // Too many decimal places - show error
            setErrorMessage(`Value can have at most ${fieldMetadata.precision} decimal place${fieldMetadata.precision !== 1 ? 's' : ''}`);
            // Keep the original unit
            setUnit(unit);
            return;
          }
          
          // Format to the specified precision without rounding
          const formattedValue = numValue.toFixed(fieldMetadata.precision);
          setInternalValue(formattedValue);
          
          // Call onChange with the formatted value and new unit
          onChange(metadataService.createQuantityValue(formattedValue, newUnit, fieldMetadata));
        } else {
          // If no precision is specified, use the original value
          setInternalValue(numValue.toString());
          onChange(metadataService.createQuantityValue(numValue.toString(), newUnit, fieldMetadata));
        }
        
        // Validate the value with the new unit
        validateValue(normalizedValue, newUnit);
        return;
      }
    }
    
    // For non-numeric fields or invalid numeric input, just update the unit
    onChange(metadataService.createQuantityValue(internalValue, newUnit, fieldMetadata));
    validateValue(internalValue, newUnit);
  };

  // Handle blur event
  const handleBlur = () => {
    // For numeric fields, validate and format
    if (fieldMetadata.quantityType === 'number') {
      // Replace comma with period for decimal separator (for international support)
      const normalizedValue = internalValue.replace(',', '.');
      
      // Skip empty values or values that are just a decimal point or minus sign
      if (normalizedValue === '' || normalizedValue === '.' || normalizedValue === '-' || normalizedValue === '-.') {
        if (normalizedValue !== '') {
          // Reset invalid partial inputs to empty
          setInternalValue('');
        }
        // Always call onChange with empty value for invalid inputs
        onChange(metadataService.createQuantityValue('', unit, fieldMetadata));
        return;
      }
      
      // Try to parse as a number
      const numValue = parseFloat(normalizedValue);
      if (!isNaN(numValue)) {
        // Check if the number of decimal places exceeds the specified precision
        if (fieldMetadata.precision !== undefined) {
          const decimalParts = normalizedValue.split('.');
          if (decimalParts.length > 1 && decimalParts[1].length > fieldMetadata.precision) {
            // Too many decimal places - show error
            setErrorMessage(`Value can have at most ${fieldMetadata.precision} decimal place${fieldMetadata.precision !== 1 ? 's' : ''}`);
            return;
          }
          
          // Format to the specified precision without rounding
          const formattedValue = numValue.toFixed(fieldMetadata.precision);
          setInternalValue(formattedValue);
          
          // Call onChange with the formatted value
          onChange(metadataService.createQuantityValue(formattedValue, unit, fieldMetadata));
        } else {
          // If no precision is specified, use the original value
          setInternalValue(numValue.toString());
          onChange(metadataService.createQuantityValue(numValue.toString(), unit, fieldMetadata));
        }
        
        // Validate the value
        validateValue(normalizedValue, unit);
        return;
      } else {
        // Invalid number - reset to empty
        setInternalValue('');
        onChange(metadataService.createQuantityValue('', unit, fieldMetadata));
        return;
      }
    } else {
      // For non-numeric fields, just validate
      validateValue(internalValue, unit);
    }
  };
  
  // Validate the value based on metadata rules
  const validateValue = (value: string, currentUnit: string) => {
    // Skip validation for empty values
    if (!value) {
      return;
    }
    
    // For numeric fields, validate against min/max
    if (fieldMetadata.quantityType === 'number') {
      const numValue = parseFloat(value);
      
      // Skip validation if not a valid number
      if (isNaN(numValue)) {
        return;
      }
      
      // Check validation rules
      let validationMessage = '';
      
      // First try unit-specific validation
      if (fieldMetadata.quantityUnits?.length) {
        const selectedUnitMeta = fieldMetadata.quantityUnits.find(u => u.unit === currentUnit);
        if (selectedUnitMeta?.validation) {
          if (selectedUnitMeta.validation.min !== undefined && numValue < selectedUnitMeta.validation.min) {
            validationMessage = `Value must be at least ${selectedUnitMeta.validation.min} ${currentUnit}`;
          }
          else if (selectedUnitMeta.validation.max !== undefined && numValue > selectedUnitMeta.validation.max) {
            validationMessage = `Value must be at most ${selectedUnitMeta.validation.max} ${currentUnit}`;
          }
        }
      }
      
      // Fallback to field-level validation
      if (!validationMessage && fieldMetadata.validation) {
        if (fieldMetadata.validation.min !== undefined && numValue < fieldMetadata.validation.min) {
          validationMessage = `Value must be at least ${fieldMetadata.validation.min}`;
        }
        else if (fieldMetadata.validation.max !== undefined && numValue > fieldMetadata.validation.max) {
          validationMessage = `Value must be at most ${fieldMetadata.validation.max}`;
        }
      }
      
      // Show validation error if any
      if (validationMessage) {
        setErrorMessage(validationMessage);
      }
    }
  };

  // Get unit options from metadata or custom units
  const getUnitOptions = () => {
    if (customUnits) {
      return customUnits;
    }
    
    if (fieldMetadata.type === 'quantity' && fieldMetadata.quantityUnits?.length) {
      return fieldMetadata.quantityUnits.map(unitMeta => ({
        value: unitMeta.unit,
        label: unitMeta.display_name || unitMeta.unit
      }));
    }
    
    // Fallback to legacy defaultUnit
    if (fieldMetadata.type === 'quantity' && fieldMetadata.defaultUnit) {
      return [{ value: fieldMetadata.defaultUnit, label: fieldMetadata.defaultUnit }];
    }
    
    return [];
  };

  const unitOptions = getUnitOptions();
  const showUnitSelect = unitOptions.length > 1;

  const renderUnitElement = () => {
    if (showUnitSelect) {
      return (
        <div className="w-24">
          <Select
            options={unitOptions}
            value={unit}
            onChange={handleUnitChange}
            disabled={disabled}
            size="sm"
          />
        </div>
      );
    }
    
    if (unitOptions.length === 1) {
      return (
        <div className="w-24 flex items-center h-9 px-3 text-sm text-gray-500">
          {unitOptions[0].label}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`flex flex-row gap-2 items-end ${className}`}>
      <div className="flex-grow">
        <Input
          value={internalValue}
          onChange={handleValueChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder || fieldMetadata.label}
          aria-label={fieldMetadata.label}
          title={fieldMetadata.description}
          required={fieldMetadata.required}
          type="text"
          inputMode={fieldMetadata.quantityType === 'number' ? "decimal" : "text"}
          aria-invalid={!!errorMessage}
        />
        {errorMessage && (
          <div className="text-sm text-red-500 mt-1">{errorMessage}</div>
        )}
      </div>
      
      {renderUnitElement()}
    </div>
  );
};

QuantityInput.displayName = 'QuantityInput';
