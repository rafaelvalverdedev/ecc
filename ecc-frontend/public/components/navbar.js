// components/Navbar.js

export function Navbar({ active }) {
  return `
    <nav class="navbar">
      <div class="navbar-left">
        <span class="navbar-title">ECC 2026</span>
      </div>

      <div class="navbar-links">
        ${navLink("dashboard", "Dashboard", active)}
        ${navLink("eventos", "Eventos", active)}
        ${navLink("equipes", "Equipes", active)}
        ${navLink("cadastro", "Cadastro", active)}
      </div>

      <div class="navbar-right">
        <button class="logout-btn" id="btn-logout">Sair</button>
      </div>
    </nav>
  `;
}

function navLink(page, label, active) {
  const isActive = page === active ? "active" : "";
  return `
    <button
      class="nav-btn ${isActive}"
      data-page="${page}"
    >
      ${label}
    </button>
  `;
}


export function renderNavbar({ active }) {
  const container = document.getElementById("navbar");

  container.innerHTML = Navbar({ active });

  // Navegação
  container.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      window.location.href = `../${page}`;
    });
  });

  // Logout
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}