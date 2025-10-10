import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { AuthContext } from '../App';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="flex items-center gap-2"
    >
      <ApperIcon name="LogOut" size={16} />
      Logout
    </Button>
  );
};

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden !p-2"
        >
          <ApperIcon name="Menu" size={24} />
        </Button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Users" className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent hidden sm:block">
            Pipeline CRM
          </span>
        </div>
      </div>
      
<div className="flex items-center gap-3">
        <LogoutButton />
        <Button variant="ghost" size="sm" className="!p-2 hidden sm:flex">
          <ApperIcon name="Bell" size={20} />
        </Button>
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">ST</span>
        </div>
      </div>
    </header>
  );
};

export default Header;