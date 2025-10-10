import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";

const ActivityForm = ({ activity, preselectedContactId, preselectedDealId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: activity?.type || "call",
    contactId: activity?.contactId || preselectedContactId || "",
    dealId: activity?.dealId || preselectedDealId || "",
    subject: activity?.subject || "",
    description: activity?.description || ""
  });
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);
      setContacts(contactsData);
      setDeals(dealsData.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost"));
    } catch (error) {
      toast.error("Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.contactId) newErrors.contactId = "Contact is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const activityData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        dealId: formData.dealId ? parseInt(formData.dealId) : null
      };

      if (activity) {
        await activityService.update(activity.Id, activityData);
        toast.success("Activity updated successfully!");
      } else {
        await activityService.create(activityData);
        toast.success("Activity logged successfully!");
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save activity. Please try again.");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Activity Type"
          type="select"
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="call">Phone Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
        </FormField>

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
      </div>

      <FormField
        label="Related Deal (Optional)"
        type="select"
        value={formData.dealId}
        onChange={(e) => handleChange("dealId", e.target.value)}
      >
        <option value="">None</option>
        {deals.map(deal => (
          <option key={deal.Id} value={deal.Id}>
            {deal.title}
          </option>
        ))}
      </FormField>

      <FormField
        label="Subject"
        required
        value={formData.subject}
        onChange={(e) => handleChange("subject", e.target.value)}
        error={errors.subject}
        placeholder="Quick summary of the activity"
      />

      <FormField
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Add detailed notes about this activity..."
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
              {activity ? "Update Activity" : "Log Activity"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;