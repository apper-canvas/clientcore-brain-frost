import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Card, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { toast } from 'react-toastify';
import { contactService } from '@/services/api/contactService';

const ContactForm = ({ isOpen, onClose, onContactCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    phone_c: '',
    company_c: '',
    position_c: '',
    tags_c: []
  });
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'prospect', label: 'Prospect' }
  ];

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

    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = 'First name is required';
    }

    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = 'Last name is required';
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = 'Email is invalid';
    }

    if (formData.phone_c && !/^[\d\s\-+()]+$/.test(formData.phone_c)) {
      newErrors.phone_c = 'Phone number is invalid';
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
      const newContact = await contactService.create({
        ...formData,
        Name: `${formData.first_name_c} ${formData.last_name_c}`
      });
      
      toast.success('Contact created successfully!');
      onContactCreated && onContactCreated(newContact);
      handleClose();
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error('Failed to create contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleClose = () => {
    if (!loading) {
      setFormData({
        first_name_c: '',
        last_name_c: '',
        email_c: '',
        phone_c: '',
        company_c: '',
        position_c: '',
        tags_c: []
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
                <ApperIcon name="UserPlus" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Create New Contact</h2>
                <p className="text-sm text-slate-500">Add a new contact to your database</p>
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
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <Input
value={formData.first_name_c}
                    onChange={(e) => handleInputChange('first_name_c', e.target.value)}
                    placeholder="Enter first name"
                    error={errors.first_name_c}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <Input
value={formData.last_name_c}
                    onChange={(e) => handleInputChange('last_name_c', e.target.value)}
                    placeholder="Enter last name"
                    error={errors.last_name_c}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <Input
type="email"
                    value={formData.email_c}
                    onChange={(e) => handleInputChange('email_c', e.target.value)}
                    placeholder="Enter email address"
                    error={errors.email_c}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
value={formData.phone_c}
                    onChange={(e) => handleInputChange('phone_c', e.target.value)}
                    placeholder="Enter phone number"
                    error={errors.phone_c}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company
                  </label>
                  <Input
value={formData.company_c}
                    onChange={(e) => handleInputChange('company_c', e.target.value)}
                    placeholder="Enter company name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Position
                  </label>
                  <Input
value={formData.position_c}
                    onChange={(e) => handleInputChange('position_c', e.target.value)}
                    placeholder="Enter job title"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <Select
value={formData.tags_c}
                  onValueChange={(value) => handleInputChange('tags_c', value)}
                  disabled={loading}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
value={formData.notes_c || ''}
                  onChange={(e) => handleInputChange('notes_c', e.target.value)}
                  placeholder="Add any additional notes..."
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
                      <ApperIcon name="UserPlus" size={16} />
                      <span>Create Contact</span>
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

export default ContactForm;