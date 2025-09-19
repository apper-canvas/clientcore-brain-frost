import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button and title */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          </div>

          {/* Header actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <ApperIcon name="Search" size={16} className="mr-2" />
              Search
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
            >
              <ApperIcon name="Bell" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
            >
              <ApperIcon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;