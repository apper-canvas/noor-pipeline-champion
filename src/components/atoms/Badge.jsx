import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    lead: "bg-blue-100 text-blue-700",
    qualified: "bg-purple-100 text-purple-700",
    proposal: "bg-orange-100 text-orange-700",
    negotiation: "bg-yellow-100 text-yellow-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;