import React, { FC, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "login" | "back"; // You can add more variants
  children: React.ReactNode;
  fullWidth?: boolean;
  flexGrow?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({ variant = "login", children, onClick, fullWidth, flexGrow, ...props }) => {
  const baseClasses = `font-semibold py-3 transition-colors shadow-md text-2xl hover:shadow-lg mt-2 rounded-xl ${
    flexGrow ? `flex-[${flexGrow}]` : fullWidth ? "w-full" : "w-auto"
  }`;

  const variantClasses: Record<string, string> = {
  login: `w-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white  hover:opacity-95 focus:ring-4 focus:ring-[rgb(var(--color-primary)/0.12)]`,
  back: `w-full bg-[rgb(var(--color-offwhite))] text-[rgb(var(--color-dark))]  border-2 border-[rgb(var(--color-dark))] focus:ring-4 focus:ring-[rgb(var(--color-dark)/0.12)]`,
  };

  const isDisabled = !!(props && (props as any).disabled);
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
