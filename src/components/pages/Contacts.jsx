import React from 'react';
import ContactList from '@/components/organisms/ContactList';
import { toast } from 'react-toastify';

const Contacts = () => {
const handleContactSelect = (contact) => {
    toast.info(`Selected contact: ${contact.first_name_c} ${contact.last_name_c}`);
    // In a real app, this would open a contact detail view
  };

const handleCreateContact = async (newContact) => {
    // Contact creation is handled by the ContactForm component
    // This callback receives the newly created contact for any additional processing
    toast.success(`Contact ${newContact.first_name_c} ${newContact.last_name_c} created successfully!`);
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