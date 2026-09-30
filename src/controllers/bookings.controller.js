import BookingsService from "../services/bookings.service.js";
import ServicesService from "../services/services.service.js";

const bookingService = new BookingsService();
const serviceService = new ServicesService();

export const createBooking = async (req, res) => {
  try {
    const result = await bookingService.createBooking(req.validated.body);
    req.app.get("io")?.emit("bookings:updated", { action: "crear reserva", booking: result });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const result = await bookingService.getBookingById(req.params.bid);
    if (!result) return res.status(404).json({ error: "Reserva no encontrada." });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addServiceToBooking = async (req, res) => {
  try {
    const selectedService = await serviceService.getServiceById(req.validated.params.sid);
    if (!selectedService) return res.status(404).json({ error: "Servicio no encontrado." });

    const result = await bookingService.addServiceToBooking(req.validated.params.bid, req.validated.params.sid);
    if (result.error === "invalid_id") return res.status(400).json({ error: "ID inválido." });
    if (result.error === "booking_not_found") return res.status(404).json({ error: "Reserva no encontrada." });

    req.app.get("io")?.emit("bookings:updated", { action: "agregar servicio a reserva", booking: result.booking });
    res.status(200).json(result.booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
