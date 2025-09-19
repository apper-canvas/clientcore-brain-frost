import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null,
  description = "We encountered an error while loading your data. Please try again."
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon 
          name="AlertTriangle" 
          size={32} 
          className="text-red-600"
        />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {message}
      </h3>
      
      <p className="text-slate-600 mb-6 max-w-md">
        {description}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;