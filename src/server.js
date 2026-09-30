import http from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { env } from "./config/env.config.js";
import { connectDB } from "./config/database.js";

await connectDB();

const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.set("io", io);

io.on("connection", socket => {
  console.log(`Cliente Socket.io conectado: ${socket.id}`);
  socket.on("client:ping", () => socket.emit("server:pong", { ok: true }));
  socket.on("disconnect", () => console.log(`Cliente Socket.io desconectado: ${socket.id}`));
});

httpServer.listen(env.port, () => {
  console.log(`Servidor iniciado en http://localhost:${env.port}`);
  console.log(`Vistas disponibles en http://localhost:${env.port}/views/services`);
});
