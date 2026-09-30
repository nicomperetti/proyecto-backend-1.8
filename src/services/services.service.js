import mongoose from "mongoose";
import ServicesRepository from "../repositories/services.repository.js";

class ServicesService {
  constructor() {
    this.repository = new ServicesRepository();
  }

  getServices(filters = {}) {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.available !== undefined) query.available = filters.available;

    return this.repository.getAll({
      filters: query,
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      order: filters.order
    });
  }

  getServiceById(id) {
    return mongoose.isValidObjectId(id) ? this.repository.getById(id) : null;
  }

  createService(data) {
    return this.repository.create(data);
  }

  async updateService(id, data) {
    if (!mongoose.isValidObjectId(id)) return null;
    const current = await this.repository.getById(id);
    if (!current) return null;
    return this.repository.update(id, data);
  }

  deleteService(id) {
    return mongoose.isValidObjectId(id) ? this.repository.delete(id) : null;
  }
}

export default ServicesService;
