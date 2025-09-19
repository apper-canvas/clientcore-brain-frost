import React, { useState } from 'react';
import DealPipeline from '@/components/organisms/DealPipeline';
import DealForm from '@/components/organisms/DealForm';
import { toast } from 'react-toastify';

const Deals = () => {
  const [showDealForm, setShowDealForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDealSelect = (deal) => {
    toast.info(`Selected deal: ${deal.Name || deal.title_c}`);
    // In a real app, this would open a deal detail view
  };

  const handleCreateDeal = () => {
    setShowDealForm(true);
  };

  const handleDealCreated = (newDeal) => {
    // Trigger pipeline refresh by updating key
    setRefreshKey(prev => prev + 1);
    setShowDealForm(false);
  };
return (
    <div>
      <DealPipeline 
        key={refreshKey}
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