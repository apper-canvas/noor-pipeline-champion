import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import ActivityForm from "@/components/organisms/ActivityForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import { format } from "date-fns";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadActivitiesData();
  }, []);

  const loadActivitiesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;

    try {
      await activityService.delete(activityId);
      toast.success("Activity deleted successfully!");
      loadActivitiesData();
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    loadActivitiesData();
  };

  const getContact = (contactId) => {
    return contacts.find(c => c.Id === contactId);
  };

  const getDeal = (dealId) => {
    return deals.find(d => d.Id === dealId);
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Users",
      note: "FileText"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: { bg: "bg-blue-100", text: "text-blue-600" },
      email: { bg: "bg-purple-100", text: "text-purple-600" },
      meeting: { bg: "bg-green-100", text: "text-green-600" },
      note: { bg: "bg-gray-100", text: "text-gray-600" }
    };
    return colors[type] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  const filteredActivities = filterType === "all"
    ? activities
    : activities.filter(a => a.type === filterType);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivitiesData} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities</h1>
          <p className="text-secondary">Track all customer interactions</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" size={16} />
          Log Activity
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <ApperIcon name="Filter" className="text-gray-400" size={18} />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="max-w-xs"
          >
            <option value="all">All Activities</option>
            <option value="call">Phone Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="note">Notes</option>
          </Select>
        </div>
      </Card>

      {filteredActivities.length === 0 ? (
        <Empty
          icon="Activity"
          title={filterType === "all" ? "No activities yet" : `No ${filterType} activities`}
          message="Start logging your customer interactions"
          actionLabel="Log Activity"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const contact = getContact(activity.contactId);
            const deal = getDeal(activity.dealId);
            const colors = getActivityColor(activity.type);

            return (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                      <ApperIcon
                        name={getActivityIcon(activity.type)}
                        size={20}
                        className={colors.text}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {activity.subject}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-secondary">
                            <span className="capitalize">{activity.type}</span>
                            <span>•</span>
                            <span>{format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(activity.Id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>

                      <p className="text-secondary mb-4">{activity.description}</p>

                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                        {contact && (
                          <div className="flex items-center gap-2 text-sm">
                            <ApperIcon name="User" size={14} className="text-gray-400" />
                            <span className="text-gray-900 font-medium">{contact.name}</span>
                            <span className="text-secondary">at {contact.company}</span>
                          </div>
                        )}
                        {deal && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-2 text-sm">
                              <ApperIcon name="DollarSign" size={14} className="text-gray-400" />
                              <span className="text-gray-900">{deal.title}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Log New Activity"
        size="md"
      >
        <ActivityForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Activities;