import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";
import { format } from "date-fns";

const ContactDetail = ({ contact, onEdit, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContactData();
  }, [contact.Id]);

  const loadContactData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, activitiesData] = await Promise.all([
        dealService.getByContactId(contact.Id),
        activityService.getByContactId(contact.Id)
      ]);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  };

  const getStageVariant = (stage) => {
    const variants = {
      "Lead": "lead",
      "Qualified": "qualified",
      "Proposal": "proposal",
      "Negotiation": "negotiation",
      "Closed Won": "won",
      "Closed Lost": "lost"
    };
    return variants[stage] || "default";
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

  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "deals", label: "Deals", icon: "DollarSign" },
    { id: "activity", label: "Activity History", icon: "Activity" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{contact.name}</h3>
          <p className="text-secondary">{contact.title} at {contact.company}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onEdit}>
          <ApperIcon name="Edit2" size={16} />
          Edit
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-secondary hover:text-gray-900"
            }`}
          >
            <ApperIcon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "info" && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Mail" size={16} className="text-gray-400" />
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1">Phone</label>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Phone" size={16} className="text-gray-400" />
                    <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1">Company</label>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Building2" size={16} className="text-gray-400" />
                    <span className="text-gray-900">{contact.company}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1">Title</label>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Briefcase" size={16} className="text-gray-400" />
                    <span className="text-gray-900">{contact.title}</span>
                  </div>
                </div>
              </div>
            </Card>

            {contact.notes && (
              <Card className="p-4">
                <label className="text-sm font-medium text-secondary block mb-2">Notes</label>
                <p className="text-gray-900 text-sm whitespace-pre-wrap">{contact.notes}</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === "deals" && (
          <>
            {loading && <Loading />}
            {error && <Error message={error} onRetry={loadContactData} />}
            {!loading && !error && deals.length === 0 && (
              <Empty
                icon="DollarSign"
                title="No deals yet"
                message="Create your first deal for this contact"
              />
            )}
            {!loading && !error && deals.length > 0 && (
              <div className="space-y-3">
                {deals.map(deal => (
                  <Card key={deal.Id} className="p-4 hover:shadow-card-hover transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{deal.title}</h4>
                        <p className="text-2xl font-bold text-primary">
                          ${deal.value.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={getStageVariant(deal.stage)}>
                        {deal.stage}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-secondary">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="TrendingUp" size={14} />
                        <span>{deal.probability}% probability</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" size={14} />
                        <span>Close: {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "activity" && (
          <>
            {loading && <Loading />}
            {error && <Error message={error} onRetry={loadContactData} />}
            {!loading && !error && activities.length === 0 && (
              <Empty
                icon="Activity"
                title="No activities yet"
                message="Log your first activity for this contact"
              />
            )}
            {!loading && !error && activities.length > 0 && (
              <div className="space-y-3">
                {activities.map(activity => (
                  <Card key={activity.Id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "call" ? "bg-blue-100" :
                        activity.type === "email" ? "bg-purple-100" :
                        activity.type === "meeting" ? "bg-green-100" :
                        "bg-gray-100"
                      }`}>
                        <ApperIcon 
                          name={getActivityIcon(activity.type)} 
                          size={18}
                          className={
                            activity.type === "call" ? "text-blue-600" :
                            activity.type === "email" ? "text-purple-600" :
                            activity.type === "meeting" ? "text-green-600" :
                            "text-gray-600"
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900">{activity.subject}</h4>
                          <span className="text-xs text-secondary whitespace-nowrap">
                            {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-secondary mt-1">{activity.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;