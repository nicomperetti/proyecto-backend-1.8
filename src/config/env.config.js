import dotenv from "dotenv";
dotenv.config();
for (const variable of ["PORT", "NODE_ENV", "MONGO_URI"]) {
  if (!process.env[variable]) throw new Error(`Error de configuración: la variable de entorno ${variable} es obligatoria.`);
}
const port = Number(process.env.PORT);
if (Number.isNaN(port)) throw new Error("Error de configuración: PORT debe ser un número.");
export const env = { port, nodeEnv: process.env.NODE_ENV, mongoUri: process.env.MONGO_URI };
