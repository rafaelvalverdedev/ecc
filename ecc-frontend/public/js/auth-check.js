// ======================================
// 🔐 Autenticação
// ======================================

function requireAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token) {
   alert(window.location.href = `${window.location.origin}/auth`);
  }
}

// ====================================
// 🔓 Logout
// ====================================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
    window.location.href = `${window.location.origin}/auth`;
}

