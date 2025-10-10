import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { format, differenceInDays } from "date-fns";

const DealCard = ({ deal, contact, isDragging, onDragStart, onDragEnd, onClick }) => {
  const daysInStage = deal.updatedAt 
    ? differenceInDays(new Date(), new Date(deal.updatedAt))
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <Card 
        className={`p-4 cursor-move transition-all duration-200 ${
          isDragging ? "shadow-dragging scale-105 rotate-2" : "hover:shadow-card-hover"
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
              {deal.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="text-gray-400 hover:text-primary transition-colors p-1"
            >
              <ApperIcon name="MoreVertical" size={16} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-secondary">
              <ApperIcon name="User" size={14} />
              <span className="truncate">{contact?.name || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <ApperIcon name="Building2" size={14} />
              <span className="truncate">{contact?.company || "Unknown"}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${deal.value.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-xs text-secondary">
                <ApperIcon name="Clock" size={12} />
                <span>{daysInStage}d</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-secondary">
              <ApperIcon name="TrendingUp" size={12} />
              <span>{deal.probability}%</span>
            </div>
            <div className="flex items-center gap-1 text-secondary">
              <ApperIcon name="Calendar" size={12} />
              <span>{format(new Date(deal.expectedCloseDate), "MMM d")}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;