import activitiesData from '@/services/mockData/activities.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(250);
    return [...this.activities];
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    return { ...activity };
  }

  async create(activityData) {
    await delay(350);
    const newActivity = {
      ...activityData,
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      date: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await delay(300);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id)
    };
    
    return { ...this.activities[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    const deletedActivity = this.activities.splice(index, 1)[0];
    return { ...deletedActivity };
  }

  async getByContact(contactId) {
    await delay(200);
    return this.activities.filter(a => a.contactId === parseInt(contactId));
  }

  async getByDeal(dealId) {
    await delay(200);
    return this.activities.filter(a => a.dealId === parseInt(dealId));
  }

  async getByType(type) {
    await delay(200);
    return this.activities.filter(a => a.type === type);
  }

  async getRecent(limit = 10) {
    await delay(200);
    return this.activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
}

export const activityService = new ActivityService();