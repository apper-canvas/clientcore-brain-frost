import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { Card, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import CompanyForm from '@/components/organisms/CompanyForm';
import { companyService } from '@/services/api/companyService';
import { contactService } from '@/services/api/contactService';
import { toast } from 'react-toastify';

const Companies = () => {
const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [companiesData, contactsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll()
      ]);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      setError('Failed to load companies');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter companies based on search
const filteredCompanies = companies.filter(company =>
    !searchTerm || 
    company.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompanyContacts = (companyName) => {
    return contacts.filter(contact => contact.company === companyName);
  };

  const handleCompanySelect = (company) => {
    toast.info(`Selected company: ${company.name}`);
  };

const handleCreateCompany = () => {
    setShowCreateForm(true);
  };

  const handleCompanyCreated = async (newCompany) => {
    // Refresh the companies data after successful creation
    await loadData();
    setShowCreateForm(false);
  };

  const getSizeColor = (size) => {
    switch (size) {
      case 'Enterprise': return 'success';
      case 'Large': return 'accent';
      case 'Medium': return 'warning';
      case 'Small': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Companies</h2>
          <p className="text-slate-600">Manage your business relationships</p>
        </div>
        <Button 
          onClick={handleCreateCompany}
          className="bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        placeholder="Search companies..."
        className="max-w-md"
      />

      {/* Results Summary */}
      <div className="text-sm text-slate-600">
        Showing {filteredCompanies.length} of {companies.length} companies
      </div>

      {/* Company List */}
      {filteredCompanies.length === 0 ? (
        <Empty
          title={searchTerm ? "No companies found" : "No companies yet"}
          description={searchTerm ? "Try adjusting your search" : "Add your first company to get started"}
          icon="Building2"
          action={!searchTerm ? handleCreateCompany : null}
          actionLabel="Add Company"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company, index) => {
            const companyContacts = getCompanyContacts(company.name);
            return (
              <motion.div
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full"
                      onClick={() => handleCompanySelect(company)}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-lg">
{company.name_c?.charAt(0) || '?'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 hover:text-primary transition-colors">
{company.name_c}
                            </h3>
<p className="text-sm text-slate-600">{company.industry_c}</p>
                          </div>
                        </div>
<Badge variant={getSizeColor(company.size_c)}>
                          {company.size_c}
                        </Badge>
                      </div>

{company.website_c && (
                        <div className="flex items-center text-sm text-slate-600">
                          <ApperIcon name="Globe" size={14} className="mr-2" />
                          <span className="truncate">{company.website_c}</span>
                        </div>
                      )}

{company.address_c && (
                        <div className="flex items-center text-sm text-slate-600">
                          <ApperIcon name="MapPin" size={14} className="mr-2" />
                          <span className="truncate">
                            {company.address_c?.city}, {company.address_c?.state}
                          </span>
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-slate-600">
                            <ApperIcon name="Users" size={14} className="mr-1" />
                            <span>{companyContacts.length} contacts</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="Phone" size={14} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="Mail" size={14} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="MoreVertical" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>

{company.notes_c && (
                        <div className="bg-slate-50 rounded-md p-3">
                          <p className="text-sm text-slate-700 line-clamp-2">
                            {company.notes_c}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
<CompanyForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCompanyCreated={handleCompanyCreated}
      />
    </div>
  );
};

export default Companies;