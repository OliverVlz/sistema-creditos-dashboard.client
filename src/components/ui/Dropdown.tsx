import React, { useState, useEffect, useRef } from 'react';

export interface DropdownOption {
  label: string;
  value: string | number | null;
}

interface DropdownProps {
  placeholder?: string;
  options?: DropdownOption[];
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
  disabled?: boolean;
  className?: string;
  showClear?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  placeholder = 'Select option', 
  options = [],
  value, 
  onChange,
  disabled = false,
  className = '',
  showClear = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manejar click fuera para cerrar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: DropdownOption) => {
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onChange) {
      onChange(null);
    }
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`
          relative w-full h-11 rounded-lg border border-gray-300 
          bg-white px-4 py-2.5 pr-10 
          text-sm text-gray-800 
          transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {showClear && value && (
            <span
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={handleClear}
            >
              ×
            </span>
          )}
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <div
                key={index}
                className={`
                  px-4 py-2.5 cursor-pointer transition-colors
                  ${isSelected 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-800 hover:bg-blue-50'
                  }
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                `}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
