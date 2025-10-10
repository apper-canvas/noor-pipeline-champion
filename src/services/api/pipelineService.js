import pipelineStagesData from "@/services/mockData/pipelineStages.json";

let stages = [...pipelineStagesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

const pipelineService = {
  getAll: async () => {
    await delay();
    return [...stages].sort((a, b) => a.order - b.order);
  },

  getById: async (id) => {
    await delay();
    const stage = stages.find(s => s.Id === parseInt(id));
    return stage ? { ...stage } : null;
  }
};

export default pipelineService;