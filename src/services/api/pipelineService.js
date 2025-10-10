const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const pipelineService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('pipeline_stage_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "color_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI field names for backward compatibility
      return response.data.map(stage => ({
        Id: stage.Id,
        name: stage.name_c || stage.Name,
        order: stage.order_c || 0,
        color: stage.color_c
      }));
    } catch (error) {
      console.error("Error fetching pipeline stages:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('pipeline_stage_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "color_c"}}
        ]
      });

      if (!response.data) {
        return null;
      }

      // Map database fields to UI field names
      const stage = response.data;
      return {
        Id: stage.Id,
        name: stage.name_c || stage.Name,
        order: stage.order_c || 0,
        color: stage.color_c
      };
    } catch (error) {
      console.error("Error fetching pipeline stage:", error);
      return null;
    }
  }
};

export default pipelineService;

export default pipelineService;