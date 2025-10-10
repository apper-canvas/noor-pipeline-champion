import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/molecules/Modal";
import ContactForm from "@/components/organisms/ContactForm";
import DealForm from "@/components/organisms/DealForm";
import ActivityForm from "@/components/organisms/ActivityForm";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import activityService from "@/services/api/activityService";
import { format, subDays } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, contactsData, activitiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        activityService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setActivities(activitiesData.slice(0, 5));
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const openDeals = deals.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost");
    const wonDeals = deals.filter(d => d.stage === "Closed Won");
    const totalPipeline = openDeals.reduce((sum, deal) => sum + deal.value, 0);
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const conversionRate = deals.length > 0 ? ((wonDeals.length / deals.length) * 100).toFixed(1) : 0;

    return {
      totalPipeline,
      activeDeals: openDeals.length,
      wonValue,
      conversionRate,
      totalContacts: contacts.length
    };
  };

  const getDealsByStage = () => {
    const stages = ["Lead", "Qualified", "Proposal", "Negotiation"];
    return stages.map(stage => ({
      stage,
      count: deals.filter(d => d.stage === stage).length,
      value: deals.filter(d => d.stage === stage).reduce((sum, d) => sum + d.value, 0)
    }));
  };

  const getStageVariant = (stage) => {
    const variants = {
      "Lead": "lead",
      "Qualified": "qualified",
      "Proposal": "proposal",
      "Negotiation": "negotiation"
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

  const handleModalSuccess = () => {
    setShowContactModal(false);
    setShowDealModal(false);
    setShowActivityModal(false);
    loadDashboardData();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const metrics = calculateMetrics();
  const stageData = getDealsByStage();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-secondary">Track your sales pipeline and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowActivityModal(true)}>
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">Activity</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowContactModal(true)}>
            <ApperIcon name="UserPlus" size={16} />
            <span className="hidden sm:inline">Contact</span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowDealModal(true)}>
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">New Deal</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pipeline"
          value={`$${metrics.totalPipeline.toLocaleString()}`}
          change="+12.5%"
          icon="DollarSign"
          trend="up"
        />
        <MetricCard
          title="Active Deals"
          value={metrics.activeDeals}
          change="+8"
          icon="Briefcase"
          trend="up"
        />
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          change="+5"
          icon="Users"
          trend="up"
        />
        <MetricCard
          title="Win Rate"
          value={`${metrics.conversionRate}%`}
          change="+2.3%"
          icon="Target"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pipeline by Stage</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/pipeline")}
              >
                View Pipeline
                <ApperIcon name="ArrowRight" size={16} />
              </Button>
            </div>
            {stageData.length === 0 ? (
              <Empty
                icon="Kanban"
                title="No deals in pipeline"
                message="Create your first deal to get started"
                actionLabel="Create Deal"
                onAction={() => setShowDealModal(true)}
              />
            ) : (
              <div className="space-y-4">
                {stageData.map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStageVariant(stage.stage)}>
                          {stage.stage}
                        </Badge>
                        <span className="text-sm text-secondary">
                          {stage.count} {stage.count === 1 ? "deal" : "deals"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        ${stage.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${metrics.totalPipeline > 0 ? (stage.value / metrics.totalPipeline) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/activities")}
              >
                View All
                <ApperIcon name="ArrowRight" size={16} />
              </Button>
            </div>
            {activities.length === 0 ? (
              <Empty
                icon="Activity"
                title="No activities yet"
                message="Start logging activities"
                actionLabel="Log Activity"
                onAction={() => setShowActivityModal(true)}
              />
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "call" ? "bg-blue-100" :
                      activity.type === "email" ? "bg-purple-100" :
                      activity.type === "meeting" ? "bg-green-100" :
                      "bg-gray-100"
                    }`}>
                      <ApperIcon
                        name={getActivityIcon(activity.type)}
                        size={14}
                        className={
                          activity.type === "call" ? "text-blue-600" :
                          activity.type === "email" ? "text-purple-600" :
                          activity.type === "meeting" ? "text-green-600" :
                          "text-gray-600"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.subject}
                      </p>
                      <p className="text-xs text-secondary mt-0.5">
                        {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Create New Contact"
      >
        <ContactForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowContactModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        title="Create New Deal"
      >
        <DealForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowDealModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Log Activity"
      >
        <ActivityForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowActivityModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;