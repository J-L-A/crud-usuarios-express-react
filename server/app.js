const express = require('express');

const app = express();
const port = 3000;

// Arreglo de estudiantes con sus datos
const estudiantes = [
    {
        id:1,
        Nombre:"Pere Gill",
        Clase:"BDD1",
        Nota:90
    },
    {
        id:2,
        Nombre:"Elena Nito",
        Clase:"BDD2",
        Nota:95
    },
    {
        id:3,
        Nombre:"Agri Pino",
        Clase:"Seminario Software",
        Nota:71
    }
]

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.get('/', (req, res) => {
  res.json({
    "Mensaje": "Bienvenidos a mi API"
  });
});


// Endpoint para obtener todos los estudiantes
app.get('/estudiantes',(req, res)=>{
    res.json(estudiantes);
});

// Endpoint para obtener un estudiante por su ID
app.get('/estudiantes/:id', (req, res)=>{
     const id = req.params.id;

     const estudiante = estudiantes.find((alumno)=>{
        return alumno.id == id;
     });

     if(!estudiante){
        res.json({
            "Mensaje":"Alumno no encontrado"
        })
     }

     res.json(estudiante);
});

// Middleware para manejar rutas no encontradas
app.use((req, res)=>{
    res.status(404).json(
        {
            Mensaje:"Ruta no encontrada"
        }
    );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutandose en http://localhost:${port}`);
});

function validarDatosUsuario({ nombre, apellido, telefono, correo }) {
    // 1. Validar que existan y no sean solo espacios
    if (!nombre || !nombre.trim() ||
        !apellido || !apellido.trim() ||
        !telefono || !telefono.trim() ||
        !correo || !correo.trim()) {
        return "Todos los campos son obligatorios y no pueden contener solo espacios.";
    }

    const n = nombre.trim();
    const a = apellido.trim();
    const t = telefono.trim();
    const c = correo.trim();

    // 2. Longitud de nombre y apellido
    if (n.length < 2 || n.length > 50) {
        return "El nombre debe tener entre 2 y 50 caracteres.";
    }
    if (a.length < 2 || a.length > 50) {
        return "El apellido debe tener entre 2 y 50 caracteres.";
    }

    // 3. Teléfono de 8 dígitos
    const regexTelefono = /^\d{8}$/; // la expresión regular regex se utiliza para identificar un patrón específico en una cadena de texto. En este caso, la expresión /^\d{8}$/ se utiliza para validar que el número de teléfono ingresado tenga exactamente 8 dígitos numéricos.
    if (!regexTelefono.test(t)) {
        return "El teléfono debe contener exactamente 8 dígitos numéricos.";
    }

    // 4. Correo electrónico válido y longitud
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!regexCorreo.test(c) || c.length > 100) {
        return "El correo debe tener un formato válido y un máximo de 100 caracteres.";
    }

    return null; // Si devuelve null, significa que todo está perfecto
}