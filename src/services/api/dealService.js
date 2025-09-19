class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
{"field": {"Name": "Name"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}}
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
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
{"field": {"Name": "Name"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [{
          Name: dealData.Name || dealData.title_c,
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c) || 0,
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c) || 0,
          expected_close_date_c: dealData.expected_close_date_c,
          notes_c: dealData.notes_c,
          created_at_c: new Date().toISOString(),
          contact_id_c: dealData.contact_id_c ? parseInt(dealData.contact_id_c) : null,
          company_id_c: dealData.company_id_c ? parseInt(dealData.company_id_c) : null
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
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: dealData.Name || dealData.title_c,
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c) || 0,
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c) || 0,
          expected_close_date_c: dealData.expected_close_date_c,
          notes_c: dealData.notes_c,
          contact_id_c: dealData.contact_id_c ? parseInt(dealData.contact_id_c) : null,
          company_id_c: dealData.company_id_c ? parseInt(dealData.company_id_c) : null
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
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByStage(stage) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
{"field": {"Name": "Name"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}}
        ],
        where: [{"FieldName": "stage_c", "Operator": "EqualTo", "Values": [stage]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByContact(contactId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
{"field": {"Name": "Name"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_id_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateStage(id, newStage) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          stage_c: newStage
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
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal stage:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const dealService = new DealService();