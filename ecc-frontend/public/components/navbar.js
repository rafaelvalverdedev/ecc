// components/Navbar.js

export function renderNavbar({ active }) {
  const container = document.getElementById("navbar");

  const user = getCurrentUser();
  const role = user.role;
  const usuario = user.nome;

  const links = [
    { page: "dashboard", label: "Dashboard" },
    { page: "eventos", label: "Eventos" },
    { page: "equipes", label: "Equipes" },
    { page: "cadastro", label: "Cadastro" }
  ];

  container.innerHTML = `
    <nav>
      <ul>
        <li class="logotipo">
             <img src="/assets/Logo-v2-2025-logo.png" width="120" alt="Logotipo ECC"> 
        </li>


        <li style="margin-left: auto; margin-right: 20px;">
          <span class="logado">Olá, ${usuario}</span>

          <span class="logado">(${role})</span>
        </li>


        <li class="hideMobile">
          ${links
      .map(
        ({ page, label }) => `
                <button
                  class="nav-btn ${page === active ? "active" : ""}"
                  data-page="${page}">
                  ${label}
                </button>
              `
      )
      .join("")}
          <button class="btn-logout">Sair</button>
        </li>

        <li class="hideDesktop" onclick="showSidebar()">
          <a href="#">
            <img src="/assets/menu-com.svg" width="20" alt="Abrir Menu" style="margin-right: 20px;">
          </a>
        </li>
      </ul>






      
      <ul class="sidebar">
        <li class="fechar" onclick="hideSidebar()">
          <a href="#">
            <img src="/assets/close.svg" width="30" alt="Fechar Menu" style="margin-right: 20px;">
          </a>
        </li>

        ${links
      .map(
        ({ page, label }) => `
              <li>
                <button
                  class="nav-btn ${page === active ? "active" : ""}"
                  data-page="${page}">
                  ${label}
                </button>
              </li>
            `
      )
      .join("")}

        <button class="btn-logout">Sair</button>
      </ul>
    </nav>
  `;

  /* Navegação */
  container.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = `../${btn.dataset.page}`;
    });
  });

  /* Logout */
  container.querySelectorAll(".btn-logout").forEach(btn => {
    btn.addEventListener("click", logout);
  });

  /* Sidebar */
  window.showSidebar = function () {
    document.querySelector(".sidebar").style.display = "flex";
  };

  window.hideSidebar = function () {
    document.querySelector(".sidebar").style.display = "none";
  };
}
