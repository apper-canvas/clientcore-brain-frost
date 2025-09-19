import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = "primary"
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    accent: "text-accent bg-accent/10"
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              {trend && trendValue && (
                <div className={`flex items-center text-sm ${
                  trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-slate-500'
                }`}>
                  <ApperIcon 
                    name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={14} 
                    className="mr-1"
                  />
                  {trendValue}
                </div>
              )}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;