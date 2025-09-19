class QuoteService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'quotes_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "deal_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "shipping_address_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "deal_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "shipping_address_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(quoteData) {
    try {
      const params = {
        records: [{
          Name: quoteData.Name,
          Tags: Array.isArray(quoteData.Tags) ? quoteData.Tags.join(',') : (quoteData.Tags || ''),
          company_c: quoteData.company_c,
          contact_c: quoteData.contact_c,
          deal_c: quoteData.deal_c,
          quote_date_c: quoteData.quote_date_c,
          status_c: quoteData.status_c,
          delivery_method_c: quoteData.delivery_method_c,
          expires_on_c: quoteData.expires_on_c,
          billing_address_c: typeof quoteData.billing_address_c === 'object' 
            ? JSON.stringify(quoteData.billing_address_c)
            : quoteData.billing_address_c,
          shipping_address_c: typeof quoteData.shipping_address_c === 'object'
            ? JSON.stringify(quoteData.shipping_address_c)
            : quoteData.shipping_address_c
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, quoteData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: quoteData.Name,
          Tags: Array.isArray(quoteData.Tags) ? quoteData.Tags.join(',') : (quoteData.Tags || ''),
          company_c: quoteData.company_c,
          contact_c: quoteData.contact_c,
          deal_c: quoteData.deal_c,
          quote_date_c: quoteData.quote_date_c,
          status_c: quoteData.status_c,
          delivery_method_c: quoteData.delivery_method_c,
          expires_on_c: quoteData.expires_on_c,
          billing_address_c: typeof quoteData.billing_address_c === 'object'
            ? JSON.stringify(quoteData.billing_address_c)
            : quoteData.billing_address_c,
          shipping_address_c: typeof quoteData.shipping_address_c === 'object'
            ? JSON.stringify(quoteData.shipping_address_c)
            : quoteData.shipping_address_c
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "deal_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "expires_on_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "Name", "operator": "Contains", "values": [query]},
                {"fieldName": "company_c", "operator": "Contains", "values": [query]},
                {"fieldName": "contact_c", "operator": "Contains", "values": [query]},
                {"fieldName": "deal_c", "operator": "Contains", "values": [query]},
                {"fieldName": "status_c", "operator": "Contains", "values": [query]}
              ],
              operator: "OR"
            }
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching quotes:", error?.response?.data?.message || error);
      return [];
    }
  }

  parseAddress(addressString) {
    try {
      if (typeof addressString === 'string' && addressString.trim()) {
        return JSON.parse(addressString);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  formatAddress(addressObj) {
    if (!addressObj || typeof addressObj !== 'object') return '';
    const { name = '', street = '', city = '', state = '', country = '', pincode = '' } = addressObj;
    return [name, street, city, state, country, pincode].filter(Boolean).join(', ');
  }
}

export const quoteService = new QuoteService();