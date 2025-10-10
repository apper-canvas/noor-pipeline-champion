import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className,
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-none",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        error ? "border-red-300 focus:ring-red-500" : "border-gray-300",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;