import companiesData from '@/services/mockData/companies.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CompanyService {
  constructor() {
    this.companies = [...companiesData];
  }

  async getAll() {
    await delay(300);
    return [...this.companies];
  }

  async getById(id) {
    await delay(200);
    const company = this.companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error(`Company with ID ${id} not found`);
    }
    return { ...company };
  }

  async create(companyData) {
    await delay(400);
    const newCompany = {
      ...companyData,
      Id: Math.max(...this.companies.map(c => c.Id)) + 1
    };
    this.companies.push(newCompany);
    return { ...newCompany };
  }

  async update(id, companyData) {
    await delay(350);
    const index = this.companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Company with ID ${id} not found`);
    }
    
    this.companies[index] = {
      ...this.companies[index],
      ...companyData,
      Id: parseInt(id)
    };
    
    return { ...this.companies[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Company with ID ${id} not found`);
    }
    
    const deletedCompany = this.companies.splice(index, 1)[0];
    return { ...deletedCompany };
  }

  async getByIndustry(industry) {
    await delay(200);
    return this.companies.filter(c => c.industry === industry);
  }

  async getBySize(size) {
    await delay(200);
    return this.companies.filter(c => c.size === size);
  }

  async search(query) {
    await delay(250);
    const lowercaseQuery = query.toLowerCase();
    return this.companies.filter(company => 
      company.name.toLowerCase().includes(lowercaseQuery) ||
      company.industry.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const companyService = new CompanyService();