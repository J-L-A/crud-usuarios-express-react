import React, { useState } from 'react'
import { RegistrarUsuario as registrarUsuario } from '../services/UsuariosService' 

function RegistrarUsuario() {
    const [nombre, setNombre] = useState("");
    const [mensaje, setMensaje] = useState("");

    const controladorUsuario = async (e) => {
        e.preventDefault(); // Evita que se recargue la página al enviar el formulario  
        try {
            const respuesta = await registrarUsuario(nombre);
            setMensaje(typeof respuesta === 'string' ? respuesta : "Usuario registrado con éxito");
            setNombre("");
        } catch (err) {
            console.error(err.message);
            setMensaje("Error al registrar: " + err.message);
        }
    }

    return (
        <>
            <h2>Registrar Usuarios</h2>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={controladorUsuario}>
                <input 
                    type="text" 
                    placeholder='Nombre' 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <button type="submit">Registrar</button>
            </form>
        </>
    )
}

export default RegistrarUsuario