import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Card } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { salesOrderService } from '@/services/api/salesOrderService';

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    order_number_c: '',
    order_date_c: '',
    customer_name_c: '',
    total_amount_c: '',
    status_c: 'Draft'
  });
  const [formLoading, setFormLoading] = useState(false);

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesOrderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch sales orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term) {
      try {
        const results = await salesOrderService.search(term);
        setOrders(results);
      } catch (err) {
        toast.error('Search failed');
      }
    } else {
      fetchOrders();
    }
  };

  const openModal = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        Name: order.Name || '',
        Tags: order.Tags || '',
        order_number_c: order.order_number_c || '',
        order_date_c: order.order_date_c ? order.order_date_c.split('T')[0] : '',
        customer_name_c: order.customer_name_c || '',
        total_amount_c: order.total_amount_c || '',
        status_c: order.status_c || 'Draft'
      });
    } else {
      setEditingOrder(null);
      setFormData({
        Name: '',
        Tags: '',
        order_number_c: '',
        order_date_c: '',
        customer_name_c: '',
        total_amount_c: '',
        status_c: 'Draft'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOrder(null);
    setFormData({
      Name: '',
      Tags: '',
      order_number_c: '',
      order_date_c: '',
      customer_name_c: '',
      total_amount_c: '',
      status_c: 'Draft'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Format data for submission
      const submitData = {
        ...formData,
        order_date_c: formData.order_date_c ? new Date(formData.order_date_c).toISOString().split('T')[0] : '',
        total_amount_c: parseFloat(formData.total_amount_c) || 0
      };

      if (editingOrder) {
        await salesOrderService.update(editingOrder.Id, submitData);
        toast.success('Sales order updated successfully');
      } else {
        await salesOrderService.create(submitData);
        toast.success('Sales order created successfully');
      }
      
      closeModal();
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      try {
        await salesOrderService.delete(id);
        toast.success('Sales order deleted successfully');
        fetchOrders();
      } catch (err) {
        toast.error(err.message || 'Delete failed');
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Confirmed': return 'info';
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name_c?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || order.status_c === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;
  if (error && !orders.length) return <Error message={error} onRetry={fetchOrders} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales Orders</h1>
          <p className="text-slate-600">Manage your sales orders and track deliveries</p>
        </div>
        <Button onClick={() => openModal()} className="sm:w-auto w-full">
          <ApperIcon name="Plus" size={16} />
          New Sales Order
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search sales orders..."
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

      {/* Orders List */}
      <Card>
        {filteredOrders.length === 0 ? (
          <Empty 
            title="No sales orders found"
            description="Create your first sales order to get started."
            action={
              <Button onClick={() => openModal()}>
                <ApperIcon name="Plus" size={16} />
                Create Sales Order
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Order</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Order Number</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Total Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Order Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{order.Name}</div>
                        {order.Tags && (
                          <div className="text-sm text-slate-500">{order.Tags}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{order.order_number_c}</td>
                    <td className="py-3 px-4 text-slate-700">{order.customer_name_c}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {order.total_amount_c ? `$${Number(order.total_amount_c).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(order.status_c)}>
                        {order.status_c}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {order.order_date_c ? new Date(order.order_date_c).toLocaleDateString() : ''}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal(order)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order.Id)}
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
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingOrder ? 'Edit Sales Order' : 'New Sales Order'}
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

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Order Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Order Number"
                    name="order_number_c"
                    value={formData.order_number_c}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Customer Name"
                    name="customer_name_c"
                    value={formData.customer_name_c}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Total Amount"
                    name="total_amount_c"
                    type="number"
                    step="0.01"
                    value={formData.total_amount_c}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Order Date"
                    name="order_date_c"
                    type="date"
                    value={formData.order_date_c}
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
                </div>
                <Input
                  label="Tags"
                  name="Tags"
                  value={formData.Tags}
                  onChange={handleInputChange}
                  placeholder="Comma-separated tags"
                />
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1"
                >
                  {formLoading ? (
                    <>
                      <ApperIcon name="Loader" size={16} className="animate-spin" />
                      {editingOrder ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} />
                      {editingOrder ? 'Update Order' : 'Create Order'}
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

export default SalesOrders;