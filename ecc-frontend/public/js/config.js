window.APP_CONFIG = {
  API_BASE_URL: "http://localhost:3001" // testes local
  // API_BASE_URL: "https://ecc-backend-8i9l.onrender.com" // producao 
};



// ====================================
// 🔄 Navegação
// ====================================
function goTo(page) {
  window.location.href = `../${page}`;
}

// ====================================
// 🔄 Formatação de datas
// ====================================
function formatarDataBR(dataISO) {
  if (!dataISO) return "";

  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ====================================
// 🔄 Toggle  Geral
// ====================================
const ativarToggle = () => {
  document.querySelectorAll(".toggle-title").forEach(title => {
    title.addEventListener("click", () => {
      const id = title.dataset.id;
      const tabela = document.querySelector(`.grupo-${id}`);

      if (!tabela) return;

      const aberto = tabela.style.display !== "none";
      tabela.style.display = aberto ? "none" : "table";

      // Atualiza ícone
      title.textContent = `${aberto ? "▶" : "▼"} ${title.textContent.replace(/[▶▼]\s*/, "")}`;
    });
  });
};