// UsuariosService.js contiene funciones para interactuar con la API de usuarios, 
// funciones CRUD (Crear, Leer, Actualizar, Eliminar) y búsqueda de usuarios.

const API_URL = "http://localhost:3000/usuarios";

// Obtener todos o buscar por término
export async function ObtenerUsuarios(termino = "") {
  let url = API_URL;
  if (termino && termino.trim()) {
    url = `${API_URL}/buscar/${encodeURIComponent(termino.trim())}`;
  }

  const respuesta = await fetch(url);
  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.mensaje || "Error al obtener usuarios");
  }

  return data;
}

// Registrar usuario (POST)
export async function RegistrarUsuario(datosUsuario) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosUsuario)
  });

  const data = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(data.mensaje || "Error al registrar usuario");
  }
  return data;
}

// Modificar usuario (PUT)
export async function modificarUsuario(id, datosUsuario) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosUsuario)
  });

  const data = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(data.mensaje || "Error al actualizar usuario");
  }
  return data;
}

// Eliminar usuario (DELETE)
export async function eliminarUsuario(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  const data = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(data.mensaje || "Error al eliminar usuario");
  }
  return data;
}