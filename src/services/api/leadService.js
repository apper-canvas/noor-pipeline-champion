const leadService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 },
      };

      const response = await apperClient.fetchRecords("lead_c", params);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch leads");
      }

      if (!response?.data || response.data.length === 0) {
        return [];
      }

      return response.data.map((lead) => ({
        Id: lead.Id,
        name: lead.name_c || "",
        email: lead.email_c || "",
        phone: lead.phone_c || "",
        company: lead.company_c || "",
        title: lead.title_c || "",
        notes: lead.notes_c || "",
        status: lead.status_c || "New",
        createdAt: lead.CreatedOn,
        modifiedAt: lead.ModifiedOn,
      }));
    } catch (error) {
      console.error("Error fetching leads:", error?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
        ],
      };

      const response = await apperClient.getRecordById("lead_c", id, params);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch lead");
      }

      if (!response?.data) {
        return null;
      }

      const lead = response.data;
      return {
        Id: lead.Id,
        name: lead.name_c || "",
        email: lead.email_c || "",
        phone: lead.phone_c || "",
        company: lead.company_c || "",
        title: lead.title_c || "",
        notes: lead.notes_c || "",
        status: lead.status_c || "New",
        createdAt: lead.CreatedOn,
        modifiedAt: lead.ModifiedOn,
      };
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(leadData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = {
        records: [
          {
            name_c: leadData.name,
            email_c: leadData.email,
            phone_c: leadData.phone || "",
            company_c: leadData.company || "",
            title_c: leadData.title || "",
            notes_c: leadData.notes || "",
            status_c: leadData.status || "New",
          },
        ],
      };

      const response = await apperClient.createRecord("lead_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to create lead");
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create lead:`, failed);
          const errorMessage = failed[0].message || "Failed to create lead";
          throw new Error(errorMessage);
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating lead:", error?.message || error);
      throw error;
    }
  },

  async update(id, leadData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = {
        records: [
          {
            Id: id,
            name_c: leadData.name,
            email_c: leadData.email,
            phone_c: leadData.phone || "",
            company_c: leadData.company || "",
            title_c: leadData.title || "",
            notes_c: leadData.notes || "",
            status_c: leadData.status || "New",
          },
        ],
      };

      const response = await apperClient.updateRecord("lead_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to update lead");
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update lead:`, failed);
          const errorMessage = failed[0].message || "Failed to update lead";
          throw new Error(errorMessage);
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating lead:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      });

      const params = {
        RecordIds: [id],
      };

      const response = await apperClient.deleteRecord("lead_c", params);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete lead");
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete lead:`, failed);
          const errorMessage = failed[0].message || "Failed to delete lead";
          throw new Error(errorMessage);
        }

        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting lead:", error?.message || error);
      throw error;
    }
  },
};

export default leadService;