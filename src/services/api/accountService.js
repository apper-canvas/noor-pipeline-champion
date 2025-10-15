const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const accountService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('account_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI field names for backward compatibility
      return response.data.map(account => ({
        Id: account.Id,
        name: account.name_c || account.Name,
        email: account.email_c,
        phone: account.phone_c,
        tags: account.Tags,
        createdAt: account.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('account_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.data) {
        return null;
      }

      // Map database fields to UI field names
      const account = response.data;
      return {
        Id: account.Id,
        name: account.name_c || account.Name,
        email: account.email_c,
        phone: account.phone_c,
        tags: account.Tags,
        createdAt: account.CreatedOn
      };
    } catch (error) {
      console.error("Error fetching account:", error);
      return null;
    }
  },

  create: async (accountData) => {
    try {
      // Map UI field names to database field names, only include Updateable fields
      const dbData = {
        name_c: accountData.name,
        email_c: accountData.email,
        phone_c: accountData.phone
      };

      // Only include Tags if provided
      if (accountData.tags) {
        dbData.Tags = accountData.tags;
      }

      // Remove undefined/null/empty values
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === undefined || dbData[key] === null || dbData[key] === '') {
          delete dbData[key];
        }
      });

      const response = await apperClient.createRecord('account_c', {
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
          const account = result.data;
          return {
            Id: account.Id,
            name: account.name_c || account.Name,
            email: account.email_c,
            phone: account.phone_c,
            tags: account.Tags,
            createdAt: account.CreatedOn
          };
        } else {
          throw new Error(result.message || 'Failed to create account');
        }
      }

      throw new Error('No results returned');
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },

  update: async (id, accountData) => {
    try {
      // Map UI field names to database field names, only include Updateable fields
      const dbData = {
        Id: parseInt(id)
      };

      if (accountData.name !== undefined) dbData.name_c = accountData.name;
      if (accountData.email !== undefined) dbData.email_c = accountData.email;
      if (accountData.phone !== undefined) dbData.phone_c = accountData.phone;
      if (accountData.tags !== undefined) dbData.Tags = accountData.tags;

      const response = await apperClient.updateRecord('account_c', {
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
          const account = result.data;
          return {
            Id: account.Id,
            name: account.name_c || account.Name,
            email: account.email_c,
            phone: account.phone_c,
            tags: account.Tags,
            createdAt: account.CreatedOn
          };
        } else {
          throw new Error(result.message || 'Failed to update account');
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('account_c', {
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
      console.error("Error deleting account:", error);
      throw error;
    }
  }
};

export default accountService;