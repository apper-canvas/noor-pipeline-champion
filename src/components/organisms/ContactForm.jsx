import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import contactService from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";

const ContactForm = ({ contact, onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    title: contact?.title || "",
    notes: contact?.notes || "",
    gender: contact?.gender || "",
    dateOfBirth: contact?.dateOfBirth || ""
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
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (formData.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Invalid date format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (contact) {
        await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully!");
      } else {
        await contactService.create(formData);
        toast.success("Contact created successfully!");
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          required
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          placeholder="John Doe"
        />
        <FormField
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          placeholder="john@company.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
        <FormField
          label="Company"
          required
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
          error={errors.company}
          placeholder="Company Name"
        />
<FormField
          label="Gender"
          type="select"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          error={errors.gender}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
            { value: 'Prefer not to say', label: 'Prefer not to say' }
          ]}
        />

        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
        />
      </div>

      <FormField
        label="Job Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="VP of Sales"
      />

      <FormField
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        placeholder="Add any additional notes..."
        rows={4}
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
              {contact ? "Update Contact" : "Create Contact"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;