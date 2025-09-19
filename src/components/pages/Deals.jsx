import React from 'react';
import DealPipeline from '@/components/organisms/DealPipeline';
import { toast } from 'react-toastify';

const Deals = () => {
  const handleDealSelect = (deal) => {
    toast.info(`Selected deal: ${deal.title}`);
    // In a real app, this would open a deal detail view
  };

  const handleCreateDeal = () => {
    toast.info('Create deal functionality would be implemented here');
    // In a real app, this would open a deal creation form
  };

  return (
    <div>
      <DealPipeline 
        onDealSelect={handleDealSelect}
        onCreateDeal={handleCreateDeal}
      />
    </div>
  );
};

export default Deals;