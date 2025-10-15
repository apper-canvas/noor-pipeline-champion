import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import leadService from "@/services/api/leadService";
import ApperIcon from "@/components/ApperIcon";

const LeadForm = ({ lead, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    title: lead?.title || "",
    notes: lead?.notes || "",
    status: lead?.status || "New",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Lost", label: "Lost" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      if (lead) {
        await leadService.update(lead.Id, formData);
        toast.success("Lead updated successfully!");
      } else {
        await leadService.create(formData);
        toast.success("Lead created successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Name"
        type="text"
        value={formData.name}
        onChange={(value) => handleChange("name", value)}
        error={errors.name}
        required
        placeholder="Enter lead name"
      />

      <FormField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        error={errors.email}
        required
        placeholder="lead@company.com"
      />

      <FormField
        label="Phone"
        type="text"
        value={formData.phone}
        onChange={(value) => handleChange("phone", value)}
        error={errors.phone}
        placeholder="(555) 123-4567"
      />

      <FormField
        label="Company"
        type="text"
        value={formData.company}
        onChange={(value) => handleChange("company", value)}
        error={errors.company}
        placeholder="Company name"
      />

      <FormField
        label="Title"
        type="text"
        value={formData.title}
        onChange={(value) => handleChange("title", value)}
        error={errors.title}
        placeholder="Job title"
      />

      <FormField
        label="Status"
        type="select"
        value={formData.status}
        onChange={(value) => handleChange("status", value)}
        error={errors.status}
        options={statusOptions}
        required
      />

      <FormField
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={(value) => handleChange("notes", value)}
        error={errors.notes}
        placeholder="Additional notes about this lead..."
        rows={4}
      />

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              {lead ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <ApperIcon name={lead ? "Save" : "Plus"} size={16} />
              {lead ? "Update Lead" : "Create Lead"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;