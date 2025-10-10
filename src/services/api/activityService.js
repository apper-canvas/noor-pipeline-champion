const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const activityService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "created_by_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI field names for backward compatibility
      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        subject: activity.subject_c || activity.Name,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        createdBy: activity.created_by_c || "Sales Team"
      }));
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "created_by_c"}}
        ]
      });

      if (!response.data) {
        return null;
      }

      // Map database fields to UI field names
      const activity = response.data;
      return {
        Id: activity.Id,
        type: activity.type_c,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        subject: activity.subject_c || activity.Name,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        createdBy: activity.created_by_c || "Sales Team"
      };
    } catch (error) {
      console.error("Error fetching activity:", error);
      return null;
    }
  },

  getByContactId: async (contactId) => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "created_by_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        subject: activity.subject_c || activity.Name,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        createdBy: activity.created_by_c || "Sales Team"
      }));
    } catch (error) {
      console.error("Error fetching activities by contact:", error);
      return [];
    }
  },

  getByDealId: async (dealId) => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "created_by_c"}}
        ],
        where: [{"FieldName": "deal_id_c", "Operator": "EqualTo", "Values": [parseInt(dealId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        subject: activity.subject_c || activity.Name,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        createdBy: activity.created_by_c || "Sales Team"
      }));
    } catch (error) {
      console.error("Error fetching activities by deal:", error);
      return [];
    }
  },

  create: async (activityData) => {
    try {
      // Map UI field names to database field names, only include Updateable fields
      const dbData = {
        type_c: activityData.type,
        contact_id_c: parseInt(activityData.contactId),
        subject_c: activityData.subject,
        description_c: activityData.description,
        timestamp_c: new Date().toISOString(),
        created_by_c: activityData.createdBy || "Sales Team"
      };

      // Handle optional deal_id
      if (activityData.dealId && activityData.dealId !== '') {
        dbData.deal_id_c = parseInt(activityData.dealId);
      }

      // Remove undefined/null values
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === undefined || dbData[key] === null || dbData[key] === '') {
          delete dbData[key];
        }
      });

      const response = await apperClient.createRecord('activity_c', {
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
          const activity = result.data;
          return {
            Id: activity.Id,
            type: activity.type_c,
            contactId: activity.contact_id_c?.Id || activity.contact_id_c,
            dealId: activity.deal_id_c?.Id || activity.deal_id_c,
            subject: activity.subject_c || activity.Name,
            description: activity.description_c,
            timestamp: activity.timestamp_c,
            createdBy: activity.created_by_c || "Sales Team"
          };
        } else {
          throw new Error(result.message || 'Failed to create activity');
        }
      }

      throw new Error('No results returned');
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  },

  update: async (id, activityData) => {
    try {
      // Map UI field names to database field names, only include Updateable fields
      const dbData = {
        Id: parseInt(id)
      };

      if (activityData.type !== undefined) dbData.type_c = activityData.type;
      if (activityData.contactId !== undefined) dbData.contact_id_c = parseInt(activityData.contactId);
      if (activityData.dealId !== undefined && activityData.dealId !== '') {
        dbData.deal_id_c = parseInt(activityData.dealId);
      }
      if (activityData.subject !== undefined) dbData.subject_c = activityData.subject;
      if (activityData.description !== undefined) dbData.description_c = activityData.description;
      if (activityData.timestamp !== undefined) dbData.timestamp_c = activityData.timestamp;
      if (activityData.createdBy !== undefined) dbData.created_by_c = activityData.createdBy;

      const response = await apperClient.updateRecord('activity_c', {
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
          const activity = result.data;
          return {
            Id: activity.Id,
            type: activity.type_c,
            contactId: activity.contact_id_c?.Id || activity.contact_id_c,
            dealId: activity.deal_id_c?.Id || activity.deal_id_c,
            subject: activity.subject_c || activity.Name,
            description: activity.description_c,
            timestamp: activity.timestamp_c,
            createdBy: activity.created_by_c || "Sales Team"
          };
        } else {
          throw new Error(result.message || 'Failed to update activity');
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('activity_c', {
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
      console.error("Error deleting activity:", error);
      throw error;
    }
  }
};

export default activityService;

export default activityService;