import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ContactForm from "@/components/organisms/ContactForm";
import Contacts from "@/components/pages/Contacts";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import FilterBar from "@/components/molecules/FilterBar";
import SearchBar from "@/components/molecules/SearchBar";

// Safe date formatting utility
const formatSafeDate = (date, formatString) => {
  if (!date) return 'Never';
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

const ContactList = ({ onContactSelect, onCreateContact }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    company: '',
    tags: ''
  });

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCreateClick = () => {
    setShowCreateForm(true);
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
  };

  const handleContactCreated = (newContact) => {
    // Refresh the contacts list
    loadContacts();
    setShowCreateForm(false);
    // Call parent callback if provided
    onCreateContact && onCreateContact(newContact);
  };

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = !filters.company || contact.company === filters.company;
const matchesTags = !filters.tags || (contact.tags && contact.tags.includes(filters.tags));

    return matchesSearch && matchesCompany && matchesTags;
  });

  // Get unique companies and tags for filters
  const companies = [...new Set(contacts.map(c => c.company))];
const allTags = [...new Set(contacts.flatMap(c => c.tags || []))];

  const filterOptions = [
    {
      key: 'company',
      value: filters.company,
      placeholder: 'All Companies',
      options: companies.map(company => ({ value: company, label: company }))
    },
    {
      key: 'tags',
      value: filters.tags,
      placeholder: 'All Tags',
      options: allTags.map(tag => ({ value: tag, label: tag }))
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ company: '', tags: '' });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  if (loading) return <Loading type="contacts" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
          <p className="text-slate-600">Manage your customer relationships</p>
</div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Search contacts..."
          className="max-w-md"
        />
        
        <FilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Results Summary */}
      <div className="text-sm text-slate-600">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>

      {/* Contact List */}
      {filteredContacts.length === 0 ? (
        <Empty
          title={searchTerm ? "No contacts found" : "No contacts yet"}
          description={searchTerm ? "Try adjusting your search or filters" : "Add your first contact to get started"}
          icon="Users"
action={!searchTerm ? handleCreateClick : null}
          actionLabel="Add Contact"
        />
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => onContactSelect(contact)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold text-lg">
{(contact.firstName?.charAt(0) ?? '?')}{(contact.lastName?.charAt(0) ?? '?')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-slate-600">{contact.email}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                          <span className="flex items-center">
                            <ApperIcon name="Building2" size={14} className="mr-1" />
                            {contact.company}
                          </span>
                          {contact.position && (
                            <span>• {contact.position}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 mb-2 justify-end">
{(contact.tags || []).slice(0, 2).map(tag => (
                            <Badge key={tag} variant="primary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(contact.tags || []).length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(contact.tags || []).length - 2}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
Last contact: {formatSafeDate(contact.lastContact, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Phone" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Mail" size={16} />
                        </Button>
<Button variant="ghost" size="sm">
                          <ApperIcon name="MoreVertical" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={showCreateForm}
        onClose={handleCreateFormClose}
        onContactCreated={handleContactCreated}
      />
    </div>
  );
};

export default ContactList;