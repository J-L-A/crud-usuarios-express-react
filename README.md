# CRUD de Usuarios (Express + React)

Proyecto completo de gestión de usuarios con arquitectura desacoplada: API REST desarrollada en **Express.js** y frontend interactivo desarrollado en **React** (Vite).

---

## 📁 Estructura del Proyecto

```text
crud-usuarios-express-react/
├── client/          # Frontend en React (Vite, CSS modular, Material UI)
└── server/          # Backend en Express.js (Node.js, MySQL2 con Pool de conexiones)
```

---

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MySQL](https://www.mysql.com/)

---

## 🗄️ 1. Configuración de la Base de Datos (MySQL)

Crear la base de datos y la tabla correspondiente:

```sql
CREATE DATABASE IF NOT EXISTS prueba_express_js;
USE prueba_express_js;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  telefono VARCHAR(8) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ 2. Ejecución del Backend (`server`)

1. Entrar a la carpeta `server`:
   ```bash
   cd server
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copiar `.env.example` a `.env` y ajustar credenciales:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=prueba_express_js
   ```
4. Iniciar el servidor:
   ```bash
   node index.js
   ```
   El servidor correrá en `http://localhost:3000`.

---

## 💻 3. Ejecución del Frontend (`client`)

1. En una nueva terminal, entrar a la carpeta `client`:
   ```bash
   cd client
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: `http://localhost:5173`

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción | Códigos HTTP |
| :---: | :--- | :--- | :---: |
| `GET` | `/usuarios` | Obtener todos los usuarios | `200`, `500` |
| `GET` | `/usuarios/buscar/:termino` | Buscar usuarios por nombre, apellido o correo | `200`, `400`, `404`, `500` |
| `GET` | `/usuarios/:id` | Obtener usuario por ID | `200`, `400`, `404`, `500` |
| `POST` | `/usuarios` | Registrar un nuevo usuario | `201`, `400`, `500` |
| `PUT` | `/usuarios/:id` | Modificar un usuario existente | `200`, `400`, `404`, `500` |
| `DELETE` | `/usuarios/:id` | Eliminar un usuario por ID | `200`, `400`, `404`, `500` |

---

## 🛡️ Validaciones Implementadas

- **Doble capa de validación (Cliente y Servidor):**
  - Campos obligatorios sin espacios vacíos (`trim()`).
  - `nombre` y `apellido`: entre 2 y 50 caracteres.
  - `telefono`: exactamente 8 dígitos numéricos.
  - `correo`: formato válido de correo electrónico (máx. 100 caracteres).
  - `id`: entero positivo válido.
- **Confirmación antes de eliminar:** Diálogo de advertencia antes de ejecutar el borrado.
- **Respuestas visuales:** Mensajes y alertas de éxito o error en la interfaz.
