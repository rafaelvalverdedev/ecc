import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        background: "#eee"
      }}
    >
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/eventos">Eventos</NavLink>
      <NavLink to="/equipes">Equipes</NavLink>
      <NavLink to="/cadastro">Cadastro</NavLink>
      <NavLink to="/pessoas">Pessoas</NavLink>
    </nav>
  );
}

export default Nav;
