import { z } from "zod";

const requiredText = (label) =>
  z.string({ error: `${label} debe ser un texto.` }).trim().min(1, `${label} es obligatorio.`);

export const createBookingSchema = z.object({
  clientName: requiredText("El nombre del cliente"),
  clientEmail: z.string({ error: "El email del cliente debe ser un texto." }).trim().email("El email del cliente no es válido."),
  date: requiredText("La fecha"),
  time: requiredText("La hora"),
  status: requiredText("El estado")
}).strict();

export const addServiceToBookingSchema = z.object({
  bid: z.string().regex(/^[a-fA-F0-9]{24}$/, "El ID de la reserva no es válido."),
  sid: z.string().regex(/^[a-fA-F0-9]{24}$/, "El ID del servicio no es válido.")
}).strict();
