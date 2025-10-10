import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select error={error} {...props}>
          {children}
        </Select>
      );
    }
    
    if (type === "textarea") {
      return <Textarea error={error} {...props} />;
    }
    
    return <Input type={type} error={error} {...props} />;
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;