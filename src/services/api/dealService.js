const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const dealService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "closed_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI field names for backward compatibility
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || deal.Name,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        value: deal.value_c || 0,
        stage: deal.stage_c,
        probability: deal.probability_c || 0,
        expectedCloseDate: deal.expected_close_date_c,
        notes: deal.notes_c,
        createdAt: deal.created_at_c,
        updatedAt: deal.updated_at_c,
        closedAt: deal.closed_at_c
      }));
    } catch (error) {
      console.error("Error fetching deals:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "closed_at_c"}}
        ]
      });

      if (!response.data) {
        return null;
      }

      // Map database fields to UI field names
      const deal = response.data;
      return {
        Id: deal.Id,
        title: deal.title_c || deal.Name,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        value: deal.value_c || 0,
        stage: deal.stage_c,
        probability: deal.probability_c || 0,
        expectedCloseDate: deal.expected_close_date_c,
        notes: deal.notes_c,
        createdAt: deal.created_at_c,
        updatedAt: deal.updated_at_c,
        closedAt: deal.closed_at_c
      };
    } catch (error) {
      console.error("Error fetching deal:", error);
      return null;
    }
  },

  getByContactId: async (contactId) => {
    try {
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "closed_at_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}]
      });

      if (!response.success) {
        return [];
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || deal.Name,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        value: deal.value_c || 0,
        stage: deal.stage_c,
        probability: deal.probability_c || 0,
        expectedCloseDate: deal.expected_close_date_c,
        notes: deal.notes_c,
        createdAt: deal.created_at_c,
        updatedAt: deal.updated_at_c,
        closedAt: deal.closed_at_c
      }));
    } catch (error) {
      console.error("Error fetching deals by contact:", error);
      return [];
    }
  },

  create: async (dealData) => {
    try {
      // Map UI field names to database field names, only include Updateable fields
      const dbData = {
        title_c: dealData.title,
        contact_id_c: parseInt(dealData.contactId),
        value_c: parseFloat(dealData.value),
        stage_c: dealData.stage,
        probability_c: parseInt(dealData.probability),
        expected_close_date_c: dealData.expectedCloseDate,
        notes_c: dealData.notes,
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      };

      // Remove undefined/null values
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === undefined || dbData[key] === null || dbData[key] === '') {
          delete dbData[key];
        }
      });

      const response = await apperClient.createRecord('deal_c', {
        records: [dbData]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Map back to UI field names
          const deal = result.data;
          return {
            Id: deal.Id,
            title: deal.title_c || deal.Name,
            contactId: deal.contact_id_c?.Id || deal.contact_id_c,
            value: deal.value_c || 0,
            stage: deal.stage_c,
            probability: deal.probability_c || 0,
            expectedCloseDate: deal.expected_close_date_c,
            notes: deal.notes_c,
            createdAt: deal.created_at_c,
            updatedAt: deal.updated_at_c,
            closedAt: deal.closed_at_c
          };
        } else {
          throw new Error(result.message || 'Failed to create deal');
        }
      }

      throw new Error('No results returned');
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  update: async (id, dealData) => {
    try {
      // Map UI field names to database field names, only include Updateable fields
      const dbData = {
        Id: parseInt(id)
      };

      if (dealData.title !== undefined) dbData.title_c = dealData.title;
      if (dealData.contactId !== undefined) dbData.contact_id_c = parseInt(dealData.contactId);
      if (dealData.value !== undefined) dbData.value_c = parseFloat(dealData.value);
      if (dealData.stage !== undefined) dbData.stage_c = dealData.stage;
      if (dealData.probability !== undefined) dbData.probability_c = parseInt(dealData.probability);
      if (dealData.expectedCloseDate !== undefined) dbData.expected_close_date_c = dealData.expectedCloseDate;
      if (dealData.notes !== undefined) dbData.notes_c = dealData.notes;
      
      dbData.updated_at_c = new Date().toISOString();

      // Set closed_at_c if deal is being closed
      if (dealData.stage === "Closed Won" || dealData.stage === "Closed Lost") {
        dbData.closed_at_c = new Date().toISOString();
      }

      const response = await apperClient.updateRecord('deal_c', {
        records: [dbData]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Map back to UI field names
          const deal = result.data;
          return {
            Id: deal.Id,
            title: deal.title_c || deal.Name,
            contactId: deal.contact_id_c?.Id || deal.contact_id_c,
            value: deal.value_c || 0,
            stage: deal.stage_c,
            probability: deal.probability_c || 0,
            expectedCloseDate: deal.expected_close_date_c,
            notes: deal.notes_c,
            createdAt: deal.created_at_c,
            updatedAt: deal.updated_at_c,
            closedAt: deal.closed_at_c
          };
        } else {
          throw new Error(result.message || 'Failed to update deal');
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('deal_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.success;
      }

      return false;
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
};

export default dealService;
export default dealService;