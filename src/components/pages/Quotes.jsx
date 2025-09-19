import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import FilterBar from '@/components/molecules/FilterBar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { quoteService } from '@/services/api/quoteService';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    company_c: '',
    contact_c: '',
    deal_c: '',
    quote_date_c: '',
    status_c: 'Draft',
    delivery_method_c: 'Email',
    expires_on_c: '',
    billing_address_c: {
      name: '',
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    shipping_address_c: {
      name: '',
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    }
  });
  const [formLoading, setFormLoading] = useState(false);

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Declined', label: 'Declined' },
    { value: 'Expired', label: 'Expired' }
  ];

  const deliveryMethods = [
    { value: 'Email', label: 'Email' },
    { value: 'Mail', label: 'Mail' },
    { value: 'Hand Delivery', label: 'Hand Delivery' },
    { value: 'Pickup', label: 'Pickup' }
  ];

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.getAll();
      setQuotes(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term) {
      try {
        const results = await quoteService.search(term);
        setQuotes(results);
      } catch (err) {
        toast.error('Search failed');
      }
    } else {
      fetchQuotes();
    }
  };

  const openModal = (quote = null) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData({
        Name: quote.Name || '',
        Tags: quote.Tags || '',
        company_c: quote.company_c || '',
        contact_c: quote.contact_c || '',
        deal_c: quote.deal_c || '',
        quote_date_c: quote.quote_date_c ? quote.quote_date_c.split('T')[0] : '',
        status_c: quote.status_c || 'Draft',
        delivery_method_c: quote.delivery_method_c || 'Email',
        expires_on_c: quote.expires_on_c ? quote.expires_on_c.split('T')[0] : '',
        billing_address_c: quoteService.parseAddress(quote.billing_address_c) || {
          name: '', street: '', city: '', state: '', country: '', pincode: ''
        },
        shipping_address_c: quoteService.parseAddress(quote.shipping_address_c) || {
          name: '', street: '', city: '', state: '', country: '', pincode: ''
        }
      });
    } else {
      setEditingQuote(null);
      setFormData({
        Name: '',
        Tags: '',
        company_c: '',
        contact_c: '',
        deal_c: '',
        quote_date_c: '',
        status_c: 'Draft',
        delivery_method_c: 'Email',
        expires_on_c: '',
        billing_address_c: {
          name: '', street: '', city: '', state: '', country: '', pincode: ''
        },
        shipping_address_c: {
          name: '', street: '', city: '', state: '', country: '', pincode: ''
        }
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuote(null);
    setFormData({
      Name: '',
      Tags: '',
      company_c: '',
      contact_c: '',
      deal_c: '',
      quote_date_c: '',
      status_c: 'Draft',
      delivery_method_c: 'Email',
      expires_on_c: '',
      billing_address_c: {
        name: '', street: '', city: '', state: '', country: '', pincode: ''
      },
      shipping_address_c: {
        name: '', street: '', city: '', state: '', country: '', pincode: ''
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Format dates for submission
      const submitData = {
        ...formData,
        quote_date_c: formData.quote_date_c ? new Date(formData.quote_date_c).toISOString() : '',
        expires_on_c: formData.expires_on_c ? new Date(formData.expires_on_c).toISOString() : ''
      };

      if (editingQuote) {
        await quoteService.update(editingQuote.Id, submitData);
        toast.success('Quote updated successfully');
      } else {
        await quoteService.create(submitData);
        toast.success('Quote created successfully');
      }
      
      closeModal();
      fetchQuotes();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await quoteService.delete(id);
        toast.success('Quote deleted successfully');
        fetchQuotes();
      } catch (err) {
        toast.error(err.message || 'Delete failed');
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Sent': return 'info';
      case 'Accepted': return 'success';
      case 'Declined': return 'destructive';
      case 'Expired': return 'secondary';
      default: return 'default';
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = !searchTerm || 
      quote.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.contact_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || quote.status_c === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;
  if (error && !quotes.length) return <Error message={error} onRetry={fetchQuotes} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="text-slate-600">Manage your quotes and proposals</p>
        </div>
        <Button onClick={() => openModal()} className="sm:w-auto w-full">
          <ApperIcon name="Plus" size={16} />
          New Quote
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="sm:w-48"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Quotes List */}
      <Card>
        {filteredQuotes.length === 0 ? (
          <Empty 
            title="No quotes found"
            description="Create your first quote to get started."
            action={
              <Button onClick={() => openModal()}>
                <ApperIcon name="Plus" size={16} />
                Create Quote
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Quote</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Quote Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Expires On</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <motion.tr
                    key={quote.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{quote.Name}</div>
                        {quote.Tags && (
                          <div className="text-sm text-slate-500">{quote.Tags}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{quote.company_c}</td>
                    <td className="py-3 px-4 text-slate-700">{quote.contact_c}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(quote.status_c)}>
                        {quote.status_c}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {quote.quote_date_c ? new Date(quote.quote_date_c).toLocaleDateString() : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {quote.expires_on_c ? new Date(quote.expires_on_c).toLocaleDateString() : ''}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal(quote)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(quote.Id)}
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingQuote ? 'Edit Quote' : 'New Quote'}
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Quote Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Tags"
                    name="Tags"
                    value={formData.Tags}
                    onChange={handleInputChange}
                    placeholder="Comma-separated tags"
                  />
                  <Input
                    label="Company"
                    name="company_c"
                    value={formData.company_c}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Contact"
                    name="contact_c"
                    value={formData.contact_c}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Deal"
                    name="deal_c"
                    value={formData.deal_c}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Quote Date"
                    name="quote_date_c"
                    type="date"
                    value={formData.quote_date_c}
                    onChange={handleInputChange}
                    required
                  />
                  <Select
                    label="Status"
                    name="status_c"
                    value={formData.status_c}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Select
                    label="Delivery Method"
                    name="delivery_method_c"
                    value={formData.delivery_method_c}
                    onChange={handleInputChange}
                  >
                    {deliveryMethods.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Expires On"
                    name="expires_on_c"
                    type="date"
                    value={formData.expires_on_c}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Billing Address */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Bill To Name"
                      value={formData.billing_address_c.name}
                      onChange={(e) => handleAddressChange('billing_address_c', 'name', e.target.value)}
                    />
                    <Input
                      label="Street"
                      value={formData.billing_address_c.street}
                      onChange={(e) => handleAddressChange('billing_address_c', 'street', e.target.value)}
                    />
                    <Input
                      label="City"
                      value={formData.billing_address_c.city}
                      onChange={(e) => handleAddressChange('billing_address_c', 'city', e.target.value)}
                    />
                    <Input
                      label="State"
                      value={formData.billing_address_c.state}
                      onChange={(e) => handleAddressChange('billing_address_c', 'state', e.target.value)}
                    />
                    <Input
                      label="Country"
                      value={formData.billing_address_c.country}
                      onChange={(e) => handleAddressChange('billing_address_c', 'country', e.target.value)}
                    />
                    <Input
                      label="Pincode"
                      value={formData.billing_address_c.pincode}
                      onChange={(e) => handleAddressChange('billing_address_c', 'pincode', e.target.value)}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Ship To Name"
                      value={formData.shipping_address_c.name}
                      onChange={(e) => handleAddressChange('shipping_address_c', 'name', e.target.value)}
                    />
                    <Input
                      label="Street"
                      value={formData.shipping_address_c.street}
                      onChange={(e) => handleAddressChange('shipping_address_c', 'street', e.target.value)}
                    />
                    <Input
                      label="City"
                      value={formData.shipping_address_c.city}
                      onChange={(e) => handleAddressChange('shipping_address_c', 'city', e.target.value)}
                    />
                    <Input
                      label="State"
                      value={formData.shipping_address_c.state}
                      onChange={(e) => handleAddressChange('shipping_address_c', 'state', e.target.value)}
                    />
                    <Input
                      label="Country"
                      value={formData.shipping_address_c.country}
                      onChange={(e) => handleAddressChange('shipping_address_c', 'country', e.target.value)}
                    />
                    <Input
                      label="Pincode"
                      value={formData.shipping_address_c.pincode}
                      onChange={(e) => handleAddressChange('shipping_address_c', 'pincode', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1"
                >
                  {formLoading ? (
                    <>
                      <ApperIcon name="Loader" size={16} className="animate-spin" />
                      {editingQuote ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} />
                      {editingQuote ? 'Update Quote' : 'Create Quote'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={formLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Quotes;