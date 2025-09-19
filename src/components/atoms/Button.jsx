import React from 'react';
import { cn } from '@/utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
    outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
    accent: "bg-gradient-to-r from-accent to-amber-500 text-white hover:from-accent/90 hover:to-amber-500/90 shadow-sm hover:shadow-md",
    success: "bg-success text-white hover:bg-success/90 shadow-sm",
    destructive: "bg-error text-white hover:bg-error/90 shadow-sm"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-md px-6 text-base",
    xl: "h-14 rounded-lg px-8 text-lg"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;