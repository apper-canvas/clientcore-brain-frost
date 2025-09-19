import React from 'react';
import { cn } from '@/utils/cn';

const Card = React.forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = React.forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight text-slate-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn("p-6 pt-0", className)} 
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };