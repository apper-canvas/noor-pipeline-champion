const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const contactService = {
  getAll: async () => {
    try {
const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI field names for backward compatibility
return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.name_c || contact.Name,
        email: contact.email_c,
        phone: contact.phone_c,
        company: contact.company_c,
        title: contact.title_c,
        notes: contact.notes_c,
        gender: contact.gender_c,
        dateOfBirth: contact.date_of_birth_c,
        createdAt: contact.created_at_c,
        updatedAt: contact.updated_at_c
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      });

      if (!response.data) {
        return null;
      }

      // Map database fields to UI field names
const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.name_c || contact.Name,
        email: contact.email_c,
        phone: contact.phone_c,
        company: contact.company_c,
        title: contact.title_c,
        notes: contact.notes_c,
        gender: contact.gender_c,
        dateOfBirth: contact.date_of_birth_c,
        createdAt: contact.created_at_c,
        updatedAt: contact.updated_at_c
      };
    } catch (error) {
      console.error("Error fetching contact:", error);
      return null;
    }
  },

  create: async (contactData) => {
    try {
// Map UI field names to database field names, only include Updateable fields
      const dbData = {
        name_c: contactData.name,
        email_c: contactData.email,
        phone_c: contactData.phone,
        company_c: contactData.company,
        title_c: contactData.title,
        notes_c: contactData.notes,
        gender_c: contactData.gender,
        date_of_birth_c: contactData.dateOfBirth,
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      };

      // Remove undefined/null values
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === undefined || dbData[key] === null || dbData[key] === '') {
          delete dbData[key];
        }
      });

      const response = await apperClient.createRecord('contact_c', {
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
const contact = result.data;
          return {
            Id: contact.Id,
            name: contact.name_c || contact.Name,
            email: contact.email_c,
            phone: contact.phone_c,
            company: contact.company_c,
            title: contact.title_c,
            notes: contact.notes_c,
            gender: contact.gender_c,
            dateOfBirth: contact.date_of_birth_c,
            createdAt: contact.created_at_c,
            updatedAt: contact.updated_at_c
          };
        } else {
          throw new Error(result.message || 'Failed to create contact');
        }
      }

      throw new Error('No results returned');
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  update: async (id, contactData) => {
    try {
// Map UI field names to database field names, only include Updateable fields
      const dbData = {
        Id: parseInt(id)
      };

      if (contactData.name !== undefined) dbData.name_c = contactData.name;
      if (contactData.email !== undefined) dbData.email_c = contactData.email;
      if (contactData.phone !== undefined) dbData.phone_c = contactData.phone;
      if (contactData.company !== undefined) dbData.company_c = contactData.company;
      if (contactData.title !== undefined) dbData.title_c = contactData.title;
      if (contactData.notes !== undefined) dbData.notes_c = contactData.notes;
      if (contactData.gender !== undefined) dbData.gender_c = contactData.gender;
      if (contactData.dateOfBirth !== undefined) dbData.date_of_birth_c = contactData.dateOfBirth;
      
      dbData.updated_at_c = new Date().toISOString();

      const response = await apperClient.updateRecord('contact_c', {
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
          const contact = result.data;
          return {
            Id: contact.Id,
            name: contact.name_c || contact.Name,
            email: contact.email_c,
            phone: contact.phone_c,
            company: contact.company_c,
            title: contact.title_c,
            notes: contact.notes_c,
            gender: contact.gender_c,
            dateOfBirth: contact.date_of_birth_c,
            createdAt: contact.created_at_c,
            updatedAt: contact.updated_at_c
          };
        } else {
          throw new Error(result.message || 'Failed to update contact');
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('contact_c', {
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
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
};

export default contactService;