import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const activityService = {
  getAll: async () => {
    await delay();
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  getById: async (id) => {
    await delay();
    const activity = activities.find(a => a.Id === parseInt(id));
    return activity ? { ...activity } : null;
  },

  getByContactId: async (contactId) => {
    await delay();
    return activities
      .filter(a => a.contactId === parseInt(contactId))
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  getByDealId: async (dealId) => {
    await delay();
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  create: async (activityData) => {
    await delay();
    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0;
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString(),
      createdBy: "Sales Team"
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  update: async (id, activityData) => {
    await delay();
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      activities[index] = {
        ...activities[index],
        ...activityData
      };
      return { ...activities[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      activities.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default activityService;