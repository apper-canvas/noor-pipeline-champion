import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox", 
  title = "No data found", 
  message = "Get started by adding your first item",
  actionLabel = "Add New",
  onAction 
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-secondary text-sm">{message}</p>
        </div>
        {onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;