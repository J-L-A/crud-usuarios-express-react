import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Spinner from '../components/Spinner';
import { ObtenerUsuarios, RegistrarUsuario, modificarUsuario, eliminarUsuario } from '../services/UsuariosService';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]); // el useState sirve para almacenar los usuarios que se obtienen del backend
  const [cargando, setCargando] = useState(false);
  const [errorServidor, setErrorServidor] = useState(null);
  const [buscar, setBuscar] = useState("");

  const estadoInicialForm = {
    nombre: "",
    apellido: "",
    telefono: "",
    correo: ""
  };
  const [formData, setFormData] = useState(estadoInicialForm);
  const [idModificando, setIdModificando] = useState(null);
  const [alerta, setAlerta] = useState({ tipo: "", texto: "" });

  const mostrarAlerta = (tipo, texto) => {
    setAlerta({ tipo, texto });
    setTimeout(() => {
      setAlerta({ tipo: "", texto: "" });
    }, 4000); // 4000 ms = 4 segundos
  };

  const cargarUsuarios = async (termino = "") => {
    try {
      setCargando(true);
      setErrorServidor(null);
      const datosJson = await ObtenerUsuarios(termino);
      setUsuarios(Array.isArray(datosJson) ? datosJson : []); // ? sirve para verificar si datosJson es un array, si no lo es, se asigna un array vacío
    } catch (err) {
      setUsuarios([]);
      mostrarAlerta("error", err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios(); // Esto se ejecuta una vez al montar el componente para cargar los usuarios iniciales
  }, []);

  const validarFormularioCliente = () => {
    const { nombre, apellido, telefono, correo } = formData;

    if (!nombre.trim() || !apellido.trim() || !telefono.trim() || !correo.trim()) {
      return "Todos los campos (nombre, apellido, teléfono, correo) son obligatorios.";
    }

    if (nombre.trim().length < 2 || nombre.trim().length > 50) {
      return "El nombre debe tener entre 2 y 50 caracteres.";
    }
    if (apellido.trim().length < 2 || apellido.trim().length > 50) {
      return "El apellido debe tener entre 2 y 50 caracteres.";
    }

    const regexTelefono = /^\d{8}$/;
    if (!regexTelefono.test(telefono.trim())) {
      return "El teléfono debe contener exactamente 8 dígitos numéricos.";
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo.trim()) || correo.trim().length > 100) {
      return "El correo debe tener un formato válido (ej. usuario@correo.com) y máximo 100 caracteres.";
    }

    return null;
  };

  const controladorFormulario = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const errorValidacion = validarFormularioCliente();
    if (errorValidacion) {
      mostrarAlerta("error", errorValidacion);
      return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      telefono: formData.telefono.trim(),
      correo: formData.correo.trim()
    };

    try {
      if (idModificando) {
        const res = await modificarUsuario(idModificando, payload);
        mostrarAlerta("success", res.mensaje || "Usuario modificado correctamente");
      } else {
        const res = await RegistrarUsuario(payload);
        mostrarAlerta("success", res.mensaje || "Usuario registrado correctamente");
      }

      cancelarEdicion();
      cargarUsuarios();
    } catch (err) {
      mostrarAlerta("error", err.message);
    }
  };

  const prepararModificar = (u) => {
    setIdModificando(u.id);
    setFormData({
      nombre: u.nombre || "",
      apellido: u.apellido || "",
      telefono: u.telefono || "",
      correo: u.correo || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const controladorEliminar = async (u) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar al usuario ${u.nombre} ${u.apellido || ""} (ID: ${u.id})?`
    );

    if (!confirmacion) return;

    try {
      const res = await eliminarUsuario(u.id);
      mostrarAlerta("success", res.mensaje || "Usuario eliminado correctamente");
      cargarUsuarios();
    } catch (err) {
      mostrarAlerta("error", err.message);
    }
  };

  const cancelarEdicion = () => {
    setIdModificando(null);
    setFormData(estadoInicialForm);
  };

  const manejarBuscar = () => {
    if (!buscar.trim()) {
      mostrarAlerta("info", "Por favor ingresa un término para buscar.");
      return;
    }
    cargarUsuarios(buscar.trim());
  };

  const limpiarBusqueda = () => {
    setBuscar("");
    cargarUsuarios();
  };

  if (cargando) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Gestión de Usuarios</h2>

      {/* Alertas de éxito o error */}
      {alerta.texto && (
        <Alert severity={alerta.tipo || "info"} style={{ marginBottom: "16px" }}>
          {alerta.texto}
        </Alert>
      )}

      {errorServidor && (
        <Alert severity="error" style={{ marginBottom: "16px" }}>
          Error del servidor: {errorServidor}
        </Alert>
      )}

      {/* Panel de Búsqueda */}
      <section className="tarjeta-panel">
        <h3>Buscar Usuario</h3>
        <div className="buscador-caja">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o correo..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && manejarBuscar()}
          />
          <button type="button" className="boton boton-azul" onClick={manejarBuscar}>
            Buscar
          </button>
          {buscar && (
            <button type="button" className="boton boton-cancelar" onClick={limpiarBusqueda}>
              Limpiar
            </button>
          )}
        </div>
      </section>

      {/* Panel del Formulario */}
      <section className="tarjeta-panel">
        <h3>{idModificando ? "Modificar Usuario" : "Registrar Nuevo Usuario"}</h3>
        <form onSubmit={controladorFormulario}>
          <div className="formulario-grid">
            <div className="campo-grupo">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Juan"
                value={formData.nombre}
              />
            </div>

            <div className="campo-grupo">
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                placeholder="Ej: Pérez"
                value={formData.apellido}
              />
            </div>

            <div className="campo-grupo">
              <label>Teléfono (8 dígitos):</label>
              <input
                type="text"
                name="telefono"
                placeholder="Ej: 98765432"
                maxLength={8}
                value={formData.telefono}
              />
            </div>

            <div className="campo-grupo">
              <label>Correo Electrónico:</label>
              <input
                type="email"
                name="correo"
                placeholder="ejemplo@correo.com"
                value={formData.correo}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="boton boton-guardar">
              {idModificando ? "Guardar Cambios" : "Registrar Usuario"}
            </button>
            {idModificando && (
              <button type="button" className="boton boton-cancelar" onClick={cancelarEdicion}>
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Panel de la Tabla */}
      <section className="tarjeta-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3>Listado de Usuarios</h3>
          <button type="button" className="boton boton-azul" onClick={() => cargarUsuarios()}>
            Refrescar
          </button>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usuarios) && usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.telefono}</td>
                  <td>{u.correo}</td>
                  <td style={{ textAlign: "center" }}>
                    <div className="acciones-celda" style={{ justifyContent: "center" }}>
                      <button
                        type="button"
                        className="boton boton-modificar"
                        onClick={() => prepararModificar(u)}
                      >
                        Modificar
                      </button>
                      <button
                        type="button"
                        className="boton boton-eliminar"
                        onClick={() => controladorEliminar(u)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                  No se encontraron usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default Usuarios;
