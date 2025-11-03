import React, { useState, type InputHTMLAttributes } from 'react';

interface EditTextProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
  className?: string;
}

const EditText: React.FC<EditTextProps> = ({ 
  placeholder = '', 
  value = '', 
  onChange, 
  type = 'text',
  disabled = false,
  className = '',
  ...props 
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const baseClasses = 'w-full border border-[#7b7c7e] rounded font-plus-jakarta text-[13px] sm:text-[14px] md:text-[15px] font-normal leading-[16px] sm:leading-[18px] md:leading-[19px] text-global-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  
  const inputClasses = `
    ${baseClasses}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      disabled={disabled}
      className={`${inputClasses} pt-[8px] sm:pt-[9px] md:pt-[10px] pr-[10px] sm:pr-[12px] md:pr-[12px] pb-[8px] sm:pb-[9px] md:pb-[10px] pl-[10px] sm:pl-[12px] md:pl-[12px]`}
      {...props}
    />
  );
};

export default EditText;
