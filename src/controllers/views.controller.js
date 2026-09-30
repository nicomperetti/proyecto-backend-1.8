import ServicesService from "../services/services.service.js";
import BookingsService from "../services/bookings.service.js";

const servicesService = new ServicesService();
const bookingsService = new BookingsService();

export const renderServices = async (req, res) => {
  try {
    const result = await servicesService.getServices({
      page: 1,
      limit: 100,
      sortBy: "name",
      order: "asc"
    });
    res.render("services", { title: "Servicios", services: result.items });
  } catch (error) {
    res.status(500).render("services", { title: "Servicios", services: [], error: error.message });
  }
};

export const renderAvailability = async (req, res) => {
  try {
    const [serviceResult, bookings] = await Promise.all([
      servicesService.getServices({ page: 1, limit: 100, sortBy: "name", order: "asc" }),
      bookingsService.getBookings()
    ]);
    res.render("availability", { title: "Disponibilidad y reservas", services: serviceResult.items, bookings });
  } catch (error) {
    res.status(500).render("availability", { title: "Disponibilidad y reservas", services: [], bookings: [], error: error.message });
  }
};
