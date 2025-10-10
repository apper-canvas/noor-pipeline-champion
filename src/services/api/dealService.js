import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const dealService = {
  getAll: async () => {
    await delay();
    return [...deals];
  },

  getById: async (id) => {
    await delay();
    const deal = deals.find(d => d.Id === parseInt(id));
    return deal ? { ...deal } : null;
  },

  getByContactId: async (contactId) => {
    await delay();
    return deals.filter(d => d.contactId === parseInt(contactId)).map(d => ({ ...d }));
  },

  create: async (dealData) => {
    await delay();
    const maxId = deals.length > 0 ? Math.max(...deals.map(d => d.Id)) : 0;
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  update: async (id, dealData) => {
    await delay();
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      deals[index] = {
        ...deals[index],
        ...dealData,
        updatedAt: new Date().toISOString()
      };
      
      if ((dealData.stage === "Closed Won" || dealData.stage === "Closed Lost") && !deals[index].closedAt) {
        deals[index].closedAt = new Date().toISOString();
      }
      
      return { ...deals[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      deals.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default dealService;