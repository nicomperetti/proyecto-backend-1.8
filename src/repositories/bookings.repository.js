import BookingsDAO from "../dao/bookings.dao.js";

class BookingsRepository {
  getAll() { return BookingsDAO.getAll(); }
  create(data) { return BookingsDAO.create(data); }
  getById(id) { return BookingsDAO.getById(id); }
  getByIdRaw(id) { return BookingsDAO.getByIdRaw(id); }
  update(id, data) { return BookingsDAO.update(id, data); }
}

export default BookingsRepository;
