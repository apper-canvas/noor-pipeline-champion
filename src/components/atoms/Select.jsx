import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className,
  children,
  error,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        "w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        error ? "border-red-300 focus:ring-red-500" : "border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;