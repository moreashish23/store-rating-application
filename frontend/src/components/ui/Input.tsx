import type{ InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { MdErrorOutline } from "react-icons/md";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-xl border text-sm text-slate-900 bg-white
            placeholder:text-slate-400 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${leftIcon ? "pl-10 pr-3 py-2.5" : "px-3 py-2.5"}
            ${error ? "border-red-400 focus:ring-red-400" : "border-slate-200"}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
          <MdErrorOutline className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  )
);

Input.displayName = "Input";
export default Input;