// components/Navbar.js

export function renderNavbar({ active }) {
  const container = document.getElementById("navbar");

  const links = [
    { page: "dashboard", label: "Dashboard" },
    { page: "eventos", label: "Eventos" },
    { page: "equipes", label: "Equipes" },
    { page: "cadastro", label: "Cadastro" }
  ];

  container.innerHTML = `
    <nav class="navbar">
      <div class="navbar-left">
        <span class="navbar-title">ECC 2026</span>
      </div>

      <div class="navbar-links">
        ${links
          .map(
            ({ page, label }) => `
              <button
                class="nav-btn ${page === active ? "active" : ""}"
                data-page="${page}"
              >
                ${label}
              </button>
            `
          )
          .join("")}
      </div>

      <div class="navbar-right">
        <button class="logout-btn" id="btn-logout">Sair</button>
      </div>
    </nav>
  `;

  /* Navegação */
  container.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = `../${btn.dataset.page}`;
    });
  });

  /* Logout */
  const logoutBtn = container.querySelector("#btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}
