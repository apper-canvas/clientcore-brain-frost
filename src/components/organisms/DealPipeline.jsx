import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { format } from 'date-fns';

const DealPipeline = ({ onDealSelect, onCreateDeal }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-slate-100 text-slate-700', count: 0 },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-700', count: 0 },
    { id: 'proposal', name: 'Proposal', color: 'bg-amber-100 text-amber-700', count: 0 },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-700', count: 0 },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100 text-green-700', count: 0 },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-700', count: 0 }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load pipeline data');
      console.error('Error loading pipeline data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Group deals by stage and calculate counts
  const dealsByStage = stages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage.id);
    return {
      ...stage,
      deals: stageDeals,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
    };
  });

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === parseInt(contactId));
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-amber-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) return <Loading type="pipeline" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales Pipeline</h2>
          <p className="text-slate-600">Track your deals through the sales process</p>
        </div>
        <Button 
          onClick={onCreateDeal}
          className="bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dealsByStage.map((stage) => (
          <Card key={stage.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="text-center">
                <Badge className={stage.color + " mb-2"}>
                  {stage.name}
                </Badge>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stage.count}
                </div>
                <div className="text-sm text-slate-600">
                  {formatCurrency(stage.value)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <Empty
          title="No deals in pipeline"
          description="Create your first deal to start tracking opportunities"
          icon="Target"
          action={onCreateDeal}
          actionLabel="Create Deal"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {dealsByStage.map((stage) => (
            <div key={stage.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{stage.name}</h3>
                <Badge className={stage.color + " text-xs"}>
                  {stage.count}
                </Badge>
              </div>
              
              <div className="space-y-3 min-h-[400px]">
                <AnimatePresence>
                  {stage.deals.map((deal, index) => (
                    <motion.div
                      key={deal.Id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        onClick={() => onDealSelect(deal)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                {deal.title}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-1">
                                {getContactName(deal.contactId)}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-slate-900">
                                {formatCurrency(deal.value)}
                              </div>
                              <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                                {deal.probability}%
                              </div>
                            </div>
                            
                            {deal.expectedCloseDate && (
                              <div className="flex items-center text-xs text-slate-500">
                                <ApperIcon name="Calendar" size={12} className="mr-1" />
                                Close: {format(new Date(deal.expectedCloseDate), 'MMM dd')}
                              </div>
                            )}
                            
                            {deal.notes && (
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {deal.notes}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {stage.deals.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-500">No deals in this stage</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealPipeline;