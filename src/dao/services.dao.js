import Service from "../models/service.model.js";

class ServicesDAO {
  async getAll({ filters = {}, page = 1, limit = 10, sortBy = "name", order = "asc" } = {}) {
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === "desc" ? -1 : 1 };

    const [items, total] = await Promise.all([
      Service.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      Service.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages
      }
    };
  }

  getById(id) {
    return Service.findById(id).lean();
  }

  async create(data) {
    const doc = await Service.create(data);
    return doc.toObject();
  }

  update(id, data) {
    return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  delete(id) {
    return Service.findByIdAndDelete(id).lean();
  }
}

export default ServicesDAO;
