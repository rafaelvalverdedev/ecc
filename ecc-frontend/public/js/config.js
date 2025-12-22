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