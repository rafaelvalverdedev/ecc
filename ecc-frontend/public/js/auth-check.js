// ======================================
// 🔐 Autenticação
// ======================================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../auth";
  }
}
