import React from 'react';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import ListarUsuarios from './pages/Usuarios';
import Nav from './components/Nav';
import './App.css';

function App() {
  return (
    <div className="app-contenedor">
      {/* Menú lateral izquierdo */}
      <Nav />

      {/* Área de contenido principal */}
      <main className="contenido-principal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<ListarUsuarios />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
