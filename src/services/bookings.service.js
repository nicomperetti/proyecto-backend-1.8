import mongoose from "mongoose";
import BookingsRepository from "../repositories/bookings.repository.js";

class BookingsService {
  constructor() {
    this.repository = new BookingsRepository();
  }

  getBookings() {
    return this.repository.getAll();
  }

  createBooking(data) {
    return this.repository.create({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      time: data.time,
      status: data.status,
      services: []
    });
  }

  getBookingById(id) {
    return mongoose.isValidObjectId(id) ? this.repository.getById(id) : null;
  }

  async addServiceToBooking(bookingId, serviceId) {
    if (!mongoose.isValidObjectId(bookingId) || !mongoose.isValidObjectId(serviceId)) {
      return { error: "invalid_id" };
    }

    // Se utiliza la reserva sin populate para poder trabajar directamente con ObjectId.
    const booking = await this.repository.getByIdRaw(bookingId);
    if (!booking) return { error: "booking_not_found" };

    const existing = booking.services.find(
      (item) => item.service.toString() === serviceId.toString()
    );

    if (existing) existing.quantity += 1;
    else booking.services.push({ service: serviceId, quantity: 1 });

    return {
      booking: await this.repository.update(bookingId, { services: booking.services })
    };
  }
}

export default BookingsService;
