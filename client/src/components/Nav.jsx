import React from 'react';
import { Link } from 'react-router';

function Nav() {
  return (
    <aside className="sidebar">
      <h3>Panel CRUD</h3>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/usuarios">Usuarios</Link>
      </nav>
    </aside>
  );
}

export default Nav;
