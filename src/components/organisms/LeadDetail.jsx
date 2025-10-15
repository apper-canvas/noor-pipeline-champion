import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const LeadDetail = ({ lead, onEdit, onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-100 text-blue-800",
      Contacted: "bg-yellow-100 text-yellow-800",
      Qualified: "bg-green-100 text-green-800",
      Lost: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-semibold">
            {lead.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{lead.name}</h2>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ApperIcon name="User" size={20} />
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="Mail" size={18} className="text-secondary mt-0.5" />
            <div>
              <p className="text-sm text-secondary">Email</p>
              <p className="font-medium text-gray-900">{lead.email}</p>
            </div>
          </div>

          {lead.phone && (
            <div className="flex items-start gap-3">
              <ApperIcon name="Phone" size={18} className="text-secondary mt-0.5" />
              <div>
                <p className="text-sm text-secondary">Phone</p>
                <p className="font-medium text-gray-900">{lead.phone}</p>
              </div>
            </div>
          )}

          {lead.company && (
            <div className="flex items-start gap-3">
              <ApperIcon name="Building2" size={18} className="text-secondary mt-0.5" />
              <div>
                <p className="text-sm text-secondary">Company</p>
                <p className="font-medium text-gray-900">{lead.company}</p>
              </div>
            </div>
          )}

          {lead.title && (
            <div className="flex items-start gap-3">
              <ApperIcon name="Briefcase" size={18} className="text-secondary mt-0.5" />
              <div>
                <p className="text-sm text-secondary">Title</p>
                <p className="font-medium text-gray-900">{lead.title}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {lead.notes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="FileText" size={20} />
            Notes
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ApperIcon name="Clock" size={20} />
          Timeline
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">Created</span>
            <span className="font-medium text-gray-900">
              {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          {lead.modifiedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Last Modified</span>
              <span className="font-medium text-gray-900">
                {format(new Date(lead.modifiedAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button variant="primary" onClick={onEdit} className="flex-1">
          <ApperIcon name="Edit2" size={16} />
          Edit Lead
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default LeadDetail;