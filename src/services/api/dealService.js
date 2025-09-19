import dealsData from '@/services/mockData/deals.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await delay(350);
    return [...this.deals];
  }

  async getById(id) {
    await delay(200);
    const deal = this.deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    return { ...deal };
  }

  async create(dealData) {
    await delay(450);
    const newDeal = {
      ...dealData,
      Id: Math.max(...this.deals.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await delay(400);
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id)
    };
    
    return { ...this.deals[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    const deletedDeal = this.deals.splice(index, 1)[0];
    return { ...deletedDeal };
  }

  async getByStage(stage) {
    await delay(250);
    return this.deals.filter(d => d.stage === stage);
  }

  async getByContact(contactId) {
    await delay(200);
    return this.deals.filter(d => d.contactId === parseInt(contactId));
  }

  async updateStage(id, newStage) {
    await delay(300);
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with ID ${id} not found`);
    }
    
    this.deals[index].stage = newStage;
    return { ...this.deals[index] };
  }
}

export const dealService = new DealService();