import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import pipelineService from "@/services/api/pipelineService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";

const DealForm = ({ deal, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: deal?.title || "",
    contactId: deal?.contactId || "",
    value: deal?.value || "",
    stage: deal?.stage || "Lead",
    probability: deal?.probability || 25,
    expectedCloseDate: deal?.expectedCloseDate || "",
    notes: deal?.notes || ""
  });
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contactsData, stagesData] = await Promise.all([
        contactService.getAll(),
        pipelineService.getAll()
      ]);
      setContacts(contactsData);
      setStages(stagesData.filter(s => s.name !== "Closed Won" && s.name !== "Closed Lost"));
    } catch (error) {
      toast.error("Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Deal title is required";
    if (!formData.contactId) newErrors.contactId = "Contact is required";
    if (!formData.value || formData.value <= 0) newErrors.value = "Valid deal value is required";
    if (!formData.expectedCloseDate) newErrors.expectedCloseDate = "Expected close date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const dealData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        value: parseFloat(formData.value)
      };

      if (deal) {
        await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully!");
      } else {
        await dealService.create(dealData);
        toast.success("Deal created successfully!");
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Deal Title"
        required
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        error={errors.title}
        placeholder="Enterprise License Agreement"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Contact"
          type="select"
          required
          value={formData.contactId}
          onChange={(e) => handleChange("contactId", e.target.value)}
          error={errors.contactId}
        >
          <option value="">Select a contact</option>
          {contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name} - {contact.company}
            </option>
          ))}
        </FormField>

        <FormField
          label="Deal Value"
          type="number"
          required
          value={formData.value}
          onChange={(e) => handleChange("value", e.target.value)}
          error={errors.value}
          placeholder="50000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Stage"
          type="select"
          value={formData.stage}
          onChange={(e) => handleChange("stage", e.target.value)}
        >
          {stages.map(stage => (
            <option key={stage.Id} value={stage.name}>
              {stage.name}
            </option>
          ))}
        </FormField>

        <FormField
          label="Expected Close Date"
          type="date"
          required
          value={formData.expectedCloseDate}
          onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
          error={errors.expectedCloseDate}
        />
      </div>

      <FormField
        label="Probability (%)"
        type="number"
        value={formData.probability}
        onChange={(e) => handleChange("probability", e.target.value)}
        min="0"
        max="100"
      />

      <FormField
        label="Notes"
        type="textarea"
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        placeholder="Add deal notes, next steps, or important details..."
        rows={4}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Check" size={16} />
              {deal ? "Update Deal" : "Create Deal"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;