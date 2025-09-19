import React, { useState } from 'react';
import DealPipeline from '@/components/organisms/DealPipeline';
import DealForm from '@/components/organisms/DealForm';
import { toast } from 'react-toastify';

const Deals = () => {
  const [showDealForm, setShowDealForm] = useState(false);

  const handleDealSelect = (deal) => {
    toast.info(`Selected deal: ${deal.title}`);
    // In a real app, this would open a deal detail view
  };

  const handleCreateDeal = () => {
    setShowDealForm(true);
  };

  const handleDealCreated = (newDeal) => {
    // Refresh the pipeline by triggering a re-render
    window.location.reload();
  };
  return (
<div>
      <DealPipeline 
        onDealSelect={handleDealSelect}
        onCreateDeal={handleCreateDeal}
      />
      <DealForm
        isOpen={showDealForm}
        onClose={() => setShowDealForm(false)}
        onDealCreated={handleDealCreated}
      />
    </div>
  );
};

export default Deals;