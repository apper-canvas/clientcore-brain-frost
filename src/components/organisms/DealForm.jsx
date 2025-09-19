import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Card, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { toast } from 'react-toastify';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';

const DealForm = ({ isOpen, onClose, onDealCreated }) => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title_c: '',
    value_c: '',
    stage_c: 'lead',
    probability_c: 0,
    expected_close_date_c: '',
    notes_c: '',
    contact_id_c: '',
    company_id_c: ''
  });
  const [errors, setErrors] = useState({});

  const stageOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  // Load contacts and companies for dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsData, companiesData] = await Promise.all([
          contactService.getAll(),
          companyService.getAll()
        ]);
        setContacts(contactsData || []);
        setCompanies(companiesData || []);
      } catch (error) {
        console.error('Error loading form data:', error);
        setContacts([]);
        setCompanies([]);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title_c.trim()) {
      newErrors.title_c = 'Deal title is required';
    }

    if (!formData.value_c || parseFloat(formData.value_c) < 0) {
      newErrors.value_c = 'Deal value must be a positive number';
    }

    if (!formData.stage_c) {
      newErrors.stage_c = 'Deal stage is required';
    }

    if (formData.probability_c < 0 || formData.probability_c > 100) {
      newErrors.probability_c = 'Probability must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    try {
      const newDeal = await dealService.create({
        ...formData,
        Name: formData.title_c,
        value_c: parseFloat(formData.value_c) || 0,
        probability_c: parseInt(formData.probability_c) || 0,
        contact_id_c: formData.contact_id_c ? parseInt(formData.contact_id_c) : null,
        company_id_c: formData.company_id_c ? parseInt(formData.company_id_c) : null
      });
      
      toast.success('Deal created successfully!');
      onDealCreated && onDealCreated(newDeal);
      handleClose();
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Failed to create deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title_c: '',
        value_c: '',
        stage_c: 'lead',
        probability_c: 0,
        expected_close_date_c: '',
        notes_c: '',
        contact_id_c: '',
        company_id_c: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Create New Deal</h2>
                <p className="text-sm text-slate-500">Add a new deal to your pipeline</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={loading}
              className="text-slate-400 hover:text-slate-600"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Deal Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Deal Title *
                </label>
                <Input
                  value={formData.title_c}
                  onChange={(e) => handleInputChange('title_c', e.target.value)}
                  placeholder="Enter deal title"
                  error={errors.title_c}
                  disabled={loading}
                />
                {errors.title_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.title_c}</p>
                )}
              </div>

              {/* Value and Probability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deal Value *
                  </label>
                  <Input
                    type="number"
                    value={formData.value_c}
                    onChange={(e) => handleInputChange('value_c', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    error={errors.value_c}
                    disabled={loading}
                  />
                  {errors.value_c && (
                    <p className="mt-1 text-sm text-red-600">{errors.value_c}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Probability (%)
                  </label>
                  <Input
                    type="number"
                    value={formData.probability_c}
                    onChange={(e) => handleInputChange('probability_c', e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                    error={errors.probability_c}
                    disabled={loading}
                  />
                  {errors.probability_c && (
                    <p className="mt-1 text-sm text-red-600">{errors.probability_c}</p>
                  )}
                </div>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Deal Stage *
                </label>
                <Select
                  value={formData.stage_c}
                  onValueChange={(value) => handleInputChange('stage_c', value)}
                  disabled={loading}
                >
                  {stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.stage_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.stage_c}</p>
                )}
              </div>

              {/* Expected Close Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expected Close Date
                </label>
                <Input
                  type="date"
                  value={formData.expected_close_date_c}
                  onChange={(e) => handleInputChange('expected_close_date_c', e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Contact and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact
                  </label>
                  <Select
                    value={formData.contact_id_c}
                    onValueChange={(value) => handleInputChange('contact_id_c', value)}
                    disabled={loading}
                  >
                    <option value="">Select a contact</option>
                    {contacts.map((contact) => (
                      <option key={contact.Id} value={contact.Id}>
                        {contact.Name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company
                  </label>
                  <Select
                    value={formData.company_id_c}
                    onValueChange={(value) => handleInputChange('company_id_c', value)}
                    disabled={loading}
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.Id} value={company.Id}>
                        {company.Name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes_c || ''}
                  onChange={(e) => handleInputChange('notes_c', e.target.value)}
                  placeholder="Add any additional notes about this deal..."
                  rows={4}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Target" size={16} />
                      <span>Create Deal</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DealForm;