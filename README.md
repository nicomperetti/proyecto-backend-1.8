# Sistema Backend de Turnos y Reservas — Consultas avanzadas, Zod, Populate, Handlebars y Socket.io

API REST de turnos y reservas con MongoDB + Mongoose, arquitectura en capas, consultas avanzadas, validación previa con Zod, relaciones mediante `ObjectId` + `populate`, vistas server-side con Handlebars y comunicación en tiempo real con Socket.io.

## Arquitectura

El flujo se mantiene:

`routes → middlewares/validación → controllers → services → repositories → DAO → models`

Las validaciones están separadas en `src/schemas/` y se ejecutan mediante el middleware `validate.middleware.js`, antes de que los datos lleguen a controllers, services o MongoDB.

Los controllers no contienen reglas de negocio ni acceden directamente a MongoDB.

## Consultas avanzadas de servicios

`GET /api/services` acepta:

- `category`: filtra por categoría.
- `available`: `true` o `false`.
- `page`: página actual, comienza en 1.
- `limit`: cantidad de resultados por página, máximo 100.
- `sortBy`: `name`, `description`, `duration`, `price`, `category`, `available` o `createdAt`.
- `order`: `asc` o `desc`.

Ejemplos:

```text
GET /api/services?category=estetica&available=true
GET /api/services?page=2&limit=5
GET /api/services?sortBy=price&order=desc
GET /api/services?category=salud&page=1&limit=10&sortBy=duration&order=asc
```

La respuesta tiene esta forma:

```json
{
  "items": [],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}
```

## Validación con Zod

Se validan los datos antes de llegar a MongoDB:

- `POST /api/services`: nombre, descripción, duración, precio, categoría y disponibilidad.
- `PUT /api/services/:sid`: al menos un campo válido del servicio.
- `POST /api/bookings`: cliente, email, fecha, hora y estado.
- `POST /api/bookings/:bid/services/:sid`: IDs de reserva y servicio.
- `GET /api/services`: filtros, paginación y ordenamiento.

Los datos inválidos devuelven `400` con `error` y un `message` explicativo.

## Relaciones y populate

Una reserva no guarda objetos completos de servicios. Guarda referencias:

```json
{
  "services": [
    {
      "service": "ObjectId",
      "quantity": 1
    }
  ]
}
```

Al consultar:

```text
GET /api/bookings/:bid
```

el DAO utiliza `populate("services.service")` para devolver la información completa del servicio asociado junto con los datos de la reserva.

El `populate` se utiliza únicamente al consultar. Para agregar servicios a una reserva, la capa de negocio trabaja con las referencias `ObjectId`, incrementando `quantity` cuando el mismo servicio ya existe.

## API REST

### Servicios

- `GET /api/services`
- `GET /api/services/:sid`
- `POST /api/services`
- `PUT /api/services/:sid`
- `DELETE /api/services/:sid`

### Reservas

- `POST /api/bookings`
- `GET /api/bookings/:bid`
- `POST /api/bookings/:bid/services/:sid`

## Handlebars

- `GET /views/services`: servicios reales de MongoDB.
- `GET /views/availability`: disponibilidad y reservas reales.

Las vistas reutilizan las mismas capas de servicios, repositories y DAO de la API.

## Socket.io

Socket.io se ejecuta sobre el servidor HTTP de Express.

Acciones reales que emiten eventos:

- Crear, actualizar o eliminar un servicio → `services:updated`.
- Crear una reserva o agregar un servicio a una reserva → `bookings:updated`.

`public/js/socket.js` escucha estos eventos y actualiza la vista sin recargar manualmente.

## Estructura

```text
src/
├── config/
├── controllers/
│   ├── services.controller.js
│   ├── bookings.controller.js
│   └── views.controller.js
├── dao/
├── middlewares/
│   └── validate.middleware.js
├── models/
├── repositories/
├── routes/
├── schemas/
│   ├── services.schema.js
│   └── bookings.schema.js
├── services/
├── views/
│   ├── layouts/main.handlebars
│   ├── services.handlebars
│   └── availability.handlebars
├── public/
│   ├── css/styles.css
│   └── js/socket.js
├── app.js
└── server.js
```

## Instalación

```bash
npm install
```

Crear `.env` a partir de `.env.example`:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=TU_URI_DE_MONGODB_ATLAS
```

No subir `.env`, `node_modules` ni credenciales reales.

## Ejecución

```bash
npm run dev
```

Abrir:

- `http://localhost:8080/`
- `http://localhost:8080/views/services`
- `http://localhost:8080/views/availability`

Para comprobar Socket.io, abrir `/views/services` en dos pestañas y crear, modificar o eliminar un servicio mediante la API REST. La otra pestaña recibe el evento y actualiza la información sin recarga.
