import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import LeadForm from "@/components/organisms/LeadForm";
import LeadDetail from "@/components/organisms/LeadDetail";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import leadService from "@/services/api/leadService";
import { format } from "date-fns";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leadService.getAll();
      setLeads(data);
    } catch (err) {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await leadService.delete(leadId);
      toast.success("Lead deleted successfully!");
      loadLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedLead(null);
    loadLeads();
  };

  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-100 text-blue-800",
      Contacted: "bg-yellow-100 text-yellow-800",
      Qualified: "bg-green-100 text-green-800",
      Lost: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
          <p className="text-secondary">Manage your sales leads</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="UserPlus" size={16} />
          Add Lead
        </Button>
      </div>

      <Card className="p-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search leads by name, email, or company..."
        />
      </Card>

      {filteredLeads.length === 0 ? (
        <Empty
          icon="Users"
          title={searchQuery ? "No leads found" : "No leads yet"}
          message={
            searchQuery
              ? "Try adjusting your search"
              : "Add your first lead to get started"
          }
          actionLabel="Add Lead"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-6 hover:shadow-card-hover transition-shadow cursor-pointer"
                onClick={() => handleViewLead(lead)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLead(lead);
                      }}
                      className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lead.Id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {lead.name}
                    </h3>
                    {lead.title && (
                      <p className="text-sm text-secondary">{lead.title}</p>
                    )}
                  </div>

                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>

                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    {lead.company && (
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <ApperIcon name="Building2" size={14} />
                        <span className="truncate">{lead.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <ApperIcon name="Mail" size={14} />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <ApperIcon name="Phone" size={14} />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-secondary">
                      Added {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Lead"
        size="md"
      >
        <LeadForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Lead"
        size="md"
      >
        <LeadForm
          lead={selectedLead}
          onSuccess={handleModalSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLead(null);
        }}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <LeadDetail
            lead={selectedLead}
            onEdit={() => handleEditLead(selectedLead)}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedLead(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Leads;