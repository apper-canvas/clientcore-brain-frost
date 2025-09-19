import React from 'react';
import ContactList from '@/components/organisms/ContactList';
import { toast } from 'react-toastify';

const Contacts = () => {
  const handleContactSelect = (contact) => {
    toast.info(`Selected contact: ${contact.firstName} ${contact.lastName}`);
    // In a real app, this would open a contact detail view
  };

  const handleCreateContact = () => {
    toast.info('Create contact functionality would be implemented here');
    // In a real app, this would open a contact creation form
  };

  return (
    <div>
      <ContactList 
        onContactSelect={handleContactSelect}
        onCreateContact={handleCreateContact}
      />
    </div>
  );
};

export default Contacts;