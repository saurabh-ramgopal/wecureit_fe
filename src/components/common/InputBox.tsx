import React, { FC, ChangeEvent, useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputBoxProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  name?: string;

}

const InputBox: FC<InputBoxProps> = ({ label, type = "text", value, onChange, placeholder, icon, name }) => {
  const [show, setShow] = useState(false);

  // reset show state if type changes (e.g., programmatic changes)
  useEffect(() => {
    setShow(false);
  }, [type]);
  // If the parent passed an Eye/EyeOff icon for a password field, suppress the left icon
  const isEyeIcon = icon && (icon.type === Eye || icon.type === EyeOff);
  const showLeftIcon = !(type === 'password' && isEyeIcon);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-dark">{label}</label>}
        
      <div className="relative">
    {/* Icon */}
  {showLeftIcon && icon && (
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
    {React.cloneElement(icon, { className: "w-5 h-5 text-gray-400" })}
    </div>
  )}

    {/* Input */}
    <input
      type={type === 'password' ? (show ? 'text' : 'password') : type}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-4 focus:ring-[rgb(var(--color-primary-100))] transition-all bg-white/50 ${
      showLeftIcon ? "pl-11" : ""
      } ${type === 'password' ? 'pr-11' : ''}`}
    />

    {/* Password toggle (right) */}
    {type === 'password' && value.length > 0 && (
      <div
        
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShow(s => !s)}
        role="button"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
      </div>
    )}
  </div>
    </div>
  );
};

export default InputBox;
