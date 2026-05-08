import type{ ButtonHTMLAttributes, ReactNode } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variants = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white border-transparent shadow-sm shadow-brand-200",
  secondary: "bg-slate-700 hover:bg-slate-800 text-white border-transparent shadow-sm",
  danger: "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-700 border-transparent",
  outline: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm",
};

const sizes = {
  xs: "px-2.5 py-1.5 text-xs gap-1.5",
  sm: "px-3 py-2 text-sm gap-2",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2.5",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={`
      inline-flex items-center justify-center font-semibold rounded-xl border
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500
      focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed
      active:scale-[0.98] select-none
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <AiOutlineLoading3Quarters className="animate-spin w-4 h-4" />
    ) : (
      icon && <span className="flex-shrink-0">{icon}</span>
    )}
    {children}
  </button>
);

export default Button;