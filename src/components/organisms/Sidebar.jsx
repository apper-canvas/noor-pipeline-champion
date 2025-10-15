import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { name: "Contacts", path: "/contacts", icon: "Users" },
    { name: "Leads", path: "/leads", icon: "User" },
    { name: "Accounts", path: "/accounts", icon: "Building2" },
    { name: "Pipeline", path: "/pipeline", icon: "Kanban" },
    { name: "Activities", path: "/activities", icon: "Activity" }
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:block">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-sm"
                  : "text-secondary hover:bg-gray-50"
              )
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;