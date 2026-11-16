import express from 'express';
import pool from './db.js';
import cors from 'cors';

//Códigos de estado HTTP:
// 200 OK: La solicitud se ha procesado correctamente.
// 201 Created: La solicitud se ha procesado correctamente y se ha creado un nuevo recurso.
// 400 Bad Request: La solicitud no es válida o está mal formada.
// 404 Not Found: El recurso solicitado no se encontró en el servidor.
// 500 Internal Server Error: Error interno del servidor al procesar la solicitud.

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

// ==========================================
// Funciones Auxiliares de Validación
// ==========================================

// Valida que el ID sea un entero positivo mayor a 0
function esIdValido(id) {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
}

// Valida campos obligatorios, espacios en blanco, tipo y longitudes
function validarDatosUsuario({ nombre, apellido, telefono, correo }) {
    // 1. Comprobar que no vengan vacíos ni con solo espacios en blanco (trim)
    if (!nombre || !nombre.trim() ||
        !apellido || !apellido.trim() ||
        !telefono || !telefono.trim() ||
        !correo || !correo.trim()) {
        return "Todos los campos (nombre, apellido, teléfono, correo) son obligatorios y no pueden contener solo espacios.";
    }

    const n = nombre.trim();
    const a = apellido.trim();
    const t = telefono.trim();
    const c = correo.trim();

    // 2. Validar longitud de nombre y apellido (2 a 50 caracteres)
    if (n.length < 2 || n.length > 50) {
        return "El nombre debe tener entre 2 y 50 caracteres.";
    }
    if (a.length < 2 || a.length > 50) {
        return "El apellido debe tener entre 2 y 50 caracteres.";
    }

    // 3. Validar teléfono: exactamente 8 dígitos numéricos
    const regexTelefono = /^\d{8}$/;
    if (!regexTelefono.test(t)) {
        return "El teléfono debe contener exactamente 8 dígitos numéricos.";
    }

    // 4. Validar correo: formato válido y máximo 100 caracteres
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(c) || c.length > 100) {
        return "El correo debe tener un formato válido (ej. usuario@correo.com) y máximo 100 caracteres.";
    }

    return null; // Datos válidos
}

// ==========================================
// Rutas (Endpoints)
// ==========================================

app.get('/', (req, res) => {
    res.json({
        mensaje: "Bienvenidos a mi app"
    });
});

// 1. [200 OK] Consultar todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const [usuarios] = await pool.query("SELECT * FROM usuarios ORDER BY id DESC");
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error en GET /usuarios:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al obtener usuarios" });
    }
});

// 2. [200 OK | 400 Bad Request | 404 Not Found] Buscar usuarios por término
// NOTA IMPORTANTE: Esta ruta DEBE ir antes de /usuarios/:id para evitar colisión de rutas
app.get('/usuarios/buscar/:termino', async (req, res) => {
    try {
        const termino = req.params.termino ? req.params.termino.trim() : "";

        // Validación de búsqueda vacía o inválida (400 Bad Request)
        if (!termino) {
            return res.status(400).json({ mensaje: "Debe ingresar un término de búsqueda válido." });
        }

        const [resultados] = await pool.query(
            "SELECT * FROM usuarios WHERE nombre LIKE ? OR apellido LIKE ? OR correo LIKE ?",
            [`%${termino}%`, `%${termino}%`, `%${termino}%`]
        );

        // Si no arrojó resultados (404 Not Found)
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron usuarios con ese criterio." });
        }

        // Si encontró resultados (200 OK)
        return res.status(200).json(resultados);
    } catch (error) {
        console.error("Error en búsqueda:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// 3. [200 OK | 400 Bad Request | 404 Not Found] Consultar usuario por ID
app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!esIdValido(id)) {
            return res.status(400).json({ mensaje: "El ID proporcionado no es válido. Debe ser un entero positivo." });
        }

        const [resultado] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [Number(id)]);

        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        return res.status(200).json(resultado[0]);
    } catch (error) {
        console.error("Error en GET /usuarios/:id:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al consultar usuario" });
    }
});

// 4. [201 Created | 400 Bad Request] Registrar usuario
app.post('/usuarios', async (req, res) => {
    try {
        // Validar campos en el servidor
        const errorValidacion = validarDatosUsuario(req.body);
        if (errorValidacion) {
            return res.status(400).json({ mensaje: errorValidacion });
        }

        const { nombre, apellido, telefono, correo } = req.body;

        const [resultado] = await pool.query(
            "INSERT INTO usuarios (nombre, apellido, telefono, correo) VALUES (?, ?, ?, ?)",
            [nombre.trim(), apellido.trim(), telefono.trim(), correo.trim()]
        );

        return res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: resultado.insertId,
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                correo: correo.trim()
            }
        });
    } catch (error) {
        console.error("Error en POST /usuarios:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al registrar el usuario" });
    }
});

// 5. [200 OK | 400 Bad Request | 404 Not Found] Modificar usuario
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        if (!esIdValido(id)) {
            return res.status(400).json({ mensaje: "El ID proporcionado no es válido. Debe ser un entero positivo." });
        }

        // Validar cuerpo
        const errorValidacion = validarDatosUsuario(req.body);
        if (errorValidacion) {
            return res.status(400).json({ mensaje: errorValidacion });
        }

        const { nombre, apellido, telefono, correo } = req.body;

        const [resultado] = await pool.query(
            "UPDATE usuarios SET nombre=?, apellido=?, telefono=?, correo=? WHERE id=?",
            [nombre.trim(), apellido.trim(), telefono.trim(), correo.trim(), Number(id)]
        );

        // Si no afectó filas, el usuario no existe en la base de datos
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "El usuario que intenta modificar no existe." });
        }

        return res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            usuario: {
                id: Number(id),
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                correo: correo.trim()
            }
        });
    } catch (error) {
        console.error("Error en PUT /usuarios/:id:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al actualizar el usuario" });
    }
});

// 6. [200 OK | 400 Bad Request | 404 Not Found] Eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        if (!esIdValido(id)) {
            return res.status(400).json({ mensaje: "El ID proporcionado no es válido. Debe ser un entero positivo." });
        }

        const [resultado] = await pool.query("DELETE FROM usuarios WHERE id=?", [Number(id)]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "El usuario que intenta eliminar no existe." });
        }

        return res.status(200).json({
            mensaje: "Usuario eliminado correctamente",
            id: Number(id)
        });
    } catch (error) {
        console.error("Error en DELETE /usuarios/:id:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al eliminar el usuario" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
