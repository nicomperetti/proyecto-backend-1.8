import { z } from "zod";

const requiredText = (label) =>
  z.string({ error: `${label} debe ser un texto.` }).trim().min(1, `${label} es obligatorio.`);

export const createServiceSchema = z.object({
  name: requiredText("El nombre"),
  description: requiredText("La descripción"),
  duration: z.coerce.number({ error: "La duración debe ser numérica." }).int("La duración debe ser un número entero.").nonnegative("La duración no puede ser negativa."),
  price: z.coerce.number({ error: "El precio debe ser numérico." }).nonnegative("El precio no puede ser negativo."),
  category: requiredText("La categoría"),
  available: z.boolean({ error: "La disponibilidad debe ser booleana." })
}).strict();

export const updateServiceSchema = createServiceSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Debe enviar al menos un campo para actualizar el servicio." }
);

export const servicesQuerySchema = z.object({
  category: z.string().trim().min(1, "La categoría no puede estar vacía.").optional(),
  available: z.enum(["true", "false"], { error: "available debe ser true o false." }).transform((value) => value === "true").optional(),
  page: z.coerce.number({ error: "page debe ser numérico." }).int("page debe ser un entero.").min(1, "page debe ser mayor o igual a 1.").default(1),
  limit: z.coerce.number({ error: "limit debe ser numérico." }).int("limit debe ser un entero.").min(1, "limit debe ser mayor o igual a 1.").max(100, "limit no puede superar 100.").default(10),
  sortBy: z.enum(["name", "description", "duration", "price", "category", "available", "createdAt"], { error: "sortBy no es un campo válido." }).default("name"),
  order: z.enum(["asc", "desc"], { error: "order debe ser asc o desc." }).default("asc")
}).strict();
