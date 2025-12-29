let API_BASE_URL = window.location.origin;

API_BASE_URL === "http://127.0.0.1:5500" ? API_BASE_URL = "http://127.0.0.1:3001" : API_BASE_URL = "https://ecc-backend-8i9l.onrender.com";

window.APP_CONFIG = {
  API_BASE_URL
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
function formatarDataString(dataString) {
  // Divide a string em um array: ["111", "11", "11"]
  const partes = dataString.split('-');

  // Reorganiza as partes para o formato desejado: "11/11/1111"
  const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

  return dataFormatada;
}
// ====================================
// 🔄 Formatação de valores para real
// ====================================
function formatarParaReal(numero) {
  // Cria um formatador para a localidade 'pt-BR' (português do Brasil)
  // e o estilo 'currency' (moeda), especificando 'BRL' (Real Brasileiro)
  const formatador = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Retorna o número formatado como string
  return formatador.format(numero);
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