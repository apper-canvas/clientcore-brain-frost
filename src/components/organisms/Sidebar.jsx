import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/contacts', label: 'Contacts', icon: 'Users' },
    { path: '/companies', label: 'Companies', icon: 'Building2' },
    { path: '/deals', label: 'Deals', icon: 'Target' },
    { path: '/quotes', label: 'Quotes', icon: 'FileText' },
    { path: '/sales-orders', label: 'Sales Orders', icon: 'ShoppingCart' },
    { path: '/reports', label: 'Reports', icon: 'BarChart3' },
  ];

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <NavLink
        to={item.path}
        onClick={isMobile ? onClose : undefined}
        className={({ isActive }) =>
          cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )
        }
      >
        <ApperIcon name={item.icon} size={20} />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white lg:shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ClientCore
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            ClientCore v1.0
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-slate-200"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ClientCore
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.path} item={item} isMobile />
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;