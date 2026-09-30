import mongoose from "mongoose";
import { env } from "./env.config.js";
export const connectDB = async () => {
  try { await mongoose.connect(env.mongoUri); console.log("MongoDB conectado correctamente."); }
  catch (error) { console.error("Error al conectar con MongoDB:", error.message); process.exit(1); }
};
