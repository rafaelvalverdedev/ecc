window.APP_CONFIG = {
  // API_BASE_URL: "http://localhost:3001" // testes local
  API_BASE_URL: "https://ecc-backend-8i9l.onrender.com" // producao 
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
// 🔓 Logout
// ====================================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../auth";
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

// ============================
// 🔔 TOAST
// ============================
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

// ============================
// ❓ MODAL
// ============================
let onConfirmCallback = null;

function showConfirm(message, callback) {
  document.getElementById("modalMessage").innerText = message;
  document.getElementById("modalConfirm").style.display = "flex";
  onConfirmCallback = callback;
}

function closeModal() {
  document.getElementById("modalConfirm").style.display = "none";
  onConfirmCallback = null;
}

function confirmAction() {
  if (onConfirmCallback) onConfirmCallback();
  closeModal();
}