const socket = io();

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const serviceCard = (service) => `
  <article class="card" data-service-id="${escapeHtml(service._id)}">
    <div class="card-top">
      <h3>${escapeHtml(service.name)}</h3>
      ${service.available
        ? '<span class="badge available">Disponible</span>'
        : '<span class="badge unavailable">No disponible</span>'}
    </div>
    <p>${escapeHtml(service.description)}</p>
    <dl>
      <div><dt>Duración</dt><dd>${escapeHtml(service.duration)} min</dd></div>
      <div><dt>Precio</dt><dd>$${escapeHtml(service.price)}</dd></div>
      <div><dt>Categoría</dt><dd>${escapeHtml(service.category)}</dd></div>
    </dl>
  </article>`;

socket.on("services:updated", (payload) => {
  const list = document.getElementById("services-list");
  const message = document.getElementById("realtime-message");
  if (!list || !payload?.service) return;

  const id = String(payload.service._id);
  const current = list.querySelector(`[data-service-id="${CSS.escape(id)}"]`);

  if (payload.action === "eliminar servicio") {
    current?.remove();
  } else if (current) {
    current.outerHTML = serviceCard(payload.service);
  } else {
    list.insertAdjacentHTML("afterbegin", serviceCard(payload.service));
  }

  if (message) message.textContent = `Actualización en tiempo real: ${payload.action}.`;
});

socket.on("bookings:updated", (payload) => {
  const message = document.getElementById("realtime-message");
  if (message) message.textContent = `Actualización en tiempo real: ${payload?.action ?? "reserva modificada"}.`;
});

socket.emit("client:ping");
socket.on("server:pong", () => {
  const status = document.getElementById("live-status");
  if (status) status.textContent = "Tiempo real activo";
});
