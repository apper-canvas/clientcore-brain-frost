import React from 'react';
import DashboardStats from '@/components/organisms/DashboardStats';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to ClientCore
          </h1>
          <p className="text-slate-600 mt-2">
            Your customer relationship management dashboard
          </p>
        </div>
      </div>

      <DashboardStats />
    </div>
  );
};

export default Dashboard;