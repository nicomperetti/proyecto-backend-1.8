import Booking from "../models/booking.model.js";

const servicePopulate = {
  path: "services.service",
  select: "name description duration price category available"
};

class BookingsDAO {
  getAll() {
    return Booking.find().populate(servicePopulate).lean();
  }

  create(data) {
    return Booking.create(data).then((doc) => doc.toObject());
  }

  // Consulta pública: devuelve la reserva con los servicios completos.
  getById(id) {
    return Booking.findById(id).populate(servicePopulate).lean();
  }

  // Consulta interna para reglas de negocio que necesitan las referencias ObjectId.
  getByIdRaw(id) {
    return Booking.findById(id).lean();
  }

  update(id, data) {
    return Booking.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate(servicePopulate)
      .lean();
  }
}

export default new BookingsDAO();
