import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import DealForm from "@/components/organisms/DealForm";
import DealCard from "@/components/organisms/DealCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import pipelineService from "@/services/api/pipelineService";

const Pipeline = () => {
  const [stages, setStages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);

  useEffect(() => {
    loadPipelineData();
  }, []);

  const loadPipelineData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stagesData, dealsData, contactsData] = await Promise.all([
        pipelineService.getAll(),
        dealService.getAll(),
        contactService.getAll()
      ]);
      setStages(stagesData.filter(s => s.name !== "Closed Won" && s.name !== "Closed Lost"));
      setDeals(dealsData.filter(d => d.stage !== "Closed Won" && d.stage !== "Closed Lost"));
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (stageName) => {
    if (!draggedDeal || draggedDeal.stage === stageName) {
      setDraggedDeal(null);
      return;
    }

    try {
      await dealService.update(draggedDeal.Id, { stage: stageName });
      toast.success(`Deal moved to ${stageName}`);
      loadPipelineData();
    } catch (error) {
      toast.error("Failed to update deal stage");
    } finally {
      setDraggedDeal(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowEditModal(true);
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedDeal(null);
    loadPipelineData();
  };

  const getDealsByStage = (stageName) => {
    return deals.filter(d => d.stage === stageName);
  };

  const getContact = (contactId) => {
    return contacts.find(c => c.Id === contactId);
  };

  const getStageVariant = (stageName) => {
    const variants = {
      "Lead": "lead",
      "Qualified": "qualified",
      "Proposal": "proposal",
      "Negotiation": "negotiation"
    };
    return variants[stageName] || "default";
  };

  const calculateStageValue = (stageName) => {
    return getDealsByStage(stageName).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPipelineData} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Pipeline</h1>
          <p className="text-secondary">Track deals through your sales stages</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" size={16} />
          New Deal
        </Button>
      </div>

      {deals.length === 0 ? (
        <Empty
          icon="Kanban"
          title="No deals in pipeline"
          message="Create your first deal to start tracking your sales"
          actionLabel="Create Deal"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.name);
            const stageValue = calculateStageValue(stage.name);

            return (
              <motion.div
                key={stage.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 w-full md:w-auto"
              >
                <div
                  className="bg-gray-50 rounded-lg p-4 min-h-[600px]"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage.name)}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getStageVariant(stage.name)} className="text-sm">
                        {stage.name}
                      </Badge>
                      <span className="text-sm font-medium text-secondary">
                        {stageDeals.length}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${stageValue.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {stageDeals.map((deal) => (
                        <DealCard
                          key={deal.Id}
                          deal={deal}
                          contact={getContact(deal.contactId)}
                          isDragging={draggedDeal?.Id === deal.Id}
                          onDragStart={() => handleDragStart(deal)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleEditDeal(deal)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Deal"
        size="md"
      >
        <DealForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDeal(null);
        }}
        title="Edit Deal"
        size="md"
      >
        <DealForm
          deal={selectedDeal}
          onSuccess={handleModalSuccess}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedDeal(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Pipeline;