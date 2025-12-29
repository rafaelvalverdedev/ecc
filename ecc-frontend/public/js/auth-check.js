// ======================================
// 🔐 Autenticação
// ======================================

function requireAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token) {
    window.location.href = `${window.location.origin}/auth`;
  }
}

// ====================================
// 🔓 Logout
// ====================================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("eventoId");
  window.location.href = `${window.location.origin}/auth`;
}

