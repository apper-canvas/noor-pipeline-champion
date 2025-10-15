import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import accountService from "@/services/api/accountService";
import ApperIcon from "@/components/ApperIcon";

const AccountForm = ({ account, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    email: account?.email || "",
    phone: account?.phone || "",
    tags: account?.tags || ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (account) {
        await accountService.update(account.Id, formData);
        toast.success("Account updated successfully!");
      } else {
        await accountService.create(formData);
        toast.success("Account created successfully!");
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Account Name"
        required
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        placeholder="Acme Corporation"
      />

      <FormField
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        placeholder="contact@acme.com"
      />

      <FormField
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        placeholder="+1 (555) 123-4567"
      />

      <FormField
        label="Tags"
        value={formData.tags}
        onChange={(e) => handleChange("tags", e.target.value)}
        placeholder="Enterprise, Technology, Partner (comma-separated)"
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Check" size={16} />
              {account ? "Update Account" : "Create Account"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;