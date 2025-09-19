import React from 'react';
import ContactList from '@/components/organisms/ContactList';
import { toast } from 'react-toastify';

const Contacts = () => {
  const handleContactSelect = (contact) => {
    toast.info(`Selected contact: ${contact.firstName} ${contact.lastName}`);
    // In a real app, this would open a contact detail view
  };

const handleCreateContact = async (newContact) => {
    // Contact creation is handled by the ContactForm component
    // This callback receives the newly created contact for any additional processing
    console.log('New contact created:', newContact);
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