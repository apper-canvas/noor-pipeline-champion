import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-secondary text-sm font-medium">Loading data...</p>
      </div>
    </div>
  );
};

export default Loading;