import React, { useState } from 'react';

interface DropdownOption {
  label: string;
  value: string | number;
}

interface RightIcon {
  src: string;
  width: number;
  height: number;
}

interface DropdownProps {
  placeholder?: string;
  options?: DropdownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  className?: string;
  rightIcon?: RightIcon;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  placeholder = 'Select option', 
  options = [],
  value = '', 
  onChange,
  disabled = false,
  className = '',
  rightIcon = null,
  ...props 
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: DropdownOption) => {
    setSelectedValue(option.value);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  const baseClasses = 'relative w-full border border-[#7b7c7e] rounded font-plus-jakarta text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-[18px] sm:leading-[21px] md:leading-[23px] text-global-10 uppercase transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer';
  
  const dropdownClasses = `
    ${baseClasses}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="relative">
      <div
        className={`${dropdownClasses} pt-[10px] sm:pt-[12px] md:pt-[14px] pr-[24px] sm:pr-[28px] md:pr-[32px] pb-[10px] sm:pb-[12px] md:pb-[14px] pl-[16px] sm:pl-[18px] md:pl-[20px] flex items-center justify-between`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        {...props}
      >
        <span className={selectedValue ? 'text-global-10' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {rightIcon ? (
          <img 
            src={rightIcon.src} 
            alt="dropdown arrow" 
            className={`w-[${rightIcon.width}px] h-[${rightIcon.height}px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        ) : (
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-[#7b7c7e] rounded-b shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className="px-[16px] sm:px-[18px] md:px-[20px] py-[10px] sm:py-[12px] md:py-[14px] hover:bg-gray-100 cursor-pointer text-[14px] sm:text-[16px] md:text-[18px] font-normal text-global-10 uppercase"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
