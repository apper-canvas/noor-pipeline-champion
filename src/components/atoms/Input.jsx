import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        error ? "border-red-300 focus:ring-red-500" : "border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;