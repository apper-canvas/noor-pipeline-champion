import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const contactService = {
  getAll: async () => {
    await delay();
    return [...contacts];
  },

  getById: async (id) => {
    await delay();
    const contact = contacts.find(c => c.Id === parseInt(id));
    return contact ? { ...contact } : null;
  },

  create: async (contactData) => {
    await delay();
    const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.Id)) : 0;
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  update: async (id, contactData) => {
    await delay();
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...contactData,
        updatedAt: new Date().toISOString()
      };
      return { ...contacts[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      contacts.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default contactService;