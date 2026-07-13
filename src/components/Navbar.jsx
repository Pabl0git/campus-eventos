import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="topbar">
      <NavLink className="brand" to="/"><span className="brand-icon">▥</span> Campus Eventos</NavLink>
      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/eventos">Eventos</NavLink>
        <NavLink to="/participantes">Participantes</NavLink>
      </nav>
    </header>
  );
}
