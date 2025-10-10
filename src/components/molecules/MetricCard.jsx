import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ title, value, change, icon, trend = "up" }) => {
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";
  const trendIcon = trend === "up" ? "TrendingUp" : "TrendingDown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-card-hover transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {value}
            </p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
                <ApperIcon name={trendIcon} size={16} />
                <span className="text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <ApperIcon name={icon} className="text-primary" size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;