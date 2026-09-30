import ServicesService from "../services/services.service.js";

const service = new ServicesService();

export const getServices = async (req, res) => {
  try {
    const result = await service.getServices(req.validated.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const result = await service.getServiceById(req.params.sid);
    if (!result) return res.status(404).json({ error: "Servicio no encontrado." });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const result = await service.createService(req.validated.body);
    req.app.get("io")?.emit("services:updated", { action: "crear servicio", service: result });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const result = await service.updateService(req.params.sid, req.validated.body);
    if (!result) return res.status(404).json({ error: "Servicio no encontrado." });
    req.app.get("io")?.emit("services:updated", { action: "actualizar servicio", service: result });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const result = await service.deleteService(req.params.sid);
    if (!result) return res.status(404).json({ error: "Servicio no encontrado." });
    req.app.get("io")?.emit("services:updated", { action: "eliminar servicio", service: result });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
